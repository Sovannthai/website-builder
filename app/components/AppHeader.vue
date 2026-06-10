<template>
  <v-app-bar height="120" flat class="header-bar" :class="{ 'scrolled': isScrolled }">
    <ContainerWrapper class="mt-4">
      <v-container class="d-flex align-center px-0 justify-space-between">
      <!-- Left: Mobile menu icon -->
      <v-btn
        icon
        class="d-md-none"
        @click="drawer = true"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      <!-- Logo -->
      <div class="d-flex align-center">
        <v-img src="@/assets/images/logo.png" width="28" height="28" class="mr-2" />
        <span class="logo-text">Pixel Rise</span>
      </div>
      <!-- Desktop Navigation -->
      <div class="nav-wrapper d-none d-md-flex">
        <template v-for="menu in menus" :key="menu.path">
          <!-- Menu with children (dropdown) -->
          <v-menu v-if="menu.children" offset-y transition="slide-y-transition">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                class="nav-item"
                :class="{ active: isActive(menu.path) || isChildActive(menu.children) }"
              >
                {{ menu.title }}
                <v-icon size="14" class="ml-1">mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list class="dropdown-menu">
              <v-list-item
                v-for="child in menu.children"
                :key="child.path"
                :to="child.path"
                class="dropdown-item"
                :active="isActive(child.path)"
              >
                <v-list-item-title>{{ child.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <!-- Regular menu item -->
          <v-btn
            v-else
            :to="menu.path"
            class="nav-item"
            :class="{ active: isActive(menu.path) }"
          >
            {{ menu.title }}
          </v-btn>
        </template>
      </div>

      <!-- Actions -->
      <div class="d-flex align-center">
        <v-btn variant="text" class="lang-btn d-none d-md-flex">
          English
          <v-icon size="14" class="ml-1">mdi-chevron-down</v-icon>
        </v-btn>

        <v-btn class="login-btn ml-2">
          Login
        </v-btn>
      </div>

      </v-container>
    </ContainerWrapper>

  </v-app-bar>

  <!-- Mobile Drawer -->
  <v-navigation-drawer
    v-model="drawer"
    temporary
    location="left"
    width="280"
  >
    <v-list>
      <template v-for="menu in menus" :key="menu.path">
        <!-- Menu with children -->
        <v-list-group v-if="menu.children" :value="menu.path">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" :active="isActive(menu.path) || isChildActive(menu.children)">
              <v-list-item-title>{{ menu.title }}</v-list-item-title>
            </v-list-item>
          </template>
          
          <v-list-item
            v-for="child in menu.children"
            :key="child.path"
            :to="child.path"
            @click="drawer = false"
            :active="isActive(child.path)"
            class="pl-8"
          >
            <v-list-item-title>{{ child.title }}</v-list-item-title>
          </v-list-item>
        </v-list-group>

        <!-- Regular menu item -->
        <v-list-item
          v-else
          :to="menu.path"
          @click="drawer = false"
          :active="isActive(menu.path)"
        >
          <v-list-item-title>{{ menu.title }}</v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'

defineProps({
  menus: {
    type: Array,
    required: true,
    default: () => [
      { title: 'Home', path: '/' },
      { title: 'News', path: '/news', children: [
        { title: 'News Style 1', path: '/news' },
        { title: 'News Style 2', path: '/news2' },
        { title: 'News Style 3', path: '/news3' }
      ]  },
      { title: 'About Us', path: '/about_us' }
    ]
  }
})

const drawer = ref(false)
const route = useRoute()
const isScrolled = ref(false)

const isActive = (path) => route.path === path

const isChildActive = (children) => {
  if (!children) return false
  return children.some(child => route.path === child.path)
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll() // Check initial state
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.header-bar {
  background: transparent !important;
  transition: all 0.3s ease;
  position: fixed;
}

.header-bar.scrolled {
  background: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
}

/* Logo */
.logo-text {
  font-weight: 700;
  font-size: 18px;
}

/* Desktop menu background */
.nav-wrapper {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background: #ededed;
  padding: 6px;
  border-radius: 14px;
  gap: 4px;
}

/* Menu item */
.nav-item {
  text-transform: none;
  font-weight: 500;
  border-radius: 10px;
  padding: 6px 14px;
  color: #555;
}

/* Active menu */
.nav-item.active {
  background: #fff;
  color: #000;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12);
}

/* Dropdown menu */
.dropdown-menu {
  background: #fff;
  border-radius: 12px;
  padding: 8px;
  margin-top: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  min-width: 200px;
}

.dropdown-item {
  border-radius: 8px;
  margin-bottom: 4px;
  transition: all 0.2s ease;
}

.dropdown-item:last-child {
  margin-bottom: 0;
}

.dropdown-item:hover {
  background: #f5f5f5;
}

.dropdown-item.v-list-item--active {
  background: #e8f4fd;
  color: #1976d2;
}

/* Buttons */
.lang-btn {
  text-transform: none;
  font-weight: 500;
}

.login-btn {
  background: #111;
  color: #fff;
  font-weight: 600;
  text-transform: none;
  padding: 8px 16px;
}
:deep(.v-toolbar__content) {
  display: block !important;
}
</style>
