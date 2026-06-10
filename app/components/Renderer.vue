<script setup lang="ts">
import { componentMap } from '~/utils/component-map'

defineProps<{
  schema: {
    layouts: {
      type: string
      props: Record<string, any>
    }[]
  }
}>()

</script>

<template>
  <component
    v-for="(section, i) in schema.layouts"
    :key="i"
    :is="componentMap[section.type]"
    v-bind="section.props"
  />
  <slot name="default"></slot>
</template>
