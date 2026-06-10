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
</script>

<template>
  <PageRenderer
    :blocks="pbData.blocks"
    :settings="pbData.settings"
    :layout="pbData.settings?.layout || 'default'"
    theme="default"
  />
  <!-- <component
    v-for="(block, index) in pbData.blocks"
    :is="resolveComponent(block.type)"
    v-bind="block.data"
  /> -->
</template>
