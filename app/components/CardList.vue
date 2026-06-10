<template>
  <v-card class="pa-0 border" elevation="0">
    <div class="d-flex align-center">
      <v-card-title class="text-md font-weight-bold">Travel </v-card-title>
      <div class="text-gray text-md">Sep 1, 2023</div>
    </div>
    <TitleText class="fill-height justify-end pa-4 pt-0" :title="'Exploring the Mountains with the best view for sunset'" :textSize="'text-md'" ></TitleText>
  </v-card>
</template>
<script lang="ts">
  definePageMeta({
    layout: 'default'
  });
  export default {
    name: 'CardList',
    data() {
      return {
        
      }
    },
    methods: {
      
    }
  }
</script>