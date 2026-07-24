<template>
  <ContainerWrapper class="py-12">
    <SectionText :title="title">
      <template #content>
        <v-row justify="center">
          <template v-if="loading">
            <v-col v-for="i in 2" :key="`sk-${i}`" cols="12" md="6">
              <v-skeleton-loader type="list-item-avatar-two-line" />
            </v-col>
          </template>

          <v-col
            v-else
            v-for="(item, i) in items"
            :key="i"
            cols="12"
            md="6"
          >
            <v-card elevation="3" rounded="xl" class="pa-6">
              <v-row no-gutters>
                <v-col cols="auto" class="pr-4">
                  <v-avatar size="56">
                    <v-img :src="resolveImageSrc(item.avatar, '/img/avatar.png')" />
                  </v-avatar>
                </v-col>

                <v-col>
                  <div class="font-weight-medium">{{ item.name }}</div>
                  <div class="text-caption text-grey">{{ item.role }}</div>
                </v-col>
              </v-row>

              <v-divider class="my-4" />

              <div class="text-body-1">“{{ item.message }}”</div>
            </v-card>
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
  /** Static testimonials saved in the page. */
  items: { type: Array, default: () => [] },
  /** Collection key to pull testimonials from instead. */
  apiCollection: { type: String, default: '' },
  apiLimit: { type: [String, Number], default: 6 },
  apiSort: { type: String, default: '' },
  /** Which API field fills each part: [{ key: 'name', value: 'author' }] */
  apiFields: { type: Array, default: () => [] },
})

const fieldMap = computed(() => toFieldMap(props.apiFields))

const { items, loading, error } = useCollection(
  () => props.apiCollection,
  {
    fallback: () => props.items,
    limit: () => props.apiLimit,
    sort: () => props.apiSort,
    map: (row) => ({
      name: pickWith(row, fieldMap.value.name, FIELD_ALIASES.title, 'Anonymous'),
      role: pickWith(row, fieldMap.value.role, FIELD_ALIASES.role),
      message: pickWith(row, fieldMap.value.message, FIELD_ALIASES.message),
      avatar: pickWith(row, fieldMap.value.image, FIELD_ALIASES.image),
    }),
  }
)
</script>
