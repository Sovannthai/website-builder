<template>
  <ContentComponent
    :title="title"
    :description="description"
    :image="image"
    :image_position="image_position"
  />
</template>

<script setup lang="ts">
import ContentComponent from '~/components/Content.vue';

defineOptions({ label: "Content", emoji: "📝" });

defineProps<{
  title: string;
  description: string;
  image: string;
  image_position: 'left' | 'right';
}>();
</script>