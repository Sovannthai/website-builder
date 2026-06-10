<template>
  <BlogPreviewComponent :title="title" :posts="posts" />
</template>

<script setup lang="ts">
import BlogPreviewComponent from '~/components/BlogPreview.vue';

defineOptions({ label: "Blog Preview", emoji: "📰" });

defineProps<{
  title: string;
  posts: Array<{ title: string; summary: string; path: string }>;
}>();
</script>
