<template>
  <CTAComponent
    :title="title"
    :description="description"
    :button="button"
  />
</template>

<script setup lang="ts">
import CTAComponent from '~/components/CTA.vue';

defineOptions({ label: "Call to Action", emoji: "🚀" });

defineProps<{
  title: string;
  description: string;
  button: { label: string; path: string };
}>();
</script>