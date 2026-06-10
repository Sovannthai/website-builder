<template>
  <NavigationComponent :menus="menus" :logo="logo" :fix-layout="fixLayout" />
</template>

<script setup lang="ts">
import NavigationComponent from '~/components/Navigation.vue';

defineOptions({ label: "Navigation", emoji: "🧭" });

defineProps<{
  menus: Array<{ title: string; path: string; icon?: string }>;
  logo: string;
  fixLayout: boolean;
}>();
</script>
