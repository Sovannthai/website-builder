<template>
  <section class="hero-block" :style="{ backgroundColor: bgColor }">
    <h1>{{ heading }}</h1>
    <p>{{ description }}</p>
  </section>
</template>

<script setup lang="ts">
defineOptions({ label: "Hero", emoji: "🦸" });
defineProps<{
  heading: string;
  description: string;
  bgColor: string;
}>();
</script>

<style scoped>
.hero-block {
  padding: clamp(2rem, 6vw, 4rem) clamp(1rem, 4vw, 2rem);
  text-align: center;
}
.hero-block h1 {
  font-size: clamp(1.75rem, 5vw, 2.5rem);
  line-height: 1.2;
  margin-bottom: 1rem;
  overflow-wrap: anywhere;
}
.hero-block p {
  font-size: clamp(1rem, 2vw, 1.125rem);
  line-height: 1.6;
  max-width: 640px;
  margin: 0 auto;
  overflow-wrap: anywhere;
}
</style>
