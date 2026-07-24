<script setup lang="ts">
import { PageRenderer } from "vue-wswg-editor";

// Opt out of the site-wide Nuxt layout: it renders its own <v-app>, and the
// page-builder layout renders one too. Nesting <v-app> breaks Vuetify's layout
// system (v-navigation-drawer fails to hide off-canvas).
definePageMeta({ layout: false });

// The site layout used to supply this neutral backdrop behind the (boxed) page
// content via its .main-content wrapper; keep it now that we opt out of it.
useHead({ bodyAttrs: { style: "background-color: #f5f5f5;" } });

const route = useRoute();
const siteName = computed(() => String(route.params.site));
const pageName = computed(() => String(route.params.page));

const { data: pbData } = await useAsyncData(`pb-${siteName.value}-${pageName.value}`, () =>
  $fetch<Record<string, any>>(`/sites/${siteName.value}/pages/${pageName.value}.json`).catch(
    () => null
  )
);

// 404 if this site has no such page
if (!pbData.value?.blocks?.length) {
  throw createError({ statusCode: 404, statusMessage: "Page not found" });
}

// The header navigation is shared across a site's pages: inject the canonical
// menu into any AppHeader block so every page shows the same menu, even if this
// page wasn't re-saved after the menu was last edited.
const { data: sharedMenu } = await useAsyncData(`pb-menu-${siteName.value}`, () =>
  $fetch<{ menus: any[] }>("/api/menu", { query: { site: siteName.value } }).catch(() => null)
);
if (Array.isArray(sharedMenu.value?.menus) && sharedMenu.value.menus.length) {
  for (const block of pbData.value.blocks) {
    if (block?.type === "AppHeader") {
      block.menus = sharedMenu.value.menus;
    }
  }
}
</script>

<template>
  <PageRenderer
    :blocks="pbData.blocks"
    :settings="pbData.settings"
    :layout="pbData.settings?.layout || 'default'"
    :with-layout="true"
    theme="default"
  />
</template>
