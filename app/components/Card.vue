<template>
  <v-card
    :image="image"
    height="400"
    width="auto"
    class="pa-4"
  >
    <TitleText class="fill-height justify-end text-white" :title="title" :subtitle="subtitle"></TitleText>
  </v-card>
</template>
<script lang="ts">
  definePageMeta({
    layout: 'default'
  });
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
    },
    data() {
      return {
        subtitle: 'This is a subtitle for the card component.This is a subtitle for the card component.s'
      }
    },
    methods: {
      
    }
  }
</script>