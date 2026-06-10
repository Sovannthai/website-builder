<template>
  <container-wrapper class="py-12">
    <section-text
      :title="title"  
    >
      <template #content>
        <v-row>
          <v-col
            v-for="(image, index) in images"
            :key="index"
            cols="12"
            sm="6"
            md="4"
          >
            <v-hover v-slot="{ isHovering, props }">
              <v-card
                v-bind="props"
                class="overflow-hidden"
                rounded="xl"
                elevation="4"
              >
                <v-img
                  :src="image"
                  height="260"
                  cover
                  :class="{ 'zoom': isHovering }"
                />
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </template>
    </section-text>
  </container-wrapper>
</template>

<script setup>
import ContainerWrapper from './ContainerWrapper.vue';

defineProps({
  title: String,
  images: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.zoom {
  transform: scale(1.05);
  transition: transform 0.4s ease;
}
</style>
