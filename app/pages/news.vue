<template>
  <ContainerWrapper style="margin-top: 100px;">
    <SectionText
      title="News & Articles and also alot of text to check wrapping behavior"
    >
      <template #left>
        <v-btn rounded variant="flat" class="border text-none text-md">Browse at articles</v-btn>
      </template>
      <template #content>
        <v-row>
          <v-col cols="12" xl="3" lg="4" md="6" sm="6" class="text-h4 pa-4" v-for="value in Array(5)" :key="value">
            <Card title="This is title" subtitle="This is subcomponent subtitle" image="/img/cat.jpeg" />
          </v-col>
        </v-row>
      </template>
    </SectionText>
  </ContainerWrapper>
  <ContainerWrapper>
    <SectionText
      title="Popurlar Now"
    >
      <template #content>
         <v-row>
          <v-col cols="12" xl="3" lg="4" md="6" sm="6" class="text-h4 pa-4" v-for="value in Array(5)" :key="value">
            <CardList />
          </v-col>
        </v-row>
      </template>
    </SectionText>
  </ContainerWrapper>
</template>
<script lang="ts">
  definePageMeta({
  menuProps: {
    // menus: schema.value?.layouts.find(layout => layout.type === 'navigation')?.data.menus || []
  }
});
export default {
  name: 'Header'
  
}
</script>
