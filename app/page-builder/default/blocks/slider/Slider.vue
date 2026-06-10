<template>
  <SliderComponent :slides="slides" />
</template>

<script setup lang="ts">
import SliderComponent from '~/components/Slider.vue';

defineOptions({ label: "Slider", emoji: "🖼️" });

defineProps<{
  slides: Array<{ image: string; title: string; description: string }>;
}>();
</script>