<template>
  <v-app>
    <AppHeader v-if="!isPbRoute" :menus="menus" />
    <div :style="mainContentStyle" class="main-content">
      <slot />
    </div>
    <Footer v-if="!isPbRoute" />
  </v-app>
</template>
<script setup>
import { useRoute } from 'vue-router';
import { computed, ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
const props = defineProps({
  navigationProps: {
    type: Object,
    default: () => ({})
  },
  menuProps: {
    type: Object,
    default: () => ({})
  }
})

const { data: siteSchema } = await useAsyncData('site-schema', () => $fetch('/schema.json'))
const menus = useState('main-menu', () => siteSchema.value?.layouts?.find(l => l.type === 'header')?.data?.menus || [])
onMounted(() => {
  console.log('layout mounted with props:', props.menuProps);
})
const route = useRoute();
const isPbRoute = computed(() => route.path.startsWith('/pb/') || route.path === '/pb');
const navBarHeight = ref(101);
const navBarRef = ref();
const navigationProps = computed(() => route.meta?.navigationProps || {});
const menuProps = computed(() => route.meta?.menuProps || {});
const mainContentStyle = computed(() => (!isPbRoute.value && navigationProps.value.fixLayout) ? { marginTop: navBarHeight.value + 'px' } : {});

function updateNavBarHeight() {
  nextTick(() => {
    const navBarEl = navBarRef.value?.$el || navBarRef.value;
    if (navBarEl) {
      navBarHeight.value = navBarEl.offsetHeight || 101;
    }
  });
}

onMounted(() => {
  // updateNavBarHeight();
  // Call again after a short delay to ensure correct height after render
  setTimeout(updateNavBarHeight, 150);
  window.addEventListener('resize', updateNavBarHeight);
  window.addEventListener('scroll', updateNavBarHeight);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateNavBarHeight);
  window.removeEventListener('scroll', updateNavBarHeight);
});
</script>
<style scoped>
  .main-content {
    background: #f5f5f5 !important;
  }
</style>
