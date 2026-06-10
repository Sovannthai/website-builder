<template>
  <section class="features-block">
    <h2 class="features-title">{{ title }}</h2>
    <div class="features-grid">
      <div class="feature-item" v-for="(item, i) in items" :key="i">
        <img v-if="item.image" :src="item.image" :alt="item.title" class="feature-image" />
        <div v-else class="feature-image-placeholder"></div>
        <h3>{{ item.title }}</h3>
        <p>{{ item.description }}</p>
      </div>
    </div>
    <div v-if="!items?.length" class="features-empty">
      Add feature items using the sidebar panel.
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  items: Array<{ image: string; title: string; description: string }>
}>()
</script>

<style scoped>
.features-block {
  padding: 4rem 2rem;
  text-align: center;
}
.features-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 2.5rem;
  color: #1a1a1a;
}
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}
.feature-item {
  padding: 1.5rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
}
.feature-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 1rem;
}
.feature-image-placeholder {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #e0e0e0;
  margin: 0 auto 1rem;
}
.feature-item h3 {
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #222;
}
.feature-item p {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.6;
}
.features-empty {
  color: #999;
  padding: 2rem;
  border: 2px dashed #ddd;
  border-radius: 8px;
}
</style>
