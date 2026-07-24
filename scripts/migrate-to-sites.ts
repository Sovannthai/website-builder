/**
 * Migrate flat page-builder content into per-site folders.
 *
 *   pnpm migrate:sites [siteName]
 *
 *   public/pb-<page>-schema.json  ->  public/sites/<site>/pages/<page>.json
 *   public/menu.json              ->  public/sites/<site>/menu.json
 *
 * Copies rather than moves: the originals are left in place so nothing is lost
 * if the migration needs revisiting. Delete them once you're happy.
 */
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const ROOT = process.cwd();
const PUBLIC_DIR = join(ROOT, "public");

async function main() {
  const site = (process.argv[2] || "default").replace(/[^a-z0-9_-]/gi, "_");
  const siteDir = join(PUBLIC_DIR, "sites", site);
  const pagesDir = join(siteDir, "pages");

  const files = existsSync(PUBLIC_DIR) ? await readdir(PUBLIC_DIR) : [];
  const schemas = files.filter((f) => /^pb-.+-schema\.json$/.test(f));

  if (!schemas.length && !existsSync(join(PUBLIC_DIR, "menu.json"))) {
    console.log("Nothing to migrate — no pb-*-schema.json or menu.json found.");
    return;
  }

  await mkdir(pagesDir, { recursive: true });
  console.log(`→ migrating into public/sites/${site}/`);

  for (const file of schemas) {
    const page = file.replace(/^pb-/, "").replace(/-schema\.json$/, "");
    const target = join(pagesDir, `${page}.json`);
    if (existsSync(target)) {
      console.log(`  · ${page} already migrated, skipping`);
      continue;
    }
    await writeFile(target, await readFile(join(PUBLIC_DIR, file), "utf-8"), "utf-8");
    console.log(`  ✓ ${file} -> sites/${site}/pages/${page}.json`);
  }

  const menuSrc = join(PUBLIC_DIR, "menu.json");
  const menuTarget = join(siteDir, "menu.json");
  if (existsSync(menuSrc) && !existsSync(menuTarget)) {
    await writeFile(menuTarget, await readFile(menuSrc, "utf-8"), "utf-8");
    console.log(`  ✓ menu.json -> sites/${site}/menu.json`);
  }

  console.log(
    `✓ done. Originals left in public/ — delete them once you've confirmed the editor works.`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
