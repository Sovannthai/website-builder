<template>
  <section
    class="content-block"
    :class="{ 'content-block--reversed': image_position === 'left' }"
  >
    <div class="content-text">
      <h2>{{ title }}</h2>
      <p>{{ description }}</p>
    </div>
    <div class="content-image">
      <img v-if="image" :src="image" :alt="title" />
      <div v-else class="content-image-placeholder">No image selected</div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description: string
  image: string
  image_position: 'left' | 'right'
}>()
</script>

<style scoped>
.content-block {
  display: flex;
  align-items: center;
  gap: 3rem;
  padding: 4rem 2rem;
  max-width: 1100px;
  margin: 0 auto;
}
.content-block--reversed {
  flex-direction: row-reverse;
}
.content-text {
  flex: 1;
}
.content-text h2 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1a1a1a;
}
.content-text p {
  font-size: 1rem;
  color: #555;
  line-height: 1.75;
  white-space: pre-line;
}
.content-image {
  flex: 1;
}
.content-image img {
  width: 100%;
  border-radius: 10px;
  object-fit: cover;
  max-height: 380px;
}
.content-image-placeholder {
  width: 100%;
  height: 260px;
  background: #efefef;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  border: 2px dashed #ddd;
}
@media (max-width: 768px) {
  .content-block,
  .content-block--reversed {
    flex-direction: column;
  }
}
</style>
