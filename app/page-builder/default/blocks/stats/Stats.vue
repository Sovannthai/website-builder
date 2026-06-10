<template>
  <StatsComponent :title="title" :items="items" />
</template>

<script setup lang="ts">
import StatsComponent from '~/components/Stats.vue';

defineOptions({ label: "Stats", emoji: "📊" });

defineProps<{
  title: string;
  items: Array<{
    icon: string;
    value: string;
    suffix: string;
    label: string;
    description: string;
  }>;
}>();
</script>
