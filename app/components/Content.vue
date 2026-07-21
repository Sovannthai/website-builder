<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    description: string
    image: string
    image_position?: 'left' | 'right'
  }>(),
  { image_position: 'right' }
)
</script>

<template>
  <ContainerWrapper class="mt-4" bg-color="#fff4e6">
    <SectionText :title="title">
      <template #content>
        <!-- Image and text sit side by side from md up; on smaller screens they
             stack with the image first, so `order` is only applied at md+. -->
        <v-row class="mt-2" align="center">
          <v-col
            cols="12"
            md="6"
            order="1"
            :order-md="image_position === 'right' ? 2 : 1"
          >
            <v-img :src="image" class="content-image rounded-lg" cover />
          </v-col>

          <v-col
            cols="12"
            md="6"
            order="2"
            :order-md="image_position === 'right' ? 1 : 2"
          >
            <p v-if="description" class="content-description text-md">{{ description }}</p>
            <slot name="details"></slot>
          </v-col>
        </v-row>
      </template>
    </SectionText>
  </ContainerWrapper>
</template>

<style scoped>
.content-image {
  height: clamp(220px, 38vw, 460px);
  width: 100%;
}

.content-description {
  line-height: 1.7;
  color: #5a6c7d;
  /* Long unbroken strings (e.g. pasted text) shouldn't force horizontal scroll */
  overflow-wrap: anywhere;
}
</style>
