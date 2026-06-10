<template>
  <ContainerWrapper class="py-12">
    <section-text
      :title="title"
    >
      <template #content>
    <v-row justify="center">
      <v-col
        v-for="(item, i) in items"
        :key="i"
        cols="12"
        md="6"
      >
        <v-card elevation="3" rounded="xl" class="pa-6">
          <v-row no-gutters>
            <v-col cols="auto" class="pr-4">
              <v-avatar size="56">
                <v-img :src="`/img/${item.avatar}` || '/img/avatar.png'" />
              </v-avatar>
            </v-col>

            <v-col>
              <div class="font-weight-medium">
                {{ item.name }}
              </div>
              <div class="text-caption text-grey">
                {{ item.role }}
              </div>
            </v-col>
          </v-row>

          <v-divider class="my-4" />

          <div class="text-body-1">
            “{{ item.message }}”
          </div>
        </v-card>
      </v-col>
    </v-row>
    </template>
    </section-text>
  </ContainerWrapper>
</template>

<script setup>
defineProps({ title: String, items: Array })
</script>
