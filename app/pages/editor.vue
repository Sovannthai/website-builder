<template>
  <div class="editor-wrapper">
    <!-- Toolbar -->
    <div class="editor-toolbar">
      <!-- Websites (projects) -->
      <div class="editor-toolbar__pages" ref="sitesMenuRef">
        <button class="editor-toolbar__btn editor-toolbar__btn--menu" @click="toggleSitesMenu">
          🌐 {{ siteName }} ▾
        </button>
        <div v-if="sitesMenuOpen" class="editor-toolbar__menu">
          <p v-if="sitesLoading" class="editor-toolbar__menu-empty">Loading…</p>
          <button
            v-for="s in sites"
            :key="s"
            class="editor-toolbar__menu-item"
            :class="{ active: s === siteName }"
            @click="selectSite(s)"
          >
            {{ s }}
          </button>
          <button class="editor-toolbar__menu-item editor-toolbar__menu-item--new" @click="createSite">
            + New website
          </button>
        </div>
      </div>

      <!-- Pages within the current website -->
      <div class="editor-toolbar__pages" ref="pagesMenuRef">
        <button class="editor-toolbar__btn editor-toolbar__btn--menu" @click="togglePagesMenu">
          Pages ▾
        </button>
        <div v-if="pagesMenuOpen" class="editor-toolbar__menu">
          <p v-if="pagesLoading" class="editor-toolbar__menu-empty">Loading…</p>
          <p v-else-if="!pages.length" class="editor-toolbar__menu-empty">No pages yet</p>
          <button
            v-for="p in pages"
            :key="p"
            class="editor-toolbar__menu-item"
            :class="{ active: p === pageName }"
            @click="selectPage(p)"
          >
            {{ p }}
          </button>
          <button class="editor-toolbar__menu-item editor-toolbar__menu-item--new" @click="createPage">
            + New page
          </button>
        </div>
      </div>

      <span class="editor-toolbar__page">Editing: <strong>{{ pageName }}</strong></span>
      <div class="editor-toolbar__actions">
        <span v-if="imageNotice" class="editor-toolbar__status editor-toolbar__status--image">{{ imageNotice }}</span>
        <span v-if="saveStatus" class="editor-toolbar__status" :class="saveStatus">{{ saveMessage }}</span>
        <button class="editor-toolbar__btn" @click="savePage" :disabled="saving">
          {{ saving ? 'Saving…' : 'Save Page' }}
        </button>
        <a class="editor-toolbar__btn editor-toolbar__btn--preview" :href="`/pb/${siteName}/${pageName}`" target="_blank">
          Preview ↗
        </a>
      </div>
    </div>
      <WswgPageBuilder
        v-if="registryReady"
        v-model="pageData"
        blocks-key="blocks"
        settings-key="settings"
        theme="default"
        :url="`/editor`"
        :editable="true"
        default-block-margin="small"
        style="--editor-height: calc(100vh - 48px); height: calc(100vh - 48px); width: 100%;"
      />
      <div v-else class="editor-loading">
        <p>Loading editor blocks…</p>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { WswgPageBuilder, initialiseRegistry, getLayouts } from "vue-wswg-editor";
import { prepareImageForUpload } from "~/utils/image-resize";

definePageMeta({ layout: false });

const route = useRoute();

// The builder hosts several websites; each is a "site" (project) folder with
// its own pages and shared menu. Both are driven by the URL:
//   /editor?site=<project>&page=<page>
const DEFAULT_SITE = "default";
const siteName = computed(() => String(route.query.site || DEFAULT_SITE));
const pageName = computed(() => String(route.query.page || "index"));

const registryReady = ref(false);
const saving = ref(false);
const saveStatus = ref<"success" | "error" | "">("");
const saveMessage = ref("");

const pageData = ref<Record<string, any>>({
  blocks: [],
  settings: { layout: "default" },
});

const pagesMenuOpen = ref(false);
const pagesMenuRef = ref<HTMLElement | null>(null);
const pages = ref<string[]>([]);
const pagesLoading = ref(false);

const sitesMenuOpen = ref(false);
const sitesMenuRef = ref<HTMLElement | null>(null);
const sites = ref<string[]>([]);
const sitesLoading = ref(false);

onClickOutside(pagesMenuRef, () => closePagesMenu());
onClickOutside(sitesMenuRef, () => (sitesMenuOpen.value = false));

function togglePagesMenu() {
  pagesMenuOpen.value = !pagesMenuOpen.value;
  if (pagesMenuOpen.value) loadPagesList();
}

function closePagesMenu() {
  pagesMenuOpen.value = false;
}

function toggleSitesMenu() {
  sitesMenuOpen.value = !sitesMenuOpen.value;
  if (sitesMenuOpen.value) loadSitesList();
}

async function loadPagesList() {
  pagesLoading.value = true;
  try {
    const res = await $fetch<{ pages: string[] }>("/api/pages", {
      query: { site: siteName.value },
    });
    pages.value = res.pages;
  } catch {
    pages.value = [];
  } finally {
    pagesLoading.value = false;
  }
}

async function loadSitesList() {
  sitesLoading.value = true;
  try {
    const res = await $fetch<{ sites: string[] }>("/api/sites");
    sites.value = res.sites;
  } catch {
    sites.value = [];
  } finally {
    sitesLoading.value = false;
  }
}

function selectPage(name: string) {
  closePagesMenu();
  if (name === pageName.value) return;
  navigateTo({ path: "/editor", query: { site: siteName.value, page: name } });
}

function selectSite(name: string) {
  sitesMenuOpen.value = false;
  if (name === siteName.value) return;
  // Switching websites starts on that site's home page.
  navigateTo({ path: "/editor", query: { site: name, page: "index" } });
}

async function createSite() {
  sitesMenuOpen.value = false;
  const name = window.prompt("Name for the new website (letters, numbers, - and _):");
  if (!name?.trim()) return;
  try {
    const res = await $fetch<{ site: string }>("/api/create-site", {
      method: "POST",
      body: { site: name.trim() },
    });
    await loadSitesList();
    navigateTo({ path: "/editor", query: { site: res.site, page: "index" } });
  } catch {
    window.alert("Could not create that website.");
  }
}

function createPage() {
  closePagesMenu();
  const name = window.prompt("Name for the new page (letters, numbers, - and _):");
  if (!name?.trim()) return;
  const slug = name.trim().replace(/[^a-z0-9_-]/gi, "-").toLowerCase();
  navigateTo({ path: "/editor", query: { site: siteName.value, page: slug } });
}

/** Static path of a page's saved JSON: public/sites/<site>/pages/<page>.json */
const pageJsonUrl = (site: string, page: string) => `/sites/${site}/pages/${page}.json`;

async function loadPageData() {
  pageData.value = { blocks: [], settings: { layout: "default" } };

  try {
    const existing = await $fetch<Record<string, any>>(pageJsonUrl(siteName.value, pageName.value));
    if (existing?.blocks) {
      pageData.value = existing;
    } else {
      await seedFromHomePage();
    }
  } catch {
    // Page doesn't exist yet — seed a new one from this site's home page so it
    // starts with the shared header/footer instead of a blank canvas.
    await seedFromHomePage();
  }
  applyLayoutSettingDefaults();
  await applySharedMenu();
}

async function seedFromHomePage() {
  if (pageName.value === "index") return; // nothing to seed from
  try {
    const home = await $fetch<Record<string, any>>(pageJsonUrl(siteName.value, "index"));
    const blocks = home?.blocks ?? [];
    if (!blocks.length) return;
    const header = blocks.find((b: any) => b?.type === "AppHeader");
    const footer = blocks.find((b: any) => b?.type === "Footer");
    pageData.value = {
      blocks: JSON.parse(JSON.stringify([header, footer].filter(Boolean))),
      settings: { ...(home.settings ?? { layout: "default" }) },
    };
  } catch {
    // No home page yet — leave the canvas empty
  }
}

// The header navigation is shared across all pages. Overwrite any AppHeader
// block's menus with the canonical shared menu so every page edits the same one.
async function applySharedMenu() {
  try {
    const { menus } = await $fetch<{ menus: any[] }>("/api/menu", {
      query: { site: siteName.value },
    });
    if (!Array.isArray(menus) || menus.length === 0) return;
    for (const block of pageData.value.blocks || []) {
      if (block?.type === "AppHeader") {
        block.menus = JSON.parse(JSON.stringify(menus));
      }
    }
  } catch {
    // No shared menu yet — keep the page's own menus
  }
}

// Seed the active layout's page-setting defaults into pageData.settings so the
// Page settings panel reflects the real defaults instead of blank fields.
// Defaults are read from the layout's own `fields` config (single source of
// truth) — a no-op until the registry is initialised.
function applyLayoutSettingDefaults() {
  const layouts = getLayouts();
  if (!Object.keys(layouts).length) return;

  if (!pageData.value.settings) pageData.value.settings = { layout: "default" };
  const settings = pageData.value.settings;
  const layout = layouts[settings.layout || "default"] || layouts.default;
  const fields = layout?.fields || {};

  for (const [key, config] of Object.entries<any>(fields)) {
    if (settings[key] === undefined && config?.default !== undefined) {
      settings[key] = config.default;
    }
  }
}

// Reload when either the page or the website changes.
watch([pageName, siteName], () => {
  loadPageData();
});

// --- Image upload interception -------------------------------------------
// The editor's image field rejects files >10MB or outside jpeg/png/gif/webp,
// and on rejection it keeps the *previous* image — which reads as "the preview
// didn't update". Its limits aren't configurable, so downscale/re-encode the
// picked file here, in the capture phase, before the field's own change
// handler ever sees it.
const imageNotice = ref("");
let fileChangeInterceptor: ((event: Event) => void) | null = null;

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))}KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

async function handleFilePicked(event: Event) {
  const input = event.target as HTMLInputElement | null;
  if (!input || input.tagName !== "INPUT" || input.type !== "file") return;
  if (!input.closest(".image-upload-field")) return;

  // Our own re-dispatch — let it through to the editor untouched.
  if (input.dataset.preparedImage === "1") {
    delete input.dataset.preparedImage;
    return;
  }

  const file = input.files?.[0];
  if (!file) return;

  // Hold the event back until we've had a chance to shrink the file.
  event.stopImmediatePropagation();
  event.preventDefault();

  imageNotice.value = "Processing image…";
  let result;
  try {
    result = await prepareImageForUpload(file);
  } catch {
    result = { file, changed: false, problem: "Could not process this image." };
  }

  if (result.problem) {
    imageNotice.value = result.problem;
  } else if (result.changed) {
    imageNotice.value = `Image optimised: ${formatBytes(file.size)} → ${formatBytes(result.file.size)}`;
  } else {
    imageNotice.value = "";
  }
  setTimeout(() => { imageNotice.value = ""; }, 5000);

  const transfer = new DataTransfer();
  transfer.items.add(result.file);
  input.files = transfer.files;
  input.dataset.preparedImage = "1";
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

onMounted(async () => {
  await loadPageData();
  await initialiseRegistry();
  applyLayoutSettingDefaults();
  registryReady.value = true;

  fileChangeInterceptor = (event: Event) => { void handleFilePicked(event); };
  document.addEventListener("change", fileChangeInterceptor, true);
});

onBeforeUnmount(() => {
  if (fileChangeInterceptor) {
    document.removeEventListener("change", fileChangeInterceptor, true);
    fileChangeInterceptor = null;
  }
});

async function savePage() {
  saving.value = true;
  saveStatus.value = "";
  try {
    await $fetch("/api/save-page", {
      method: "POST",
      body: { site: siteName.value, page: pageName.value, data: pageData.value },
    });
    saveStatus.value = "success";
    saveMessage.value = "Saved!";
  } catch {
    saveStatus.value = "error";
    saveMessage.value = "Save failed";
  } finally {
    saving.value = false;
    setTimeout(() => { saveStatus.value = ""; saveMessage.value = ""; }, 3000);
  }
}
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}
.editor-wrapper {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
:deep(.wswg-page-builder-body) {
  height: 100vh !important;
}
.editor-toolbar {
  height: 48px;
  min-height: 48px;
  background: #1e1e2e;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  gap: 1rem;
  z-index: 100;
}
.editor-toolbar__page {
  font-size: 0.85rem;
  color: #aaa;
}
.editor-toolbar__pages {
  position: relative;
}
.editor-toolbar__btn--menu {
  background: #374151;
}
.editor-toolbar__menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  min-width: 180px;
  max-height: 320px;
  overflow-y: auto;
  background: #2a2a3d;
  border: 1px solid #3f3f56;
  border-radius: 6px;
  padding: 0.35rem;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  z-index: 200;
}
.editor-toolbar__menu-item {
  text-align: left;
  padding: 0.4rem 0.6rem;
  border-radius: 4px;
  border: none;
  background: transparent;
  color: #eee;
  font-size: 0.82rem;
  cursor: pointer;
}
.editor-toolbar__menu-item:hover {
  background: #3f3f56;
}
.editor-toolbar__menu-item.active {
  background: #2563eb;
  color: white;
  font-weight: 600;
}
.editor-toolbar__menu-empty {
  margin: 0;
  padding: 0.4rem 0.6rem;
  font-size: 0.8rem;
  color: #999;
}
.editor-toolbar__actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.editor-toolbar__status {
  font-size: 0.8rem;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
}
.editor-toolbar__status.success { background: #166534; color: #bbf7d0; }
.editor-toolbar__status.error   { background: #7f1d1d; color: #fecaca; }
.editor-toolbar__status--image  { background: #1e3a8a; color: #dbeafe; }
.editor-toolbar__btn {
  padding: 0.35rem 0.9rem;
  font-size: 0.82rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  background: #2563eb;
  color: white;
  font-weight: 600;
  text-decoration: none;
}
.editor-toolbar__btn:disabled { opacity: 0.6; cursor: not-allowed; }
.editor-toolbar__btn--preview { background: #374151; }
.editor-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  font-family: sans-serif;
  color: #666;
  font-size: 1rem;
}
</style>
