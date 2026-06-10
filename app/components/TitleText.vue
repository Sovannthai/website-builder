<template>
  <div class="d-flex flex-column">
    <div class="font-weight-bold" :class="[textSize]" style="white-space: pre-line;">
      {{ title }}
    </div>
    <div class="text-sm mt-2" v-if="subtitle" style="white-space: pre-line;">
      {{ subtitle }}
    </div>
  </div>
</template>
<script lang="ts">
  definePageMeta({
    layout: 'default'
  });
  export default {
    name: 'TitleText',
    props: {
      title: {
        type: String,
        required: true,
      },
      subtitle: {
        type: String,
        required: false,
      },
      textSize: {
        type: String,
        required: false,
        default: 'text-lg'
      }
    },
    data() {
      return {
        
      }
    },
    methods: {
      
    }
  }
</script>