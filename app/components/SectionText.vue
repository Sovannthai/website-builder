<template>
  <div class="d-flex justify-space-between align-center">
    <v-card-title class="text-xl font-weight-bold pl-0 text-wrap w-50">{{ title }}</v-card-title>
    <div>
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
  },
  data() {
    return {};
  },
  computed: {
    checkScreenXs() {
      return this.$vuetify.display.xs;
    }
  },
});
</script>
