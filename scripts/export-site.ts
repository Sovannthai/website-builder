/**
 * Export one website (project) as a standalone Nuxt project.
 *
 *   pnpm export:site <site> [outDir] [--only=index,product]
 *   pnpm export:site pixel-rise ../my-site
 *
 * Reads public/sites/<site>/ and exports every page it contains. The output is
 * an ordinary Nuxt project — real .vue pages, plain components, no
 * vue-wswg-editor and no builder runtime.
 */
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile, readdir, copyFile, rm } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { BLOCK_MANIFEST } from "./export/manifest";

const ROOT = process.cwd();
const PUBLIC_DIR = join(ROOT, "public");
const COMPONENTS_DIR = join(ROOT, "app", "components");

// ---------------------------------------------------------------- utilities

const ensureDir = (dir: string) => mkdir(dir, { recursive: true });

async function writeOut(outDir: string, relPath: string, contents: string) {
  const target = join(outDir, relPath);
  await ensureDir(dirname(target));
  await writeFile(target, contents, "utf-8");
}

async function copyInto(outDir: string, srcAbs: string, relPath: string) {
  const target = join(outDir, relPath);
  await ensureDir(dirname(target));
  await copyFile(srcAbs, target);
}

async function copyDir(srcDir: string, destDir: string) {
  if (!existsSync(srcDir)) return;
  await ensureDir(destDir);
  for (const entry of await readdir(srcDir, { withFileTypes: true })) {
    const s = join(srcDir, entry.name);
    const d = join(destDir, entry.name);
    if (entry.isDirectory()) await copyDir(s, d);
    else await copyFile(s, d);
  }
}

// ------------------------------------------------------------------- assets

const DATA_URI = /^data:(image\/[a-z0-9.+-]+);base64,(.+)$/i;
const EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/svg+xml": "svg",
};

/**
 * Turn inline base64 images into real files under public/img/.
 * The `seen` map is shared across every page so an image used on several pages
 * is written once and reused.
 */
async function extractImages(value: any, outDir: string, seen: Map<string, string>): Promise<any> {
  if (typeof value === "string") {
    const match = value.match(DATA_URI);
    if (!match) return value;

    const [, mime, b64] = match;
    const buffer = Buffer.from(b64, "base64");
    const hash = createHash("sha1").update(buffer).digest("hex").slice(0, 12);
    const cached = seen.get(hash);
    if (cached) return cached;

    const file = `${hash}.${EXT[mime.toLowerCase()] ?? "bin"}`;
    const url = `/img/${file}`;
    await ensureDir(join(outDir, "public", "img"));
    await writeFile(join(outDir, "public", "img", file), buffer);
    seen.set(hash, url);
    return url;
  }

  if (Array.isArray(value)) {
    const out = [];
    for (const item of value) out.push(await extractImages(item, outDir, seen));
    return out;
  }

  if (value && typeof value === "object") {
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(value)) out[k] = await extractImages(v, outDir, seen);
    return out;
  }

  return value;
}

// ------------------------------------------------- component dependency graph

/**
 * Components a component uses. Nuxt auto-imports, so usage is often only
 * visible as a tag in the template (`<ContainerWrapper>`) with no import.
 */
async function componentDeps(
  file: string
): Promise<{ components: string[]; utils: string[]; composables: string[] }> {
  const src = await readFile(file, "utf-8");
  const components = new Set<string>();
  const utils = new Set<string>();
  const composables = new Set<string>();

  for (const m of src.matchAll(/<([A-Z][A-Za-z0-9]*)[\s/>]/g)) components.add(m[1]);
  for (const m of src.matchAll(/<([a-z]+(?:-[a-z]+)+)[\s/>]/g)) {
    components.add(m[1].split("-").map((p) => p[0].toUpperCase() + p.slice(1)).join(""));
  }
  for (const m of src.matchAll(/from ['"][~@]\/components\/([A-Za-z0-9]+)\.vue['"]/g)) {
    components.add(m[1]);
  }
  for (const m of src.matchAll(/from ['"][~@]\/utils\/([A-Za-z0-9-]+)['"]/g)) utils.add(m[1]);
  for (const m of src.matchAll(/from ['"][~@]\/composables\/([A-Za-z0-9-]+)['"]/g)) {
    composables.add(m[1]);
  }

  return {
    components: [...components].filter((c) => existsSync(join(COMPONENTS_DIR, `${c}.vue`))),
    utils: [...utils],
    composables: [...composables],
  };
}

async function resolveAllDeps(entry: string[]) {
  const components = new Set<string>();
  const utils = new Set<string>();
  const composables = new Set<string>();
  const queue = [...entry];

  while (queue.length) {
    const name = queue.pop()!;
    if (components.has(name)) continue;
    const file = join(COMPONENTS_DIR, `${name}.vue`);
    if (!existsSync(file)) continue;
    components.add(name);

    const deps = await componentDeps(file);
    deps.components.forEach((c) => !components.has(c) && queue.push(c));
    deps.utils.forEach((u) => utils.add(u));
    deps.composables.forEach((c) => composables.add(c));
  }

  return { components, utils, composables };
}

// ------------------------------------------------------------ code emission

const isPrimitive = (v: any) => ["string", "number", "boolean"].includes(typeof v);
const lcFirst = (s: string) => s[0].toLowerCase() + s.slice(1);
const ucFirst = (s: string) => s[0].toUpperCase() + s.slice(1);
const attrEscape = (s: string) => s.replace(/"/g, "&quot;");

interface EmitBlock {
  type: string;
  props: Record<string, any>;
}

/**
 * Emit a page's <template> plus the consts its props need.
 * `sharedMenuKey` lets header/nav blocks reference the shared `siteMenu`
 * instead of inlining an identical copy of the menu into every page.
 */
function emitPage(blocks: EmitBlock[], opts: { layout?: string; siteMenu?: any[] } = {}) {
  const consts: string[] = [];
  const tags: string[] = [];
  const menuJson = opts.siteMenu ? JSON.stringify(opts.siteMenu) : null;

  blocks.forEach((block, i) => {
    const tag = BLOCK_MANIFEST[block.type].component;
    const attrs: string[] = [];

    for (const [key, value] of Object.entries(block.props)) {
      if (value === undefined || value === null) continue;

      // Header/nav menus: point at the shared site menu when identical
      if (key === "menus" && menuJson && JSON.stringify(value) === menuJson) {
        attrs.push(`:menus="siteMenu"`);
        continue;
      }

      if (typeof value === "string" && !value.includes("\n") && value.length <= 80) {
        attrs.push(`${key}="${attrEscape(value)}"`);
      } else if (isPrimitive(value)) {
        attrs.push(`:${key}="${typeof value === "string" ? JSON.stringify(value) : value}"`);
      } else {
        const name = `${lcFirst(tag)}${i}${ucFirst(key)}`;
        consts.push(`const ${name} = ${JSON.stringify(value, null, 2)}`);
        attrs.push(`:${key}="${name}"`);
      }
    }

    tags.push(
      attrs.length
        ? `  <${tag}\n${attrs.map((a) => `    ${a}`).join("\n")}\n  />`
        : `  <${tag} />`
    );
  });

  const scriptLines: string[] = [];
  if (opts.layout && opts.layout !== "default") {
    scriptLines.push(`definePageMeta({ layout: ${JSON.stringify(opts.layout)} })`);
  }
  scriptLines.push(...consts);

  const script = scriptLines.length ? `\n<script setup>\n${scriptLines.join("\n\n")}\n</script>\n` : "";
  return `<template>\n${tags.join("\n")}\n</template>\n${script}`;
}

function emitLayout(settings: Record<string, any>) {
  const PAD: Record<string, string> = { none: "0", small: "1rem", medium: "2rem", large: "4rem" };
  const side = PAD[settings?.pagePadding ?? "small"] ?? "1rem";
  const maxWidth = settings?.containerWidth === "full" ? "100%" : `${settings?.maxWidth ?? 1280}px`;
  const paddingBottom = settings?.footerSpacing ? "4rem" : "0";

  return `<template>
  <v-app class="site-layout">
    <slot />
  </v-app>
</template>

<style scoped>
.site-layout {
  width: 100%;
  max-width: ${maxWidth};
  margin: 0 auto;
  padding-left: ${side};
  padding-right: ${side};
  padding-bottom: ${paddingBottom};
  /* Published so full-bleed blocks (the slider) can cancel it */
  --page-side-padding: ${side};
}
</style>
`;
}

function emitNuxtConfig() {
  return `import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  ssr: false,
  runtimeConfig: {
    public: {
      // Backend for blocks that load live data. Normally configured in
      // public/env.json (read at runtime, so no rebuild needed); this is only
      // an optional deploy-time override.
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "",
    },
  },
  build: { transpile: ["vuetify"] },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error vuetify plugin type
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
  ],
  vite: {
    vue: { template: { transformAssetUrls } },
  },
  css: ["@mdi/font/css/materialdesignicons.css", "~/assets/main.scss"],
});
`;
}

function emitPackageJson(name: string, needsSwiper: boolean) {
  const deps: Record<string, string> = {
    "@mdi/font": "^7.4.47",
    nuxt: "^4.2.2",
    vue: "^3.5.26",
    "vue-router": "^4.6.4",
    vuetify: "^3.11.6",
    "vite-plugin-vuetify": "^2.1.2",
  };
  if (needsSwiper) deps.swiper = "^14.0.5";

  return `${JSON.stringify(
    {
      name,
      private: true,
      type: "module",
      scripts: {
        build: "nuxt build",
        dev: "nuxt dev",
        generate: "nuxt generate",
        preview: "nuxt preview",
        postinstall: "nuxt prepare",
      },
      dependencies: Object.fromEntries(Object.entries(deps).sort()),
      devDependencies: { "sass-embedded": "^1.97.1" },
    },
    null,
    2
  )}\n`;
}

/**
 * Page slug -> file path under app/pages/.
 * "index" is the site root; everything else becomes /<slug>.
 */
const pageFilePath = (slug: string) => `app/pages/${slug === "index" ? "index" : slug}.vue`;
const pageRoute = (slug: string) => (slug === "index" ? "/" : `/${slug}`);

// ---------------------------------------------------------------------- main

async function main() {
  const args = process.argv.slice(2);
  const only = args
    .find((a) => a.startsWith("--only="))
    ?.slice("--only=".length)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const positional = args.filter((a) => !a.startsWith("--"));
  const site = positional[0];
  const outDir = resolve(ROOT, positional[1] || `../exported-${site ?? "site"}`);

  const SITES_DIR = join(PUBLIC_DIR, "sites");
  const available = existsSync(SITES_DIR)
    ? (await readdir(SITES_DIR, { withFileTypes: true }))
        .filter((e) => e.isDirectory())
        .map((e) => e.name)
        .sort()
    : [];

  if (!site) {
    console.error(`✗ Which website? Usage: pnpm export:site <site> [outDir]`);
    console.error(`  available: ${available.join(", ") || "(none)"}`);
    process.exit(1);
  }
  if (!available.includes(site)) {
    console.error(`✗ No website "${site}" (looked in public/sites/)`);
    console.error(`  available: ${available.join(", ") || "(none)"}`);
    process.exit(1);
  }

  const siteDir = join(SITES_DIR, site);
  const pagesDir = join(siteDir, "pages");

  // 1. discover every saved page in this site
  const files = existsSync(pagesDir) ? await readdir(pagesDir) : [];
  let slugs = files
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""))
    .sort();
  if (only?.length) slugs = slugs.filter((s) => only.includes(s));

  if (!slugs.length) {
    console.error(`✗ No pages found in public/sites/${site}/pages/`);
    process.exit(1);
  }

  console.log(`→ exporting "${site}" (${slugs.length} page(s)) to ${outDir}`);
  console.log(`  pages: ${slugs.join(", ")}`);
  await rm(outDir, { recursive: true, force: true });
  await ensureDir(outDir);

  // 2. shared menu (single source of truth across this site's pages)
  let siteMenu: any[] = [];
  const menuPath = join(siteDir, "menu.json");
  if (existsSync(menuPath)) {
    try {
      const parsed = JSON.parse(await readFile(menuPath, "utf-8"));
      if (Array.isArray(parsed?.menus)) siteMenu = parsed.menus;
    } catch {
      /* ignore malformed menu */
    }
  }

  // 3. process each page
  const seenImages = new Map<string, string>();
  const pages: Array<{ slug: string; blocks: EmitBlock[]; settings: Record<string, any> }> = [];
  const unmapped = new Set<string>();

  for (const slug of slugs) {
    const schema = JSON.parse(await readFile(join(pagesDir, `${slug}.json`), "utf-8"));
    const rawBlocks: any[] = schema.blocks ?? [];
    rawBlocks.forEach((b) => !BLOCK_MANIFEST[b.type] && unmapped.add(b.type));

    const cleaned = await extractImages(rawBlocks, outDir, seenImages);
    const blocks: EmitBlock[] = cleaned
      .filter((b: any) => BLOCK_MANIFEST[b.type])
      .map((b: any) => ({ type: b.type, props: BLOCK_MANIFEST[b.type].props(b) }));

    pages.push({ slug, blocks, settings: schema.settings ?? {} });
  }

  if (unmapped.size) console.warn(`  ! skipping unmapped block types: ${[...unmapped].join(", ")}`);
  console.log(`  • extracted ${seenImages.size} image(s) to public/img/`);

  // 4. layouts — pages can carry different page settings, so emit one layout per
  //    distinct settings combination and point pages at the right one.
  const layoutByKey = new Map<string, string>();
  const layoutSettings = new Map<string, Record<string, any>>();
  const layoutForPage = new Map<string, string>();

  // index (or the first page) defines "default" so most pages need no override
  const ordered = [...pages].sort((a, b) => (a.slug === "index" ? -1 : b.slug === "index" ? 1 : 0));
  for (const page of ordered) {
    const key = JSON.stringify([
      page.settings.containerWidth ?? "boxed",
      page.settings.maxWidth ?? "1280",
      page.settings.pagePadding ?? "small",
      page.settings.footerSpacing ?? false,
    ]);
    if (!layoutByKey.has(key)) {
      const name = layoutByKey.size === 0 ? "default" : `page-${page.slug}`;
      layoutByKey.set(key, name);
      layoutSettings.set(name, page.settings);
    }
    layoutForPage.set(page.slug, layoutByKey.get(key)!);
  }
  for (const [name, settings] of layoutSettings) {
    await writeOut(outDir, `app/layouts/${name}.vue`, emitLayout(settings));
  }
  console.log(`  • ${layoutSettings.size} layout(s): ${[...layoutSettings.keys()].join(", ")}`);

  // 5. components used across all pages (plus everything they use)
  const entryComponents = pages
    .flatMap((p) => p.blocks)
    .map((b) => BLOCK_MANIFEST[b.type])
    .filter((m) => !m.sourceFile)
    .map((m) => m.component);
  const { components, utils, composables } = await resolveAllDeps([...new Set(entryComponents)]);

  for (const name of components) {
    await copyInto(outDir, join(COMPONENTS_DIR, `${name}.vue`), `app/components/${name}.vue`);
  }
  for (const name of composables) {
    const src = join(ROOT, "app", "composables", `${name}.ts`);
    if (existsSync(src)) {
      await copyInto(outDir, src, `app/composables/${name}.ts`);
      // composables pull in utils of their own (e.g. api) — follow those too
      for (const m of (await readFile(src, "utf-8")).matchAll(
        /from ['"][~@]\/utils\/([A-Za-z0-9-]+)['"]/g
      )) {
        utils.add(m[1]);
      }
    }
  }
  for (const util of utils) {
    const src = join(ROOT, "app", "utils", `${util}.ts`);
    if (existsSync(src)) await copyInto(outDir, src, `app/utils/${util}.ts`);
  }
  for (const block of pages.flatMap((p) => p.blocks)) {
    const mapping = BLOCK_MANIFEST[block.type];
    if (!mapping.sourceFile) continue;
    const src = join(ROOT, mapping.sourceFile);
    if (existsSync(src) && !components.has(mapping.component)) {
      await copyInto(outDir, src, `app/components/${mapping.component}.vue`);
      components.add(mapping.component);
    }
  }
  console.log(`  • copied ${components.size} component(s), ${utils.size} util(s), ${composables.size} composable(s)`);

  // 6. shared assets + vuetify plugin
  await copyDir(join(ROOT, "app", "assets"), join(outDir, "app", "assets"));
  const vuetifyPlugin = join(ROOT, "app", "plugins", "vuetify.ts");
  if (existsSync(vuetifyPlugin)) await copyInto(outDir, vuetifyPlugin, "app/plugins/vuetify.ts");
  const publicImg = join(PUBLIC_DIR, "img");
  if (existsSync(publicImg)) await copyDir(publicImg, join(outDir, "public", "img"));

  // 7. generated source
  if (siteMenu.length) {
    await writeOut(
      outDir,
      "app/utils/site-menu.ts",
      `// Shared navigation, used by every page's header.\n` +
        `// Auto-imported by Nuxt, so pages can use \`siteMenu\` directly.\n` +
        `export const siteMenu = ${JSON.stringify(siteMenu, null, 2)}\n`
    );
  }

  for (const page of pages) {
    await writeOut(
      outDir,
      pageFilePath(page.slug),
      emitPage(page.blocks, {
        layout: layoutForPage.get(page.slug),
        siteMenu: siteMenu.length ? siteMenu : undefined,
      })
    );
  }

  await writeOut(
    outDir,
    "app/app.vue",
    `<template>\n  <NuxtLayout>\n    <NuxtPage />\n  </NuxtLayout>\n</template>\n`
  );
  await writeOut(outDir, "nuxt.config.ts", emitNuxtConfig());
  await writeOut(outDir, "package.json", emitPackageJson(site, components.has("Slider")));
  await writeOut(outDir, "tsconfig.json", `{\n  "extends": "./.nuxt/tsconfig.json"\n}\n`);
  await writeOut(
    outDir,
    ".gitignore",
    ["node_modules", ".nuxt", ".output", "dist", ".DS_Store"].join("\n") + "\n"
  );

  // Blocks that pull live data need a backend; make it obvious how to point
  // the exported site at one.
  const dynamicBlocks = pages
    .flatMap((p) => p.blocks)
    .filter((b) => b.props.apiCollection)
    .map((b) => `${BLOCK_MANIFEST[b.type].component} → \`${b.props.apiCollection}\``);

  // Carry the builder's env.json across (keeping any extra keys) so the
  // exported site talks to the same backend out of the box. It's read at
  // runtime, so the URL can be changed on a deployed site without rebuilding.
  let envJson: Record<string, any> = { BACKEND_ADDR: "http://localhost:8055" };
  try {
    envJson = JSON.parse(await readFile(join(PUBLIC_DIR, "env.json"), "utf-8"));
  } catch {
    /* no env.json in the builder — ship the localhost default */
  }
  await writeOut(outDir, "public/env.json", `${JSON.stringify(envJson, null, 2)}\n`);

  const routeList = pages.map((p) => `- \`${pageRoute(p.slug)}\` → \`${pageFilePath(p.slug)}\``);
  const apiSection = dynamicBlocks.length
    ? `\n## Live data\n\nThese blocks load from the backend at runtime:\n\n` +
      dynamicBlocks.map((d) => `- ${d}`).join("\n") +
      `\n\nThe backend URL lives in \`public/env.json\`:\n\n` +
      `\`\`\`json\n{ "BACKEND_ADDR": "${envJson.BACKEND_ADDR ?? ""}" }\n\`\`\`\n\n` +
      `It's read at runtime, so \`pnpm install && pnpm dev\` works as-is, and a\n` +
      `deployed site can be pointed at another backend by editing that one file\n` +
      `— no rebuild. \`NUXT_PUBLIC_API_BASE\` overrides it if you prefer env vars.\n\n` +
      `Each block accepts a collection key (\`news\`), a path (\`/api/news\`) or a\n` +
      `full URL, and its \`apiFields\` prop maps API field names onto what the\n` +
      `component renders.\n`
    : "";

  await writeOut(
    outDir,
    "README.md",
    `# Exported site\n\nA plain Nuxt project exported from the page builder.\n\n` +
      `\`\`\`bash\npnpm install\npnpm dev\n\`\`\`\n\n## Pages\n\n${routeList.join("\n")}\n\n` +
      `Everything here is ordinary source — edit the pages and components directly.\n` +
      `There is no builder runtime and no vue-wswg-editor dependency.\n` +
      apiSection
  );

  // 8. report menu links that have no matching page
  const routes = new Set(pages.map((p) => pageRoute(p.slug)));
  const dangling = siteMenu
    .flatMap((m: any) => [m, ...(m.children ?? [])])
    .map((m: any) => m?.path)
    .filter((path: string) => path && path.startsWith("/") && !routes.has(path));

  console.log(`  • generated ${pages.length} page(s): ${[...routes].join(", ")}`);
  if (dangling.length) {
    console.warn(
      `  ! menu links with no matching page (they will 404): ${[...new Set(dangling)].join(", ")}`
    );
    console.warn(`    create those pages in the builder, then export again.`);
  }

  console.log(`✓ done — cd ${relative(ROOT, outDir)} && pnpm install && pnpm dev`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
