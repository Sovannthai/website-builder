<template>
  <div style="border-top: 1px solid #EBEBEB;">
    <ContainerWrapper class="pa-4">
      <v-row class="justify-center">
        <v-col cols="12" class="text-center align-center"
          :class="{ 'justify-center': $vuetify.display.smAndDown, 'd-flex justify-space-between': !$vuetify.display.smAndDown }">
          <molecules-image-company-name @click="routeToHome()" style="cursor: pointer;" color="color-black" />
          <div :class="{ 'd-flex': !$vuetify.display.smAndDown, }">
            <span class="text-s mt-3">If you have any inquiry, please contact us via this email:
              <span class="font-weight-bold"> {{ footerContent.data?.email }}</span>
            </span>
          </div>
        </v-col>
      </v-row>
      <v-divider class="my-6"></v-divider>
      <v-row>
        <v-col cols="12" class="text-center">
          <span class="text-xs">All rights reserved. {{ new Date().getFullYear() }} Leopa Bamboo Co, Ltd</span>
        </v-col>
      </v-row>
    </ContainerWrapper>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: 'Footer',
  data() {
    return {
      footerContent: {} as any,
    };
  },
  async mounted() {
    // this.footerContent = await fetchMetaData();
  },
  methods: {
    routeToHome() {
      this.$router.push({ path: '/' });
    },
  },
})
</script>
<style scoped>
.no-break {
  white-space: nowrap;
}
</style>
