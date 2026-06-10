<template>
  <TestimonialsComponent :title="title" :items="items" />
</template>

<script setup lang="ts">
import TestimonialsComponent from '~/components/Testimonials.vue';

defineOptions({ label: "Testimonials", emoji: "💬" });

defineProps<{
  title: string;
  items: Array<{
    name: string;
    role: string;
    avatar: string;
    message: string;
  }>;
}>();
</script>
