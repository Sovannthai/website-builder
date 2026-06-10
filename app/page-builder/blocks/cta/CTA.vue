<template>
  <section class="cta-block">
    <div class="cta-content">
      <h2>{{ title }}</h2>
      <p>{{ description }}</p>
      <a :href="button?.path" class="cta-btn">{{ button?.label }}</a>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description: string
  button: { label: string; path: string }
}>()
</script>

<style scoped>
.cta-block {
  background: linear-gradient(135deg, #1565c0, #0d47a1);
  padding: 5rem 2rem;
  text-align: center;
  color: white;
}
.cta-content {
  max-width: 620px;
  margin: 0 auto;
}
.cta-content h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 1px 4px rgba(0,0,0,0.3);
}
.cta-content p {
  font-size: 1.1rem;
  opacity: 0.92;
  margin-bottom: 2rem;
  line-height: 1.7;
}
.cta-btn {
  display: inline-block;
  padding: 0.85rem 2.5rem;
  background: white;
  color: #1565c0;
  border-radius: 25px;
  font-weight: 600;
  text-decoration: none;
  font-size: 1rem;
  transition: opacity 0.2s, transform 0.15s;
}
.cta-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}
</style>
