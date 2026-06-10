<template>
  <AppHeaderComponent :menus="menus" />
</template>

<script setup lang="ts">
  import AppHeaderComponent from '@/components/AppHeader.vue';

  defineOptions({ label: "App Header", emoji: "🔝" });

  defineProps<{
  menus: Array<{
    title: string;
    path: string;
    children?: Array<{ title: string; path: string }>;
  }>;
  }>();
</script>

<style scoped>
.app-header {
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
}
.app-header__inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 64px;
  display: flex;
  align-items: center;
  gap: 2rem;
}
.app-header__logo {
  font-weight: 700;
  font-size: 1.1rem;
  flex-shrink: 0;
}
.app-header__nav {
  display: flex;
  gap: 0.5rem;
  background: #f0f0f0;
  padding: 5px;
  border-radius: 12px;
  flex: 1;
}
.app-header__link {
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #555;
  cursor: pointer;
  text-decoration: none;
}
.app-header__link:hover {
  background: #fff;
  color: #000;
}
.app-header__cta {
  margin-left: auto;
  background: #111;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 7px 16px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
}
</style>
