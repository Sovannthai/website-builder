<template>
  <section class="tm-block">
    <h2 class="tm-title">{{ title }}</h2>
    <div class="tm-grid">
      <div class="tm-card" v-for="(item, i) in items" :key="i">
        <div class="tm-author">
          <div class="tm-avatar">
            <img v-if="item.avatar" :src="`/img/${item.avatar}`" :alt="item.name" />
            <span v-else>{{ item.name?.charAt(0) }}</span>
          </div>
          <div>
            <div class="tm-name">{{ item.name }}</div>
            <div class="tm-role">{{ item.role }}</div>
          </div>
        </div>
        <hr class="tm-divider" />
        <p class="tm-message">&ldquo;{{ item.message }}&rdquo;</p>
      </div>
      <div v-if="!items?.length" class="tm-empty">Add testimonials using the sidebar panel.</div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  items: Array<{
    name: string;
    role: string;
    avatar: string;
    message: string;
  }>;
}>();
</script>

<style scoped>
.tm-block {
  padding: 4rem 2rem;
  max-width: 1100px;
  margin: 0 auto;
}
.tm-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 2rem;
}
.tm-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}
.tm-card {
  background: #fff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 3px 16px rgba(0,0,0,0.08);
}
.tm-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.tm-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #e5e7eb;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  color: #555;
  flex-shrink: 0;
}
.tm-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.tm-name {
  font-weight: 600;
  font-size: 0.95rem;
}
.tm-role {
  font-size: 0.8rem;
  color: #777;
}
.tm-divider {
  border: none;
  border-top: 1px solid #f0f0f0;
  margin: 1rem 0;
}
.tm-message {
  font-size: 0.9rem;
  color: #444;
  line-height: 1.65;
  font-style: italic;
}
.tm-empty {
  color: #aaa;
  font-size: 0.9rem;
  padding: 2rem;
  text-align: center;
  border: 2px dashed #e5e7eb;
  border-radius: 12px;
  grid-column: 1 / -1;
}
</style>
