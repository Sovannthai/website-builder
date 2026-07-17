# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm install       # install deps (pnpm-lock.yaml is the source of truth)
pnpm dev           # start dev server on http://localhost:3000
pnpm build         # production build
pnpm generate      # static generation
pnpm preview       # preview a production build locally
pnpm generate:page <name>   # scaffold app/pages/<name>/index.vue for the legacy schema-driven system (see below)
```

There is no test suite or lint script configured in `package.json`.

## Big picture

This is a Nuxt 4 + Vuetify site whose pages are assembled from JSON-described blocks. There are **two parallel, unrelated content systems** living side by side — don't conflate them:

1. **Legacy static-schema pages** — `public/schema.json`, `public/blogs-schema.json`, shape `{ layouts: [{ type, component_key, data }] }`. Rendered by hand-written pages (`app/pages/index.vue`, `app/pages/blogs/index.vue`, `app/pages/about_us/index.vue`) that resolve `component_key` through `app/utils/component-map.ts` against the plain display components in `app/components/`. New pages of this kind are scaffolded with `pnpm generate:page <name>`.
2. **WYSIWYG page-builder system** (the active one, via the `vue-wswg-editor` package) — editable at `/editor?page=<name>`, rendered publicly at `/pb/<name>`. This is what `app/pages/editor.vue` and `app/pages/pb/[page].vue` drive.

### The page-builder editor flow

- `app/pages/editor.vue` mounts `WswgPageBuilder` (from `vue-wswg-editor`) with `theme="default"`. It loads `GET /pb-<page>-schema.json` (a static file under `public/`) for the page's current content, or falls back to seeding from `pb-index-schema.json`'s first/last block.
- Saving posts to `server/api/save-page.post.ts`, which sanitises the page name and writes `public/pb-<page>-schema.json` directly to disk (`writeFileSync`) — there is no database involved.
- `server/api/pages.get.ts` lists all `pb-*-schema.json` files in `public/` (strips the `pb-`/`-schema.json` wrapper) and backs the "Pages" menu in the editor toolbar, letting you switch which page you're editing without leaving `/editor`.
- **Shared header menu:** the `AppHeader` block's nav is shared across every page via a single `public/menu.json` (read by `server/api/menu.get.ts`). `save-page.post.ts` writes the saved page's `AppHeader` menus to `menu.json`, and both `editor.vue` (on load) and `pb/[page].vue` (on render) inject that canonical menu into any `AppHeader` block — so editing the menu on one page updates it everywhere. Each page schema still stores a `menus` copy on its `AppHeader` block, but it's vestigial: the injected shared menu always overrides it (guarded to skip injection when `menu.json` is empty).
- `app/pages/pb/[page].vue` renders a saved page publicly via `PageRenderer` (also from `vue-wswg-editor`), 404ing if no schema file exists for that slug.

### Page-builder themes (`app/page-builder/`)

The `vue-wswg-editor` Vite plugin (registered in `nuxt.config.ts` with `rootDir: "@page-builder"`, aliased to `./app/page-builder`) scans for **theme folders**, each identified by a `theme.config.js`. Only `app/page-builder/default/` currently qualifies as a real theme:

```
app/page-builder/default/
  theme.config.js        # theme metadata (title, version, tags…)
  layout/default.vue      # wraps rendered blocks in a <v-app>
  iframe-app.ts            # installs Vuetify into the editor's isolated iframe preview app
  blocks/<name>/
    <Name>.vue             # the block as seen by the editor/renderer
    fields.ts               # editable field definitions (createField.text/select/color/image/object/repeater/textarea)
```

A block's `<Name>.vue` typically just maps the fields declared in `fields.ts` onto props of the corresponding plain display component in `app/components/` (e.g. `default/blocks/banner/Banner.vue` wraps `~/components/Banner.vue`). When adding or editing a block, keep `fields.ts` and the block component's `defineProps` in sync.

**Page settings** (the panel behind the ⚙ toolbar button, distinct from per-block settings) are driven by the *layout* component, not a separate config. `default/layout/default.vue` declares a `fields` object (same `createField.*` API as blocks, `group` becomes a settings tab) via a normal `<script>` block — `defineOptions` is avoided there because the fields reference the runtime `createField` import. Those settings are stored on `pageData.settings` and spread onto the layout as props by both renderers, so the layout reads them (`containerWidth`, `maxWidth`, `pagePadding`, `footerSpacing`) and applies inline styles. Two things make this work end to end: `editor.vue` seeds the field defaults into `pageData.settings` via `getLayouts()` after registry init (otherwise the dropdowns render blank), and `pb/[page].vue` passes `:with-layout="true"` to `PageRenderer` (which defaults `withLayout` to `false`) so the layout wrapper — and therefore the settings — actually apply on the published page, matching the editor canvas.

**Gotcha:** `app/page-builder/blocks/` and `app/page-builder/layout/` also exist at the top level, outside `default/`, and contain older/different implementations of the same blocks (no `theme.config.js` next to them, so the editor plugin never loads them). Don't confuse these with the live `default/` theme — if you're fixing a block that shows up in the editor, edit the copy under `app/page-builder/default/blocks/`.

### Vuetify inside the iframe preview

`vue-wswg-editor` renders the live block preview inside an isolated iframe with its own Vue app. Two pieces of glue code exist solely to make Vuetify work there:

- `nuxt.config.ts` defines `wswgVuetifyInjectorPlugin()`, a Vite plugin that intercepts the `virtual:wswg-iframe-app` module and wraps `createIframeApp` to `app.use(createVuetify(...))` before any blocks render.
- `app/plugins/vue-wswg-editor.client.ts` checks `isWswgIframePreview()` and stubs out Nuxt's own app mount inside that iframe context, so Nuxt doesn't fight with the editor's isolated app for `#app`.
- `server/middleware/wswg-iframe-fix.ts` redirects `/@id/...` requests to `/_nuxt/@id/...` — the editor's generated iframe HTML assumes Vite is mounted at the root, but Nuxt mounts its dev server under `/_nuxt/`.

### Layouts

`app/layouts/default.vue` is the site-wide Nuxt layout (renders `AppHeader`/`Footer`, pulls nav menus from `schema.json`'s `header` layout entry) and is skipped entirely for any `/pb/*` route. `app/pages/editor.vue` opts out of the Nuxt layout altogether (`definePageMeta({ layout: false })`) since the editor is a full-bleed tool UI. The page-builder's own `layout/default.vue` (under `app/page-builder/default/`) is unrelated — it only wraps blocks inside the editor canvas/renderer, not the outer site chrome.

### Backend integration

`app/utils/api.ts` fetches `BACKEND_ADDR` from `GET /env` (served by `server/routes/env.ts`, which reads `public/env.json`) and then calls a REST API at `${baseUrl}/items/<collection>` (Directus-style). `app/middleware/setup.global.ts` runs this `setBaseUrl()` once globally before route navigation. `app/pages/blogs/index.vue` is the main consumer, fetching `news_topic`/`news` collections.
