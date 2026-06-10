<template>
  <section class="bp-block">
    <div class="bp-header">
      <h2 class="bp-title">{{ title }}</h2>
    </div>
    <div class="bp-grid">
      <div class="bp-card" v-for="(post, i) in posts" :key="i">
        <div class="bp-card__title">{{ post.title }}</div>
        <div class="bp-card__summary">{{ post.summary }}</div>
        <span class="bp-card__link">Read more &rarr;</span>
      </div>
      <div v-if="!posts?.length" class="bp-empty">Add blog posts using the sidebar panel.</div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  posts: Array<{ title: string; summary: string; path: string }>;
}>();
</script>

<style scoped>
.bp-block {
  padding: 4rem 2rem;
  max-width: 1100px;
  margin: 0 auto;
}
.bp-header {
  margin-bottom: 2rem;
}
.bp-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
}
.bp-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
}
.bp-card {
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 1.25rem 1.5rem;
  background: #fff;
}
.bp-card__title {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: #111;
}
.bp-card__summary {
  font-size: 0.875rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 0.75rem;
}
.bp-card__link {
  font-size: 0.85rem;
  color: #2563eb;
  cursor: pointer;
}
.bp-empty {
  color: #aaa;
  font-size: 0.9rem;
  padding: 2rem;
  text-align: center;
  border: 2px dashed #e5e7eb;
  border-radius: 12px;
  grid-column: 1 / -1;
}
</style>
