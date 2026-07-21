<template>
  <v-card
    :image="image"
    class="app-card pa-4"
    width="auto"
  >
    <TitleText class="fill-height justify-end text-white" :title="title" :subtitle="subtitle"></TitleText>
  </v-card>
</template>

<script lang="ts">
export default {
  name: 'Card',
  props: {
    title: {
      type: String,
      required: false,
      default: 'Card Title'
    },
    subtitle: {
      type: String,
      required: false,
      default: 'This is a subtitle for the card component.'
    },
    image: {
      type: String,
      required: false,
      default: '@/assets/images/cat.jpg'
    }
  }
}
</script>

<style scoped>
.app-card {
  height: clamp(260px, 32vw, 400px);
}
</style>
