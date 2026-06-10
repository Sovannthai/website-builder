<template>
  <v-app class="wswg-layout wswg-layout--default">
    <slot />
  </v-app>
</template>

<script setup lang="ts">
defineOptions({ label: "Default Layout" });
</script>

<style scoped>
.wswg-layout--default {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}
</style>
