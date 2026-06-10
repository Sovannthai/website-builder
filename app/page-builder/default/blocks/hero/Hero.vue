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
  padding: 4rem 2rem;
  text-align: center;
}
.hero-block h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}
.hero-block p {
  font-size: 1.125rem;
  max-width: 640px;
  margin: 0 auto;
}
</style>
