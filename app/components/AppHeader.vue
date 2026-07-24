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
        <template v-for="menu in menuItems" :key="menu.path">
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

  <!-- Mobile menu: full-screen overlay with a blurred backdrop.
       Teleported to <body> so `position: fixed` is measured against the
       viewport — inside the app bar, its transforms would become the
       containing block and the overlay would be mispositioned. -->
  <Teleport to="body">
    <Transition name="mobile-menu">
      <div
        v-if="drawer"
        class="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Main menu"
        @click.self="drawer = false"
      >
        <button class="mobile-menu__close" aria-label="Close menu" @click="drawer = false">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <nav class="mobile-menu__nav">
          <div
            v-for="(menu, i) in menuItems"
            :key="menu.path"
            class="mobile-menu__item"
            :style="{ '--i': i }"
          >
            <!-- Item with children: tap to expand -->
            <template v-if="menu.children?.length">
              <button
                class="mobile-menu__link mobile-menu__link--parent"
                :class="{ 'is-active': isActive(menu.path) || isChildActive(menu.children) }"
                :aria-expanded="expanded === menu.path"
                @click="toggleGroup(menu.path)"
              >
                {{ menu.title }}
                <svg
                  class="mobile-menu__chevron"
                  :class="{ 'is-open': expanded === menu.path }"
                  viewBox="0 0 24 24" width="18" height="18"
                  fill="none" stroke="currentColor" stroke-width="2"
                >
                  <path stroke-linecap="round" d="M6 9l6 6 6-6" />
                </svg>
              </button>

              <div v-show="expanded === menu.path" class="mobile-menu__children">
                <RouterLink
                  v-for="child in menu.children"
                  :key="child.path"
                  :to="child.path"
                  class="mobile-menu__child"
                  :class="{ 'is-active': isActive(child.path) }"
                  @click="closeMenu"
                >
                  {{ child.title }}
                </RouterLink>
              </div>
            </template>

            <!-- Regular item -->
            <RouterLink
              v-else
              :to="menu.path"
              class="mobile-menu__link"
              :class="{ 'is-active': isActive(menu.path) }"
              @click="closeMenu"
            >
              {{ menu.title }}
            </RouterLink>
          </div>
        </nav>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useCollection, pickWith, toFieldMap, FIELD_ALIASES } from '~/composables/useCollection'

const props = defineProps({
  /** Menu saved in the page / injected from the site's shared menu. */
  menus: {
    type: Array,
    default: () => [
      { title: 'Home', path: '/' },
      { title: 'News', path: '/news', children: [
        { title: 'News Style 1', path: '/news' },
        { title: 'News Style 2', path: '/news2' },
        { title: 'News Style 3', path: '/news3' }
      ]  },
      { title: 'About Us', path: '/about_us' }
    ]
  },
  /** Collection key to build the nav from instead, e.g. "navigation". */
  apiCollection: { type: String, default: '' },
  apiLimit: { type: [String, Number], default: 20 },
  apiSort: { type: String, default: '' },
  /** Which API field fills each part: [{ key: 'title', value: 'label' }] */
  apiFields: { type: Array, default: () => [] },
})

const fieldMap = computed(() => toFieldMap(props.apiFields))

// Build one nav entry, recursing into sub-items when the backend nests them.
const toMenuItem = (row) => {
  const childrenKey = fieldMap.value.children
  const childrenRaw =
    (childrenKey && row?.[childrenKey]) ??
    row?.children ?? row?.items ?? row?.submenu
  const children = Array.isArray(childrenRaw) ? childrenRaw.map(toMenuItem) : undefined
  return {
    title: pickWith(row, fieldMap.value.title, FIELD_ALIASES.title, 'Untitled'),
    path: pickWith(row, fieldMap.value.path, FIELD_ALIASES.path, '/'),
    ...(children?.length ? { children } : {}),
  }
}

const { items: menuItems } = useCollection(
  () => props.apiCollection,
  {
    fallback: () => props.menus,
    limit: () => props.apiLimit,
    sort: () => props.apiSort,
    map: toMenuItem,
  }
)

const drawer = ref(false)
const route = useRoute()
const isScrolled = ref(false)

const isActive = (path) => route.path === path

const isChildActive = (children) => {
  if (!children) return false
  return children.some(child => route.path === child.path)
}

const expanded = ref(null)

const toggleGroup = (path) => {
  expanded.value = expanded.value === path ? null : path
}

const closeMenu = () => {
  drawer.value = false
}

const handleKeydown = (e) => {
  if (e.key === 'Escape' && drawer.value) closeMenu()
}

// Stop the page behind the overlay from scrolling while it's open.
watch(drawer, (open) => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = open ? 'hidden' : ''
  if (!open) expanded.value = null
})

// Close if navigation happens some other way (back button, in-page link).
watch(() => route.path, closeMenu)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('keydown', handleKeydown)
  handleScroll() // Check initial state
})

onBeforeUnmount(() => {
  // Never leave the page unscrollable if we unmount while open.
  if (typeof document !== 'undefined') document.body.style.overflow = ''
  window.removeEventListener('keydown', handleKeydown)
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

<!-- Unscoped: the mobile menu is teleported to <body>, so it sits outside this
     component's DOM subtree and scoped attributes would never match it. -->
<style>
.mobile-menu {
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.75rem;
  overflow-y: auto;
  /* See-through: the page stays visible behind, with only a light blur.
     The tint is dark rather than light because the menu can open over
     anything — a light tint left dark text unreadable on top of imagery.
     A dark scrim + white text stays legible whatever is behind. */
  background: rgba(15, 18, 20, 0.42);
  backdrop-filter: blur(6px) saturate(115%);
  -webkit-backdrop-filter: blur(6px) saturate(115%);
}

/* Fallback for browsers without backdrop-filter: use an opaque background so
   the menu text never sits unreadable on top of the page content. */
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .mobile-menu {
    background: rgba(15, 18, 20, 0.82);
  }
}

.mobile-menu__close {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  color: #fff;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.16);
  border: none;
  border-radius: 50%;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  transition: background 0.2s ease, transform 0.2s ease;
}
.mobile-menu__close:hover {
  background: rgba(255, 255, 255, 0.28);
  transform: rotate(90deg);
}

.mobile-menu__nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  width: 100%;
  max-width: 22rem;
  text-align: center;
}

/* Stagger each entry in as the overlay opens */
.mobile-menu__item {
  opacity: 0;
  transform: translateY(14px);
  animation: mobile-menu-in 0.42s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: calc(0.06s * var(--i, 0) + 0.08s);
}

@keyframes mobile-menu-in {
  to {
    opacity: 1;
    transform: none;
  }
}

.mobile-menu__link {
  display: flex;
  align-items: center;
  /* Centred, with the chevron sitting beside the label rather than pushed to
     the far edge (which would look off-centre). */
  justify-content: center;
  gap: 0.4rem;
  width: 100%;
  padding: 0.55rem 0;
  font-size: clamp(1.15rem, 5vw, 1.45rem);
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: 0.01em;
  color: #fff;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  background: none;
  border: none;
  /* Keeps the label readable even where the page behind is bright */
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.55);
  transition: color 0.2s ease, opacity 0.2s ease;
}
.mobile-menu__link:hover {
  opacity: 0.7;
}
.mobile-menu__link.is-active {
  color: #b9d24e;
}

.mobile-menu__chevron {
  flex-shrink: 0;
  transition: transform 0.25s ease;
}
.mobile-menu__chevron.is-open {
  transform: rotate(180deg);
}

/* Centred, so a left-hand indent rail would read as lopsided — a hairline
   above the group conveys the nesting instead. */
.mobile-menu__children {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
  margin: 0.1rem auto 0.5rem;
  padding: 0.45rem 0 0.2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.25);
  width: 60%;
}

.mobile-menu__child {
  padding: 0.3rem 0;
  font-size: 0.95rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.82);
  text-align: center;
  text-decoration: none;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);
  transition: color 0.2s ease;
}
.mobile-menu__child:hover {
  color: #fff;
}
.mobile-menu__child.is-active {
  color: #b9d24e;
  font-weight: 600;
}

/* Open / close transition for the overlay itself */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.28s ease;
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .mobile-menu__item {
    animation: none;
    opacity: 1;
    transform: none;
  }
  .mobile-menu__close:hover {
    transform: none;
  }
}
</style>
