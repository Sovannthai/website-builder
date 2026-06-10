<template>
  <ContainerWrapper class="py-16">
    <v-card
      rounded="2xl"
      elevation="4"
      class="pa-10 text-center"
    >
      <h2 class="text-h5 font-weight-bold mb-3">
        {{ title }}
      </h2>

      <p class="text-body-1 mb-6">
        {{ description }}
      </p>

      <v-btn
        size="large"
        color="white"
        variant="flat"
        class="border"
        rounded
        :to="button.path"
      >
        {{ button.label }}
      </v-btn>
    </v-card>
  </ContainerWrapper>
</template>

<script setup>
defineProps({
  title: String,
  description: String,
  button: Object
})
</script>
