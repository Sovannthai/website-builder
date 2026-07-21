<template>
  <div v-if="slides?.length" class="slider">
    <Swiper
      class="slider__swiper"
      :modules="modules"
      :slides-per-view="1"
      :speed="900"
      :loop="hasMultiple"
      effect="fade"
      :fade-effect="{ crossFade: true }"
      :autoplay="hasMultiple ? { delay: 5500, disableOnInteraction: false, pauseOnMouseEnter: true } : false"
      :pagination="hasMultiple ? { clickable: true } : false"
      :navigation="hasMultiple"
      :keyboard="{ enabled: true }"
      :a11y="{ enabled: true }"
    >
      <SwiperSlide v-for="(slide, i) in slides" :key="i" class="slider__slide">
        <!-- Background image as a layer so it can slowly zoom (Ken Burns) -->
        <div
          class="slider__image"
          :style="{ backgroundImage: `url(${resolveImageSrc(slide.image)})` }"
        />
        <div class="slider__overlay" />

        <div class="slider__content d-flex align-center">
          <ContainerWrapper class="pa-0" style="width: 100%;">
            <v-row no-gutters>
              <v-col cols="12" md="7">
                <h2 class="slider__title">{{ slide.title }}</h2>
                <p v-if="slide.description" class="slider__desc">{{ slide.description }}</p>
                <v-btn
                  class="slider__cta border text-none"
                  rounded
                  variant="flat"
                  color="transparent"
                  size="large"
                >
                  Learn More
                </v-btn>
              </v-col>
            </v-row>
          </ContainerWrapper>
        </div>
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, EffectFade, Navigation, Pagination, Keyboard, A11y } from 'swiper/modules'
import { resolveImageSrc } from '~/utils/image'

import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

const props = defineProps({
  slides: {
    type: Array,
    required: true
  }
})

const modules = [Autoplay, EffectFade, Navigation, Pagination, Keyboard, A11y]

// Looping/autoplay/controls only make sense with more than one slide.
const hasMultiple = computed(() => (props.slides?.length ?? 0) > 1)
</script>

<style scoped>
.slider {
  /* One knob for the height, overridden per breakpoint below */
  --slider-height: 100vh;

  /* Full-bleed: cancel the page layout's side padding so the slider runs edge
     to edge at every breakpoint. --page-side-padding is published by the
     page-builder layout; the 0px fallback keeps this safe when the slider is
     used outside that layout. Negative margins are used instead of 100vw so a
     visible scrollbar can't push the page into horizontal overflow. */
  margin-left: calc(-1 * var(--page-side-padding, 0px));
  margin-right: calc(-1 * var(--page-side-padding, 0px));
}

.slider__swiper {
  height: var(--slider-height);
  /* Swiper theme hooks — inherited by the arrows/bullets Swiper renders */
  --swiper-theme-color: #ffffff;
  --swiper-navigation-size: 24px;
}

.slider__slide {
  position: relative;
  overflow: hidden;
}

.slider__image {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  transform: scale(1);
  transition: transform 7s ease-out;
}

/* Slow zoom on whichever slide is showing */
.slider__slide.swiper-slide-active .slider__image {
  transform: scale(1.08);
}

.slider__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.6) 0%,
    rgba(0, 0, 0, 0.28) 60%,
    rgba(0, 0, 0, 0) 100%
  );
}

.slider__content {
  position: relative;
  height: 100%;
  color: #fff;

  /* The slider itself is pulled full-bleed above, so put the page's side
     padding back on the *content* only. The image runs edge to edge while the
     text stays aligned with the other blocks. */
  padding-left: var(--page-side-padding, 0px);
  padding-right: var(--page-side-padding, 0px);
}

.slider__title {
  /* Explicit: Vuetify styles headings globally, so white isn't inherited here */
  color: #ffffff;
  font-size: clamp(1.6rem, 4vw, 3rem);
  font-weight: 700;
  line-height: 1.15;
  margin-bottom: 0.75rem;
  overflow-wrap: anywhere;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8), 0 1px 3px rgba(0, 0, 0, 0.9);
}

.slider__desc {
  font-size: clamp(0.95rem, 1.6vw, 1.1rem);
  line-height: 1.6;
  max-width: 46ch;
  margin-bottom: 1.5rem;
  color: rgba(255, 255, 255, 0.95);
  overflow-wrap: anywhere;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.85);
}

.slider__cta {
  color: #fff !important;
  border-color: rgba(255, 255, 255, 0.8) !important;
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(2px);
}

/* Staggered entrance for the active slide's text. Done in CSS rather than with
   Swiper's parallax module, which misbehaves when combined with loop. */
.slider__title,
.slider__desc,
.slider__cta {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.slider__slide.swiper-slide-active .slider__title {
  opacity: 1;
  transform: none;
  transition-delay: 0.25s;
}
.slider__slide.swiper-slide-active .slider__desc {
  opacity: 1;
  transform: none;
  transition-delay: 0.38s;
}
.slider__slide.swiper-slide-active .slider__cta {
  opacity: 1;
  transform: none;
  transition-delay: 0.5s;
}

/* Arrows: hidden until hover on desktop, always hidden on touch-sized screens */
.slider__swiper :deep(.swiper-button-next),
.slider__swiper :deep(.swiper-button-prev) {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(4px);
  opacity: 0;
  transition: opacity 0.3s ease, background 0.3s ease;
}
.slider__swiper :deep(.swiper-button-next svg),
.slider__swiper :deep(.swiper-button-prev svg) {
  width: 50%;
  height: 50%;
}
.slider__swiper:hover :deep(.swiper-button-next),
.slider__swiper:hover :deep(.swiper-button-prev) {
  opacity: 1;
}
.slider__swiper :deep(.swiper-button-next:hover),
.slider__swiper :deep(.swiper-button-prev:hover) {
  background: rgba(0, 0, 0, 0.55);
}

.slider__swiper :deep(.swiper-pagination-bullet) {
  width: 10px;
  height: 10px;
  background: #fff;
  opacity: 0.45;
  transition: opacity 0.3s ease, width 0.3s ease;
}
.slider__swiper :deep(.swiper-pagination-bullet-active) {
  opacity: 1;
  width: 28px;
  border-radius: 5px;
}

@media (max-width: 960px) {
  .slider {
    --slider-height: max(70vh, 500px);
  }
  .slider__swiper :deep(.swiper-button-next),
  .slider__swiper :deep(.swiper-button-prev) {
    display: none;
  }
}

@media (max-width: 600px) {
  .slider {
    --slider-height: max(60vh, 450px);
  }
  .slider__overlay {
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.7) 0%,
      rgba(0, 0, 0, 0.35) 55%,
      rgba(0, 0, 0, 0.1) 100%
    );
  }
}

/* Respect users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  .slider__image,
  .slider__title,
  .slider__desc,
  .slider__cta {
    transition: none;
  }
  .slider__slide.swiper-slide-active .slider__image {
    transform: none;
  }
}
</style>
