<template>
  <ContainerWrapper class="py-12">
    <SectionText
      :title="title"
    >
      <template #content>
        <v-row>
          <v-col
            v-for="(post, i) in posts"
            :key="i"
            cols="12"
            md="6"
          >
            <v-card
              elevation="0"
              rounded="xl"
              class="pa-5 border"
              :to="post.path"
            >
              <div class="text-h6 font-weight-medium">
                {{ post.title }}
              </div>
              <div class="text-body-2 text-grey mt-2">
                {{ post.summary }}
              </div>
    
              <v-btn
                variant="text"
                color="primary"
                class="mt-3 px-0"
              >
                Read more →
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </SectionText>
  </ContainerWrapper>
</template>

<script setup>
defineProps({
  title: String,
  posts: Array
})
</script>
