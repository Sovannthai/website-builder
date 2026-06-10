<template>
  <div>
    <v-skeleton-loader type="article" v-if="loading"></v-skeleton-loader>
    <div class="blog-content list-style" v-html="htmlContent"></div>
  </div>
</template>
<script lang="ts">
import { defineComponent, } from 'vue';

export default defineComponent({
  name: 'VHtml',
  props: {
    htmlContent: {
      type: String,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
});
</script>
<style scoped>
  ::v-deep(.blog-content) {
    width: 100%;
    padding: 0;
    margin: 0;
    line-height: 35px;
  }
  :deep(.blog-content img) {
    display: block;
    width: 100% !important;
    max-width: 100% !important;
    height: auto !important;
    margin: 24px 0;
    object-fit: cover;
    box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  }

  ::v-deep(.list-style ul) {
    list-style-type: disc;
    padding-top: 5px;
  }

  ::v-deep(.list-style li) {
    margin-left: 32px;
    padding-left: 10px;
    margin-bottom: 5px;
  }
</style>
