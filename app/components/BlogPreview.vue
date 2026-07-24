<template>
  <ContainerWrapper class="py-12">
    <SectionText :title="title">
      <template #content>
        <v-row>
          <!-- Skeletons while a collection is loading -->
          <template v-if="loading">
            <v-col v-for="i in 2" :key="`sk-${i}`" cols="12" md="6">
              <v-skeleton-loader type="article" />
            </v-col>
          </template>

          <v-col
            v-else
            v-for="(post, i) in items"
            :key="i"
            cols="12"
            md="6"
          >
            <v-card
              elevation="0"
              rounded="xl"
              class="pa-5 border"
              :to="post.path || undefined"
            >
              <div class="text-h6 font-weight-medium">
                {{ post.title }}
              </div>
              <div class="text-body-2 text-grey mt-2">
                {{ post.summary }}
              </div>

              <v-btn variant="text" color="primary" class="mt-3 px-0">
                Read more →
              </v-btn>
            </v-card>
          </v-col>
        </v-row>

        <p v-if="error" class="text-caption text-error mt-2">{{ error }}</p>
      </template>
    </SectionText>
  </ContainerWrapper>
</template>

<script setup>
import { computed } from 'vue'
import { useCollection, pickWith, toFieldMap, FIELD_ALIASES } from '~/composables/useCollection'

const props = defineProps({
  title: String,
  /** Static posts saved in the page. */
  posts: { type: Array, default: () => [] },
  /** Collection key to pull posts from instead, e.g. "news". */
  apiCollection: { type: String, default: '' },
  apiLimit: { type: [String, Number], default: 6 },
  apiSort: { type: String, default: '-date_created' },
  /** Which API field fills each part: [{ key: 'title', value: 'headline' }] */
  apiFields: { type: Array, default: () => [] },
})

const fieldMap = computed(() => toFieldMap(props.apiFields))

const { items, loading, error } = useCollection(
  () => props.apiCollection,
  {
    fallback: () => props.posts,
    limit: () => props.apiLimit,
    sort: () => props.apiSort,
    map: (row) => ({
      title: pickWith(row, fieldMap.value.title, FIELD_ALIASES.title, 'Untitled'),
      summary: pickWith(row, fieldMap.value.description, FIELD_ALIASES.description),
      // Prefer an explicitly mapped link, else a routable id, else aliases
      path: fieldMap.value.path
        ? pickWith(row, fieldMap.value.path, FIELD_ALIASES.path)
        : row?.id
          ? `/blogs/${row.id}`
          : pickWith(row, '', FIELD_ALIASES.path),
    }),
  }
)
</script>
