<template>
  <BannerComponent
    :normal-text="normalText"
    :show-img="showImage"
    :image="image"
    :bold="{ text: boldText, color: boldColor, fontSize: boldFontSize }"
    :normal="{ text: normalBodyText, color: normalColor, fontSize: normalFontSize }"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BannerComponent from '~/components/Banner.vue';

defineOptions({ label: "Banner", emoji: "🏷️" });

const props = defineProps<{
  normalText?: string;
  // The editor's select stores this as the string "true"/"false", so it must be
  // coerced — a bare `"false"` is truthy and would invert the toggle.
  showImg?: boolean | string;
  image?: string;
  boldText?: string;
  boldColor?: string;
  boldFontSize?: string;
  normalBodyText?: string;
  normalColor?: string;
  normalFontSize?: string;
}>();

const showImage = computed(() => props.showImg === true || props.showImg === 'true');
</script>
