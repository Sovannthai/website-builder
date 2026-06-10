<script setup lang="ts">
import { componentMap } from '~/utils/component-map'

interface SchemaLayout {
  type: string
  component_key: string
  data: Record<string, any>
}

interface Schema {
  layouts: SchemaLayout[]
}

const { data: schema } = await useFetch<Schema>('/blogs-schema.json')
const resolveComponent = (type: string) => {
  return componentMap[type] || null
}
</script>

<template>
  <component
    v-for="(block, index) in schema?.layouts"
    :key="block.type || index"
    :is="resolveComponent(block.component_key)"
    v-bind="block.data"
  />
</template>

