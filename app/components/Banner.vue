<template>
  <ContainerWrapper :height="$vuetify.display.smAndDown ? '200px' : '300px'" class="d-flex align-center"
    :class="{ 'bg-img-right': showImg && !$vuetify.display.xs }" style="border-bottom: 1px solid #EBEBEB;">
    <div class="products-bg-gradient"></div>
    <div class="products-header-content">
      <v-card-subtitle class="text-lg text-uppercase pl-0" v-if="!showImg">{{ normalText }}</v-card-subtitle>
      <bold-text v-if="!showImg" :bold="bold" :normal="normal" />
      <slot name="content"></slot>
    </div>
  </ContainerWrapper>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
interface TextStyle {
  text: string;
  color: string;
  fontSize: string;
}
export default defineComponent({
  name: 'Banner',
  props: {
    normalText: {
      type: String,
      default: 'Check out our'
    },
    showImg: {
      type: Boolean,
      default: false
    },
    bold: {
      type: Object as () => TextStyle,
      required: false,
      default: () => ({ text: '', color: '', fontSize: '' })
    },
    normal: {
      type: Object as () => TextStyle,
      required: false,
      default: () => ({ text: '', color: '', fontSize: '' })
    }
  },
  data() {
    return {};
  }
});
</script>
<style scoped>
.products-bg-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background: linear-gradient(to right, rgba(138, 167, 59, 0.3), rgba(54, 65, 23, 0.3) 85%);
}

.products-header-content {
  position: relative;
  z-index: 1;
}

.bg-img {
  background-image: url('/img/aboutUs-min.png') !important;
  background-size: contain !important;
  background-repeat: no-repeat !important;
  background-position: left !important;
  /* Flip the right image horizontally */
}

.bg-img-right {
  /* Flip the right-side image horizontally */
  background-position-x: 15% !important;
  background-size: contain !important;
  background-repeat: no-repeat !important;
  /* Use transform for the right image using a pseudo-element */
  position: relative;
}

.bg-img-right::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-image: url('/img/aboutUs-min.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position-x: 15%;
  transform: scaleX(-1);
  z-index: 1;
  pointer-events: none;
}
</style>
