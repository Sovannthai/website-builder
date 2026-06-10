<template>
  <section class="stats-block">
    <h2 class="stats-title">{{ title }}</h2>
    <div class="stats-grid">
      <div class="stats-card" v-for="(item, i) in items" :key="i">
        <div class="stats-icon">
          <span class="stats-icon__dot"></span>
        </div>
        <div class="stats-value">
          {{ item.value }}<span class="stats-suffix">{{ item.suffix }}</span>
        </div>
        <div class="stats-label">{{ item.label }}</div>
        <div v-if="item.description" class="stats-desc">{{ item.description }}</div>
      </div>
      <div v-if="!items?.length" class="stats-empty">Add stats using the sidebar panel.</div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  items: Array<{
    icon: string;
    value: string;
    suffix: string;
    label: string;
    description: string;
  }>;
}>();
</script>

<style scoped>
.stats-block {
  padding: 4rem 2rem;
  background: #A9CDEB;
  text-align: center;
}
.stats-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 2.5rem;
  color: #1a1a1a;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  max-width: 1000px;
  margin: 0 auto;
}
.stats-card {
  background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
  border-radius: 16px;
  padding: 2.5rem 1.5rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  position: relative;
  overflow: hidden;
  transition: transform 0.25s;
}
.stats-card:hover {
  transform: translateY(-6px);
}
.stats-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(54,130,194,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}
.stats-icon__dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #3682C2;
}
.stats-value {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #3682C2, #2c6ba0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}
.stats-suffix {
  font-size: 1.5rem;
  font-weight: 700;
}
.stats-label {
  margin-top: 0.4rem;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #5a6c7d;
}
.stats-desc {
  margin-top: 0.4rem;
  font-size: 0.8rem;
  color: #888;
}
.stats-empty {
  color: #aaa;
  font-size: 0.9rem;
  padding: 2rem;
  border: 2px dashed #cde;
  border-radius: 12px;
  grid-column: 1 / -1;
}
</style>
