<template>
  <FeaturesComponent :title="title" :items="items" />
</template>

<script setup lang="ts">
import FeaturesComponent from '~/components/Features.vue';

defineOptions({ label: "Features", emoji: "⭐" });

defineProps<{
  title: string;
  items: Array<{ image: string; title: string; description: string }>;
}>();
</script>