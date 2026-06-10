<template>
  <GalleryComponent :title="title" :images="imageUrls" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import GalleryComponent from "~/components/Gallery.vue";

defineOptions({ label: "Gallery", emoji: "🖼️" });

const props = defineProps<{
  title: string;
  image_items: Array<{ url: string }>;
}>();

const imageUrls = computed(() => props.image_items.map((item) => item.url));
</script>
