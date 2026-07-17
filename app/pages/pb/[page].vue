<script setup lang="ts">
import { PageRenderer } from "vue-wswg-editor";

const route = useRoute();
console.log("Route params:", route.params);
const pageName = computed(() => String(route.params.page));

const { data: pbData, error } = await useAsyncData(
  `pb-${pageName.value}`,
  () => $fetch<Record<string, any>>(`/pb-${pageName.value}-schema.json`).catch(() => null)
);

// 404 if no saved page data exists for this slug
if (!pbData.value?.blocks?.length) {
  throw createError({ statusCode: 404, statusMessage: "Page not found" });
}

// The header navigation is shared across all pages: inject the canonical menu
// into any AppHeader block so every published page shows the same menu, even if
// this page wasn't re-saved after the menu was last edited.
const { data: sharedMenu } = await useAsyncData("pb-menu", () =>
  $fetch<{ menus: any[] }>("/api/menu").catch(() => null)
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
  <!-- <component
    v-for="(block, index) in pbData.blocks"
    :is="resolveComponent(block.type)"
    v-bind="block.data"
  /> -->
</template>
