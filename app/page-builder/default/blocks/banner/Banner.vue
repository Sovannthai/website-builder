<template>
  <BannerComponent
    :normal-text="normalText"
    :show-img="showImg"
    :bold="{ text: boldText, color: boldColor, fontSize: boldFontSize }"
    :normal="{ text: normalBodyText, color: normalColor, fontSize: normalFontSize }"
  />
</template>

<script setup lang="ts">
import BannerComponent from '~/components/Banner.vue';

defineOptions({ label: "Banner", emoji: "🏷️" });

defineProps<{
  normalText: string;
  showImg: boolean;
  boldText: string;
  boldColor: string;
  boldFontSize: string;
  normalBodyText: string;
  normalColor: string;
  normalFontSize: string;
}>();
</script>
