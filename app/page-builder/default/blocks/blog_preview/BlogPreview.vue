<template>
  <BlogPreviewComponent :title="title" :posts="posts"
    :api-collection="apiCollection"
    :api-limit="apiLimit"
    :api-sort="apiSort"
    :api-fields="apiFields"
  />
</template>

<script setup lang="ts">
import BlogPreviewComponent from '~/components/BlogPreview.vue';

defineOptions({ label: "Blog Preview", emoji: "📰" });

defineProps<{
  apiCollection?: string;
  apiLimit?: string;
  apiSort?: string;
  apiFields?: Array<{ key?: string; value?: string }>;
  title: string;
  posts: Array<{ title: string; summary: string; path: string }>;
}>();
</script>
