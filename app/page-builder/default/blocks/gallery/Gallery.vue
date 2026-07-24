<template>
  <GalleryComponent :title="title" :images="imageUrls"
    :api-collection="apiCollection"
    :api-limit="apiLimit"
    :api-sort="apiSort"
    :api-fields="apiFields"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";
import GalleryComponent from "~/components/Gallery.vue";

defineOptions({ label: "Gallery", emoji: "🖼️" });

const props = defineProps<{
  apiCollection?: string;
  apiLimit?: string;
  apiSort?: string;
  apiFields?: Array<{ key?: string; value?: string }>;
  title: string;
  image_items?: Array<{ url: string }>;
}>();

const imageUrls = computed(() => (props.image_items ?? []).map((item) => item?.url).filter(Boolean));
</script>
