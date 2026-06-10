<script setup lang="ts">
defineProps<{
  title: string
  description: string
  image: string
  image_position: 'left' | 'right'
}>()
</script>

<template>
  <ContainerWrapper class="mt-4" bg-color="#fff4e6">
    <SectionText
      :title="title"
      :subtitle="description"
    >
      <template #content>
        <v-row class="mt-2">
          <v-col cols="12">
            <v-img :src="image" height="500px" class="rounded-lg" rounded="md" cover></v-img>
          </v-col>
          <v-col cols="12" :order="image_position === 'left' ? 2 : 1" class="d-flex align-center">
            <slot name="details"></slot>
          </v-col>
        </v-row>
      </template>
    </SectionText>
  </ContainerWrapper>
</template>
