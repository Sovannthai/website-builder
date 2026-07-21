<script setup lang="ts">
import { resolveImageSrc } from '~/utils/image'

defineProps<{
  title: string
  items: {
    image: string
    title: string
    description: string
  }[]
}>()
</script>
<template>
  <ContainerWrapper class="mt-4">
    <SectionText
      :title="title"
    >
      <template #left>
        <v-btn rounded variant="flat" class="border text-none text-md" size="large">Browse at articles</v-btn>
      </template>
      <template #content>
        <v-row class="mt-4">
          <v-col cols="12" sm="6" md="4" class="pa-4" v-for="(item, i) in items" :key="i">
            <Card :title="item.title" :subtitle="item.description" :image="resolveImageSrc(item.image)" />
          </v-col>
        </v-row>
      </template>
    </SectionText>
  </ContainerWrapper>
</template>
