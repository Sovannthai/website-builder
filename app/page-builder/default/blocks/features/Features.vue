<template>
  <FeaturesComponent :title="title" :items="items"
    :api-collection="apiCollection"
    :api-limit="apiLimit"
    :api-sort="apiSort"
    :api-fields="apiFields"
  />
</template>

<script setup lang="ts">
import FeaturesComponent from '~/components/Features.vue';

defineOptions({ label: "Features", emoji: "⭐" });

defineProps<{
  apiCollection?: string;
  apiLimit?: string;
  apiSort?: string;
  apiFields?: Array<{ key?: string; value?: string }>;
  title: string;
  items: Array<{ image: string; title: string; description: string }>;
}>();
</script>