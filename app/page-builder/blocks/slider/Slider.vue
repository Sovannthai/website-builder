<template>
  <div class="slider-block">
    <div
      v-for="(slide, i) in slides"
      :key="i"
      class="slide"
      :style="{ backgroundImage: `url(${slide.image})` }"
    >
      <div class="slide-overlay">
        <div class="slide-content">
          <h1>{{ slide.title }}</h1>
          <p>{{ slide.description }}</p>
          <button class="slide-btn">Learn More</button>
        </div>
      </div>
    </div>
    <div v-if="!slides?.length" class="slider-placeholder">
      <p>Add slides using the sidebar panel.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  slides: Array<{ image: string; title: string; description: string }>
}>()
</script>

<style scoped>
.slider-block {
  position: relative;
  width: 100%;
}
.slide {
  height: 420px;
  background-size: cover;
  background-position: center;
}
.slide-overlay {
  height: 100%;
  background: linear-gradient(to right, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0) 100%);
  display: flex;
  align-items: center;
  color: white;
  padding: 2rem 4rem;
}
.slide-content h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 2px 8px rgba(0,0,0,0.8), 0 1px 3px rgba(0,0,0,0.9);
  -webkit-font-smoothing: antialiased;
}
.slide-content p {
  font-size: 1rem;
  margin-bottom: 1.5rem;
  color: rgba(255,255,255,0.95);
  text-shadow: 0 1px 6px rgba(0,0,0,0.8);
  max-width: 480px;
}
.slide-btn {
  padding: 0.6rem 1.6rem;
  border: 1px solid rgba(255,255,255,0.8);
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(2px);
  color: white;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.95rem;
}
.slider-placeholder {
  height: 200px;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 1rem;
  border: 2px dashed #ddd;
  border-radius: 8px;
}
</style>
