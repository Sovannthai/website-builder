<template>
  <v-carousel
    class="slider-carousel"
    :show-arrows="false"
    cycle
    hide-delimiter-background
  >
    <v-carousel-item
      v-for="(slide, i) in slides"
      :key="i"
    >
      <v-img
        :src="slide.image"
        cover
        class="slider-image"
      >
        <!-- Overlay -->
        <div class="slider-overlay d-flex align-center">
          <ContainerWrapper class="pa-0" style="width: 100%;">
            <v-row>
              <v-col cols="12" md="6">
                <h1 class="text-h5 text-sm-h4 text-md-h3 font-weight-bold mb-3 mb-md-4 slider-title">
                  {{ slide.title }}
                </h1>

                <p class="text-body-2 text-md-body-1 mb-4 mb-md-6 slider-desc">
                  {{ slide.description }}
                </p>
                <v-btn rounded variant="flat" color="transparent" class="border text-none text-md slider-btn" size="large">Learn More </v-btn>
              </v-col>
            </v-row>
          </ContainerWrapper>
        </div>
      </v-img>
    </v-carousel-item>
  </v-carousel>
</template>

<script setup>
defineProps({
  slides: {
    type: Array,
    required: true
  }
})
</script>
<style scoped>
/* Fullscreen carousel on desktop */
.slider-carousel {
  height: 100vh !important;
}

.slider-image {
  height: 100vh !important;
}

.slider-overlay {
  height: 100%;
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.55) 0%,
    rgba(0, 0, 0, 0.25) 60%,
    rgba(0, 0, 0, 0) 100%
  );
  color: white;
}

.slider-title {
  color: #ffffff;
  text-shadow:
    0 2px 8px rgba(0, 0, 0, 0.8),
    0 1px 3px rgba(0, 0, 0, 0.9);
  -webkit-font-smoothing: antialiased;
  letter-spacing: 0.01em;
}

.slider-desc {
  color: rgba(255, 255, 255, 0.95);
  text-shadow:
    0 1px 6px rgba(0, 0, 0, 0.85),
    0 1px 2px rgba(0, 0, 0, 0.7);
  -webkit-font-smoothing: antialiased;
}

.slider-btn {
  color: #ffffff !important;
  border-color: rgba(255, 255, 255, 0.8) !important;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  background: rgba(255, 255, 255, 0.08) !important;
}

/* Mobile adjustments */
@media (max-width: 960px) {
  .slider-carousel {
    height: 70vh !important;
    min-height: 500px;
  }
  
  .slider-image {
    height: 70vh !important;
    min-height: 500px;
  }
}

@media (max-width: 600px) {
  .slider-carousel {
    height: 60vh !important;
    min-height: 450px;
  }
  
  .slider-image {
    height: 60vh !important;
    min-height: 450px;
  }
  
  .slider-overlay {
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.65) 0%,
      rgba(0, 0, 0, 0.35) 50%,
      rgba(0, 0, 0, 0.1) 100%
    );
  }
}
</style>
