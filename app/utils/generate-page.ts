import fs from 'fs'
import path from 'path'

const name = process.argv[2]

if (!name) {
  console.error('❌ Please provide page name')
  process.exit(1)
}

const pageDir = path.resolve('app/pages', name)
const schemaDir = path.resolve('schemas')

if (!fs.existsSync(pageDir)) {
  fs.mkdirSync(pageDir, { recursive: true })
}

if (!fs.existsSync(schemaDir)) {
  fs.mkdirSync(schemaDir)
}

/* ---------------- index.vue content ---------------- */

const pageContent = `
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

const { data: schema } = await useFetch<Schema>('/${name}-schema.json')
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

`

fs.writeFileSync(
  path.join(pageDir, 'index.vue'),
  pageContent.trimStart()
)

/* ---------------- View details ---------------- */


console.log(`✅ Page created: /pages/${name}/index.vue`)
