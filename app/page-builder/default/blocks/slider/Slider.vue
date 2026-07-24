<template>
  <SliderComponent :slides="slides"
    :api-collection="apiCollection"
    :api-limit="apiLimit"
    :api-sort="apiSort"
    :api-fields="apiFields"
  />
</template>

<script setup lang="ts">
import SliderComponent from '~/components/Slider.vue';

defineOptions({ label: "Slider", emoji: "🖼️" });

defineProps<{
  apiCollection?: string;
  apiLimit?: string;
  apiSort?: string;
  apiFields?: Array<{ key?: string; value?: string }>;
  slides: Array<{ image: string; title: string; description: string }>;
}>();
</script>