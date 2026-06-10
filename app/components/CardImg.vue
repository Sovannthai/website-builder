<template>
  <v-card
    :min-width="minWidth"
    :width="minWidth"
    :height="maxheightCard"
    class="pa-2"
  >
    <template v-if="loading">
      <v-skeleton-loader
        type="card"
        class="mb-2"
        :height="maxheightCard"
      />
    </template>
    <template v-else>
      <slot name="default"></slot>
      <v-img
        :src="imgUrl"
        :alt="alt"
        class="card-img justify-center"
        :height="maxHeightImgComputed"
        color="#EBEBEB"
        rounded
        cover
      ></v-img>
      <v-divider class="full-width-divider"></v-divider>
      <v-card-title class="text-s pl-0 card-title-break">{{ title }} </v-card-title>
      <v-card-subtitle v-if="subtitle.length > 0" class="text-s pl-0 card-title-break">{{ subtitle }}</v-card-subtitle>
      <v-card-actions v-if="actions" class="px-0">
        <slot name="actions"></slot>
      </v-card-actions>
    </template>
  </v-card>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CardImg',
  props: {
    loading: {
      type: Boolean,
      required: false,
      default: false
    },
    minWidth: {
      type: [String, Number],
      required: false,
      default: '100%'
    },
    maxHeightImg: {
      type: [String, Number],
      required: false,
    },
    src: {
      type: String,
      required: false,
      default: '/img/notFound.png'
    },
    alt: {
      type: String,
      required: false
    },
    actions: {
      type: Boolean,
      required: false,
      default: false
    },
    title: {
      type: String,
      required: false,
      default: ''
    },
    subtitle: {
      type: String,
      required: false,
      default: ''
    },
    maxWidth: {
      type: [String, Number],
      required: false,
      default: '100%'
    }
  },
  computed: {
    maxheightCard() {
      if (this.maxHeightImg) return 'auto';
      if (this.$vuetify.display.sm) return 340;
      if (this.$vuetify.display.xs) return 440;
      return 290;
    },
    maxHeightImgComputed(): string | number {
      if (this.maxHeightImg) return this.maxHeightImg;
      if (this.$vuetify.display.sm) return 250;
      if (this.$vuetify.display.xs) return 350;
      return 200;
    },
    imgUrl() {
      return this.src || '/img/notFound.png';
    }
  },
  data() {
    return {
      maxHeightCard: '291px',
    };
  },
});
</script>
<style scoped>
.card-title-break {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  /* Limit to 2 lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  white-space: normal;
  width: 100%;
  line-height: 1.4em;
  /* Adjust line height as needed */
  max-height: 3.5em;
  /* 2 * line-height */
}
</style>
