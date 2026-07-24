<template>
  <StatsComponent :title="title" :items="items"
    :api-collection="apiCollection"
    :api-limit="apiLimit"
    :api-sort="apiSort"
    :api-fields="apiFields"
  />
</template>

<script setup lang="ts">
import StatsComponent from '~/components/Stats.vue';

defineOptions({ label: "Stats", emoji: "📊" });

defineProps<{
  apiCollection?: string;
  apiLimit?: string;
  apiSort?: string;
  apiFields?: Array<{ key?: string; value?: string }>;
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
