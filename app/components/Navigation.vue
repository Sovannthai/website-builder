<template>
  <header id="nav_header" :class="{ 'header__section': true, 'fixed-menu': isFixedMenu }">
    <ContainerWrapper style="overflow: visible;">
      <nav class="nav container">
        <div class="nav__data">
          <a @click="routeToHome()" class="nav__logo">
            <image-company-name :key="String(isFixedMenu)"
              :color="isFixedMenu ? 'color-black' : 'color-white'" :logo="logo" />
          </a>
          <div class="nav__toggle" id="nav-toggle">
            <i class="ri-menu-line nav__burger"></i>
            <i class="ri-close-line nav__close"></i>
          </div>
        </div>
        <!-- start: Navigation Menu -->
        <div class="nav__menu" id="nav-menu" ref="navMenu">
          <ul class="nav__list">
            <li v-for="link in menus" :key="link.path" class="nav__item"
              :class="{ 'dropdown__item has-dropdown': link.children }">
              <a v-if="!link.children" @click="navigateTo(link.path)" class="nav__link"
                :class="{ 'is-active': isActive(link.path) }">
                {{ link.title }}
              </a>

              <div v-else class="nav__link">
                {{ link.title }} <i class="ri-arrow-down-s-line dropdown__arrow"></i>
              </div>

              <ul v-if="link.children" class="dropdown__menu">
                <li v-for="child in link.children" :key="child.path">
                  <a @click="navigateTo(child.path)" class="dropdown__link"
                    :class="{ 'is-active': isActive(child.path) }">
                    <i :class="child.icon"></i> {{ child.title }}
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <!-- end: Navigation Menu -->
      </nav>
    </ContainerWrapper>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "NavigationBar",
  props: {
    fixLayout: {
      type: Boolean,
      default: true,
    },
    menus: {
      type: Array as () => { title: string; path: string }[] as any,
      default: () => [],
    },
    logo: {
      type: String,
      default: '/logo.png'
    }
  },
  data() {
    return {
      isFixedMenu: true,
    }
  },
  mounted() {
    // Set initial fixed state on mount
    setTimeout(() => this.handleScroll(), 150);
    window.addEventListener("scroll", this.handleScroll);
    this.showMenu("nav-toggle", "nav-menu");
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  watch: {
    fixLayout(newVal) {
      if (newVal) {
        this.isFixedMenu = true;
      } else {
        this.isFixedMenu = window.scrollY > 100;
      }
    },
  },
  methods: {
    routeToHome() {
      this.$router.push({ path: '/' });
    },
    showMenu(toggleId: string, navId: string) {
      const toggle = document.getElementById(toggleId) as HTMLElement,
        nav = document.getElementById(navId) as HTMLElement;
      toggle.addEventListener("click", () => {
        // Add show-menu class to nav menu
        nav.classList.toggle("show-menu");
        // Add show-icon to show and hide the menu icon
        toggle.classList.toggle("show-icon");
      });
    },
    handleScroll() {
      if (this.fixLayout) {
        this.isFixedMenu = true;
      } else {
        this.isFixedMenu = window.scrollY > 100;
      }
    },
    isActive(path: any) {
      // Check for a direct match
      if (this.$route.path === path) {
        return true;
      }

      // Check for a partial match for parent links
      if (path.includes('/')) {
        const pathSegments = path.split('/').filter(Boolean);
        if (pathSegments.length > 0 && this.$route.path.startsWith('/' + pathSegments[0])) {
          return true;
        }
      }
      return false;
    },
    navigateTo(path: any) {
      const menuElement = document.querySelector('.show-menu');
      if (menuElement) {
        const toggle = document.getElementById('nav-toggle') as HTMLElement
        toggle.click()
      }
      this.$router.push(path);
    }

  },
})
</script>
<style scoped lang="scss">
ul {
  list-style: none;
}

a {
  text-decoration: none;
  position: relative;
}

.header__section {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: var(--z-fixed);
  padding: 20px;
  padding-left: 0;
  padding-right: 0;
}

.fixed-menu {
  position: fixed;
  background-color: rgba(245, 245, 245, 1);
  box-shadow: 0 2px 16px hsla(220, 32%, 8%, 0.3);
}

.fixed-menu .nav__link,
.fixed-menu .nav__burger,
.fixed-menu .nav__close {
  color: $color-black;
}

.fixed-menu .show-menu .nav__link {
  color: $color-white !important;
}

.container {
  margin-inline: 1.5rem;
}

.nav {
  height: 100%;
}

.nav__list {
  z-index: var(--z-fixed);
}

.nav__burger,
.nav__close {
  color: $color-white;
}

.nav__data {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav__logo {
  display: inline-flex;
  align-items: center;
  column-gap: 0.25rem;
  cursor: pointer;
}

.nav__logo i {
  font-weight: initial;
  font-size: 1.25rem;
}

.nav__toggle {
  position: relative;
  width: 32px;
  height: 32px;
}

.nav__burger,
.nav__close {
  position: absolute;
  width: max-content;
  height: max-content;
  inset: 0;
  margin: auto;
  font-size: 1.25rem;
  cursor: pointer;
  transition: opacity 0.1s, transform 0.4s;
}

.nav__close {
  opacity: 0;
}

.nav__list .nav__link {
  font-size: var(--font-size-sm);
}

.nav__link {
  color: $color-white;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;

  &:hover {
    color: $color-primary;
    transition: color 0.3s ease-in-out;
  }
}

/* Hover Border Below Menu Items */
.nav__menu .nav__list li:not(.has-dropdown) .nav__link::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0%;
  height: 4px;
  border-radius: 10px;
  background-color: var(--color-primary);
  transition: width 0.3s ease-in-out;
}

.nav__menu .nav__list li:not(.has-dropdown) .nav__link:hover::after {
  width: 100%;
}

/*=============== DROPDOWN ===============*/
.dropdown__item {
  position: relative;
  cursor: pointer;
}

.dropdown__arrow {
  font-size: 1.25rem;
  font-weight: initial;
  transition: transform 0.4s;
}

.dropdown__link,
.dropdown__sublink {
  color: $color-white;
  font-size: var(--font-size-sm);
  font-weight: 500;
  padding: 0.8rem;
  padding-left: 1.25rem;
  padding-right: 1.25rem;
  display: flex;
  align-items: center;
  column-gap: 0.5rem;
}

.dropdown__menu {
  border-radius: 5px;
  position: absolute;
  z-index: calc(var(--z-fixed) + 1);
  top: calc(var(--header-height) - 1rem);
  background-color: $color-primary;
}

.dropdown__menu,
.dropdown__submenu {
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease-in, visibility 0.3s ease-in;
}

/* Show dropdown menu & submenu */
.dropdown__item:hover .dropdown__menu,
.dropdown__subitem:hover>.dropdown__submenu {
  opacity: 1;
  visibility: visible;
  transition: opacity 0.3s ease-in, visibility 0.3s ease-in;
}

.dropdown__menu li .dropdown__link:hover {
  color: $color-white;
}

/* Rotate dropdown icon */
.dropdown__item:hover .dropdown__arrow {
  transform: rotate(180deg);
}

/* Menu Active */
.is-active,
.fixed-menu .is-active {
  color: $color-primary;
}

/* Show menu */
.show-menu {
  display: block !important;
}

/* Show icon */
.show-icon .nav__burger {
  opacity: 0;
  transform: rotate(90deg);
}

.show-icon .nav__close {
  opacity: 1;
  transform: rotate(90deg);
}

/*=============== BREAKPOINTS ===============*/
/* For small devices */
@media screen and (max-width: 1024px) {
  .fixed-menu {
    height: 101px;
  }

  .container {
    margin-inline: 1rem;
  }

  .nav__toggle {
    display: block;
  }

  .nav__menu {
    margin-top: 27px;
    display: none;
    background: hsla(220, 32%, 8%, 0.8);
    width: 100%;
    padding-top: 1rem;
    padding-bottom: 1rem;
    border-radius: 5px;
  }

  .nav__list {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 2rem;
  }

  .nav__link {
    color: $color-white;
  }
}

/* Styles for tablets in landscape mode */
@media only screen and (min-width: 769px) and (max-width: 1024px) {
  // .nav__toggle {
  //   display: block;
  // }

  // .nav {
  //   display: flex;
  //   justify-content: space-between;
  //   flex-direction: column;
  //   gap: 10px;
  // }

  // .nav__menu {
  //   margin-top: 15px;
  //   display: none;
  //   background: hsla(220, 32%, 8%, 0.8);
  //   width: 100%;
  //   padding-top: 1rem;
  //   padding-bottom: 1rem;
  //   border-radius: 5px;
  // }

  // .nav__list {
  //   display: flex;
  //   align-items: center;
  //   flex-direction: column;
  //   gap: 2rem;
  // }
  // .nav__link {
  //   color: $color-white;
  // }

  // .dropdown__menu {
  //   top: calc(var(--header-height) - 1.5rem);
  // }
}

/* For large devices */
@media screen and (min-width: 1024px) {
  .container {
    margin-inline: auto;
  }

  .nav {
    display: flex;
    justify-content: space-between;
  }

  .nav__toggle {
    display: none;
  }

  .nav__list {
    height: 100%;
    display: flex;
    align-items: center;
    gap: 3rem;
  }
}
</style>
