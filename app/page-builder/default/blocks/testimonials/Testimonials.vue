<template>
  <TestimonialsComponent :title="title" :items="items"
    :api-collection="apiCollection"
    :api-limit="apiLimit"
    :api-sort="apiSort"
    :api-fields="apiFields"
  />
</template>

<script setup lang="ts">
import TestimonialsComponent from '~/components/Testimonials.vue';

defineOptions({ label: "Testimonials", emoji: "💬" });

defineProps<{
  apiCollection?: string;
  apiLimit?: string;
  apiSort?: string;
  apiFields?: Array<{ key?: string; value?: string }>;
  title: string;
  items: Array<{
    name: string;
    role: string;
    avatar: string;
    message: string;
  }>;
}>();
</script>
