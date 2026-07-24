<script setup lang="ts">
import { resolveImageSrc } from '~/utils/image'
import { computed } from 'vue'
import { useCollection, pickWith, toFieldMap, FIELD_ALIASES } from '~/composables/useCollection'

interface FeatureItem {
  image: string
  title: string
  description: string
}

const props = withDefaults(
  defineProps<{
    title: string
    /** Static items saved in the page. */
    items?: FeatureItem[]
    /** Collection key to pull items from instead. */
    apiCollection?: string
    apiLimit?: string | number
    apiSort?: string
    /** Which API field fills each part: [{ key: 'title', value: 'headline' }] */
    apiFields?: Array<{ key?: string; value?: string }>
  }>(),
  { items: () => [], apiCollection: '', apiLimit: 6, apiSort: '', apiFields: () => [] }
)

const fieldMap = computed(() => toFieldMap(props.apiFields))

const { items: rows, loading, error } = useCollection<FeatureItem>(
  () => props.apiCollection,
  {
    fallback: () => props.items,
    limit: () => props.apiLimit,
    sort: () => props.apiSort,
    map: (row) => ({
      title: pickWith(row, fieldMap.value.title, FIELD_ALIASES.title, 'Untitled'),
      description: pickWith(row, fieldMap.value.description, FIELD_ALIASES.description),
      image: pickWith(row, fieldMap.value.image, FIELD_ALIASES.image),
    }),
  }
)
</script>

<template>
  <ContainerWrapper class="mt-4">
    <SectionText :title="title">
      <template #left>
        <v-btn rounded variant="flat" class="border text-none text-md" size="large">Browse at articles</v-btn>
      </template>
      <template #content>
        <v-row class="mt-4">
          <template v-if="loading">
            <v-col v-for="i in 3" :key="`sk-${i}`" cols="12" sm="6" md="4" class="pa-4">
              <v-skeleton-loader type="card" />
            </v-col>
          </template>

          <v-col
            v-else
            cols="12" sm="6" md="4" class="pa-4"
            v-for="(item, i) in rows"
            :key="i"
          >
            <Card :title="item.title" :subtitle="item.description" :image="resolveImageSrc(item.image)" />
          </v-col>
        </v-row>

        <p v-if="error" class="text-caption text-error mt-2">{{ error }}</p>
      </template>
    </SectionText>
  </ContainerWrapper>
</template>
