<script setup lang="ts">
import { computed } from 'vue'
import { componentMap } from '~/utils/component-map'

interface SchemaLayout {
  type: string
  component_key: string
  data: Record<string, any>
}

interface Schema {
  layouts: SchemaLayout[]
}

const { data: schema } = await useFetch<Schema>('/schema.json')
const resolveComponent = (type: string) => {
  return componentMap[type] || null
}

// Filter out header and footer — they are rendered by the layout
const pageBlocks = computed(() => schema.value?.layouts.filter(l => l.type !== 'header' && l.type !== 'footer') || [])
</script>

<template>
  <!-- <ContainerWrapper fluid class="pa-0"> -->
    <component
      v-for="(block, index) in pageBlocks"
      :key="block.type || index"
      :is="resolveComponent(block.component_key)"
      v-bind="block.data"
    />
  <!-- </ContainerWrapper> -->
</template>
