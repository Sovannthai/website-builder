<template>
  <ContainerWrapper class="py-12">
    <SectionText :title="title">
      <template #content>
        <v-row>
          <template v-if="loading">
            <v-col v-for="i in 3" :key="`sk-${i}`" cols="12" sm="6" md="4">
              <v-skeleton-loader type="image" />
            </v-col>
          </template>

          <v-col
            v-else
            v-for="(image, index) in items"
            :key="index"
            cols="12"
            sm="6"
            md="4"
          >
            <v-hover v-slot="{ isHovering, props }">
              <v-card v-bind="props" class="overflow-hidden" rounded="xl" elevation="4">
                <v-img :src="resolveImageSrc(image)" height="260" cover :class="{ zoom: isHovering }" />
              </v-card>
            </v-hover>
          </v-col>
        </v-row>

        <p v-if="error" class="text-caption text-error mt-2">{{ error }}</p>
      </template>
    </SectionText>
  </ContainerWrapper>
</template>

<script setup>
import { resolveImageSrc } from '~/utils/image'
import { computed } from 'vue'
import { useCollection, pickWith, toFieldMap, FIELD_ALIASES } from '~/composables/useCollection'

const props = defineProps({
  title: String,
  /** Static image URLs saved in the page. */
  images: { type: Array, default: () => [] },
  /** Collection key to pull images from instead. */
  apiCollection: { type: String, default: '' },
  apiLimit: { type: [String, Number], default: 9 },
  apiSort: { type: String, default: '' },
  /** Which API field fills each part: [{ key: 'image', value: 'photo' }] */
  apiFields: { type: Array, default: () => [] },
})

const fieldMap = computed(() => toFieldMap(props.apiFields))

const { items, loading, error } = useCollection(
  () => props.apiCollection,
  {
    fallback: () => props.images,
    limit: () => props.apiLimit,
    sort: () => props.apiSort,
    // Gallery works with bare URL strings rather than objects
    map: (row) => (typeof row === 'string' ? row : pickWith(row, fieldMap.value.image, FIELD_ALIASES.image)),
  }
)
</script>

<style scoped>
.zoom {
  transform: scale(1.05);
  transition: transform 0.4s ease;
}
</style>
