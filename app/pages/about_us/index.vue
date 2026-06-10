
<template>
  <Banner :bold="bold" :normal="normal"/>
  <!-- <SchemaRenderer v-if="schema" :schema="schema" /> -->
   <ContainerWrapper bg-color="#F5F5F5">
    <TabVertical :tabs="topicCategories" keyAccess="name"  @update:tab="updatedTap($event)">
      <template #content>
        <div v-if="blogItems.length === 0 && !loading" class="text-center align-center w-full my-5" :style="{ minHeight: blogItems.length === 0 && !$vuetify.display.smAndDown ? '30vh' : 'auto' }">
          No content posts available.
        </div>
        <v-row class="pb-2">
          <v-col cols="12" md="6" lg="4" xl="3" sm="6" v-for="i in Array(3)" v-if="loading" >
            <v-skeleton-loader :key="i" type="card" v-if="loading"></v-skeleton-loader>
          </v-col>
          <v-col cols="12" md="6" lg="4" xl="3" sm="6" v-for="blog in blogItems" v-if="!loading">
            <CardImg
              :alt="'blogs'"
              :title="blog.title"
              :subtitle="blog.short_description || ''"
              @click="viewBlog(blog.id)"
              :loading="loading"
            ></CardImg>
          </v-col>
        </v-row>
      </template>
      <template #footer>
        <Pagination
          v-if="blogItems.length > 0"
          v-model="currentPage"
          :items="blogItemsCount"
          :items-per-page="8"
          @update:modelValue="pageChange($event)"
        ></Pagination>
      </template>
    </TabVertical>
  </ContainerWrapper>
</template>
<script lang="ts">
import CardImg from '@/components/CardImg.vue';
import { get } from '@/utils/api';
export default {
    name: 'BlogsPage',
    data() {
      return {
        bold: { text: 'Latest', color: 'primary-color', fontSize: 'text-xxxl' },
        normal: { text: 'Posts', color: 'secondary-color', fontSize: 'text-xxxl' },
        currentPage: 1,
        topicCategories: [] as any[],
        blogItems: [] as any[],
        blogItemsCount: 0,
        topicCategoryId: null as number | null,
        loading: false
      }
    },
    async mounted() {
      // console.log('Blogs Page Mounted');
      this.topicCategories = await get('news_topic').then((res: any) => res.data);
      // console.log('api', this.topicCategories);
    },
    methods: {
      updatedTap(tab: any) {
        this.topicCategoryId = tab.id;
        console.log('Tab updated', tab);
        this.fetchBlogs();
      },
      pageChange(page: number) {
        console.log('Page changed to', page);
        this.currentPage = page;
        this.fetchBlogs();
      },
      async fetchBlogs() {
        // Fetch blogs based on the selected category
        this.loading = true;
        const params = this.topicCategoryId ? { topic: { _eq: this.topicCategoryId } } : {};
        await get('news', {
          limit: 8,
          page: this.currentPage,
          meta: '*',
          sort: "-date_created",
          filter: params,
        }).then((res: any) => {
          console.log('Blogs fetched', res.meta.filter_count);
          this.blogItems = res.data;
          this.blogItemsCount = res.meta.filter_count;
        }).finally(() => {
          this.loading = false;
        });
      },
      viewBlog(id: number) {
        console.log('View blog with ID:', id);
        this.$router.push({ path: `/blogs/${id}` });
      }
    }
  };
</script>