<template>
  <div class="afc-block">
    <div class="afc-tabs">
      <button class="afc-tab afc-tab--active">All</button>
      <button class="afc-tab">Category 11</button>
      <button class="afc-tab">Category 2</button>
      <button class="afc-tab">Category 3</button>
    </div>
    <div class="afc-grid">
      <div class="afc-card" v-for="n in 3" :key="n">
        <div class="afc-card__img"></div>
        <div class="afc-card__title">Item {{ n }}</div>
        <div class="afc-card__sub">Short description here</div>
      </div>
    </div>
    <p class="afc-note">Data loaded from: <code>{{ categoriesEndpoint }}</code></p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  categoriesEndpoint: string;
  featureEndpoint: string;
}>();
</script>

<style scoped>
.afc-block {
  padding: 2rem;
  background: #f5f5f5;
  border-radius: 12px;
}
.afc-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}
.afc-tab {
  padding: 6px 16px;
  border-radius: 20px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
  font-size: 0.875rem;
}
.afc-tab--active {
  background: #111;
  color: #fff;
  border-color: #111;
}
.afc-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}
.afc-card {
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
}
.afc-card__img {
  height: 140px;
  background: #e5e7eb;
}
.afc-card__title {
  padding: 0.75rem 0.75rem 0.25rem;
  font-weight: 600;
  font-size: 0.9rem;
}
.afc-card__sub {
  padding: 0 0.75rem 0.75rem;
  font-size: 0.8rem;
  color: #777;
}
.afc-note {
  margin-top: 1rem;
  font-size: 0.75rem;
  color: #999;
}
.afc-note code {
  background: #e5e7eb;
  padding: 1px 5px;
  border-radius: 4px;
}
</style>
