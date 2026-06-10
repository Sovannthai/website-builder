<template>
  <div class="banner-block">
    <div class="banner-gradient"></div>
    <div class="banner-content">
      <p class="banner-sub">{{ normalText }}</p>
      <div class="banner-heading">
        <span :style="{ color: normalColor, fontSize: normalFontSize }">{{ normalBodyText }}</span>
        <strong :style="{ color: boldColor, fontSize: boldFontSize }">{{ boldText }}</strong>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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

<style scoped>
.banner-block {
  position: relative;
  min-height: 200px;
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-bottom: 1px solid #ebebeb;
  padding: 2rem;
  overflow: hidden;
}
.banner-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(138,167,59,0.25), rgba(54,65,23,0.25) 85%);
  pointer-events: none;
}
.banner-content {
  position: relative;
  z-index: 1;
}
.banner-sub {
  text-transform: uppercase;
  font-size: 0.85rem;
  color: #777;
  margin-bottom: 0.5rem;
}
.banner-heading {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25em;
  align-items: baseline;
}
</style>
