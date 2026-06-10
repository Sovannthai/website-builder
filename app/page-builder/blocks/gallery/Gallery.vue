<template>
  <section class="gallery-block">
    <h2 class="gallery-title">{{ title }}</h2>
    <div class="gallery-grid">
      <div
        v-for="(item, i) in image_items"
        :key="i"
        class="gallery-item"
      >
        <img v-if="item.url" :src="item.url" :alt="title" />
        <div v-else class="gallery-placeholder">No image</div>
      </div>
      <div v-if="!image_items?.length" class="gallery-empty">Add images using the sidebar panel.</div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  image_items: Array<{ url: string }>;
}>();
</script>

<style scoped>
.gallery-block {
  padding: 4rem 2rem;
  max-width: 1100px;
  margin: 0 auto;
}
.gallery-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 2rem;
}
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.25rem;
}
.gallery-item {
  border-radius: 14px;
  overflow: hidden;
  background: #e5e7eb;
  aspect-ratio: 4/3;
}
.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}
.gallery-item:hover img {
  transform: scale(1.05);
}
.gallery-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 0.85rem;
}
.gallery-empty {
  color: #aaa;
  font-size: 0.9rem;
  padding: 2rem;
  text-align: center;
  border: 2px dashed #e5e7eb;
  border-radius: 12px;
  grid-column: 1 / -1;
}
</style>
