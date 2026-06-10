<template>
  <header class="nav-block">
    <div class="nav-inner">
      <a class="nav-logo">
        <img v-if="logo" :src="logo" alt="logo" class="nav-logo__img" />
        <span v-else class="nav-logo__text">Pixel Rise</span>
      </a>
      <nav class="nav-menu">
        <a
          v-for="item in menus"
          :key="item.path"
          class="nav-link"
        >
          <i v-if="item.icon" :class="item.icon"></i>
          {{ item.title }}
        </a>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  menus: Array<{ title: string; path: string; icon?: string }>;
  logo: string;
  fixLayout: boolean;
}>();
</script>

<style scoped>
.nav-block {
  background: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent);
  position: relative;
}
.nav-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 2rem;
}
.nav-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  text-decoration: none;
}
.nav-logo__img {
  height: 36px;
  width: auto;
}
.nav-logo__text {
  font-weight: 700;
  font-size: 1.1rem;
  color: #fff;
}
.nav-menu {
  display: flex;
  gap: 0.25rem;
}
.nav-link {
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.9rem;
  color: rgba(255,255,255,0.85);
  cursor: pointer;
  text-decoration: none;
  transition: background 0.15s;
}
.nav-link:hover {
  background: rgba(255,255,255,0.15);
  color: #fff;
}
</style>
