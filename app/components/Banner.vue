<template>
  <ContainerWrapper
    :height="$vuetify.display.smAndDown ? '200px' : '300px'"
    class="d-flex align-center"
    :style="bannerStyle"
  >
    <div
      v-if="hasSideImage && !$vuetify.display.xs"
      class="banner-side-image"
      :style="{ backgroundImage: `url(${sideImage})` }"
    ></div>
    <div class="products-bg-gradient"></div>
    <div class="products-header-content">
      <v-card-subtitle v-if="normalText" class="text-lg text-uppercase pl-0">{{ normalText }}</v-card-subtitle>
      <bold-text :bold="bold" :normal="normal" />
      <slot name="content"></slot>
    </div>
  </ContainerWrapper>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { resolveImageSrc } from '~/utils/image';

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
    /** Side image shown when `showImg` is on. Falls back to the stock image. */
    image: {
      type: String,
      default: ''
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
  computed: {
    /** The side image, once resolved to a usable src. */
    sideImage(): string {
      return resolveImageSrc(this.image);
    },
    /**
     * Only draw the image layer when there's actually an image to draw.
     * Previously this fell back to a stock file that isn't in the repo, so the
     * layer rendered blank (and, with SSR off, the 404 quietly returned HTML).
     */
    hasSideImage(): boolean {
      return this.showImg && !!this.sideImage;
    },
    bannerStyle(): Record<string, string> {
      return { borderBottom: '1px solid #EBEBEB' };
    }
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
  /* Above the side image, so the text stays readable when they overlap */
  z-index: 2;
}

/* The image fills the right half with the text beside it. A real element
   rather than ::after: percentage/inset sizing on the pseudo-element didn't
   resolve against Vuetify's card, so it collapsed to ~32px tall. */
.banner-side-image {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 45%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  /* Fade into the banner rather than ending on a hard edge */
  -webkit-mask-image: linear-gradient(to right, transparent, #000 22%);
  mask-image: linear-gradient(to right, transparent, #000 22%);
  z-index: 1;
  pointer-events: none;
}
</style>
