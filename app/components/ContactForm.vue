<template>
  <container-wrapper class="py-12">
    <v-card elevation="3" rounded="xl" class="pa-8">
      <v-form>
        <v-row>
          <v-col cols="12" md="6" v-if="fields.includes('name')">
            <v-text-field label="Name" />
          </v-col>

          <v-col cols="12" md="6" v-if="fields.includes('email')">
            <v-text-field label="Email" type="email" />
          </v-col>

          <v-col cols="12" v-if="fields.includes('message')">
            <v-textarea label="Message" rows="4" />
          </v-col>

          <v-col cols="12" class="text-right">
            <v-btn color="white" size="large" class="border" rounded>
              {{ submit_label }}
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </container-wrapper>
</template>

<script setup>
import ContainerWrapper from './ContainerWrapper.vue';

defineProps({
  fields: Array,
  submit_label: String
})
</script>
