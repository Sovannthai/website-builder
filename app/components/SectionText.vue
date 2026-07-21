<template>
  <!-- Header stacks on mobile so the title isn't squeezed into half the width
       next to the aside content; side-by-side from sm up. -->
  <div class="section-text__header d-flex flex-column flex-sm-row justify-space-between align-start align-sm-center ga-2">
    <v-card-title class="section-text__title text-xl font-weight-bold pl-0 text-wrap">{{ title }}</v-card-title>
    <div class="section-text__aside">
      <div v-if="subtitle" class="text-sm pl-0">{{ subtitle }}</div>
      <slot name="left"></slot>
    </div>
  </div>
  <slot name="content"></slot>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'SectionText',
  props: {
    title: {
      type: String,
      required: true,
      default: 'title'
    },
    subtitle: {
      type: String,
      required: false,
    }
  }
});
</script>

<style scoped>
.section-text__title {
  width: 100%;
  line-height: 1.25;
}

/* Vuetify has no responsive width utilities, so the 50/50 split is done here
   from the sm breakpoint (600px) up. */
@media (min-width: 600px) {
  .section-text__title {
    width: 50%;
  }

  .section-text__aside {
    text-align: right;
  }
}
</style>
