<template>
  <v-row>
    <v-col cols="12" md="3" xl="2" sm="12" class="pa-0 my-4"
      :style="{ 'border-bottom': $vuetify.display.smAndDown ? '1px solid #E3E3E3' : 'none' }">
      <v-tabs v-model="tab" :direction="$vuetify.display.smAndDown ? 'horizontal' : 'vertical'"
        :class="$vuetify.display.smAndDown ? 'horizontal' : 'vertical my-10'" color="#8AA73B" class="mr-10">
        <v-tab v-for="(tab, index) in tabs" :key="index" @click="itemsCategory(tab, index)"
          class="text-sm text-none pr-0">
          <p class="truncate-tab">{{ getTabValue(tab) }}</p>
        </v-tab>
        <slot name="tabs"></slot>
      </v-tabs>
    </v-col>
    <v-col cols="12" md="9" xl="10" sm="12">
      <v-card color="transparent" flat :class="{ 'my-10 set-border-left': !$vuetify.display.smAndDown }">
        <div :class="{ 'ml-10': !$vuetify.display.smAndDown }">
          <slot name="content"></slot>
        </div>
      </v-card>
      <slot name="footer"></slot>
    </v-col>
  </v-row>
</template>
<script lang="ts">
import { defineComponent, } from 'vue';
export default defineComponent({
  name: 'TabVertical',
  props: {
    tabs: {
      type: Array as () => Array<any>,
      required: true,
      default: () => [] as any[]
    },
    keyAccess: {
      type: String,
      required: false,
      default: 'title'
    }
  },
  data() {
    return {
      tab: 0 as number | null,
      lastTab: 0 as number | null
    };
  },
  watch: {
    tabs: {
      handler(newTabs) {
        if (newTabs && newTabs.length > 0) {
          this.$emit('update:tab', newTabs[0]);
        }
      },
      immediate: true,
      deep: true
    },
    tab(newTab: any) {
      this.lastTab = newTab;
    }
  },
  mounted() { },
  methods: {
    itemsCategory(item: any, index: number) {
      if (this.lastTab === index) return;
      this.lastTab = index;
      this.$emit('update:tab', item);
    },
    getTabValue(tab: any) {
      console.log('Get tab value', tab, this.keyAccess);
      return tab[this.keyAccess];
    }
  },
});
</script>
<style scoped>
.set-border-left {
  border-left: 1px solid #E3E3E3;
}

.tab-vertical-wrapper {
  width: 100%;
  height: 100%;
  min-height: 50vh;
}

.tab-window-full-width {
  flex: 1;
  width: 100%;
}

:deep(.vertical .v-tab.v-tab--selected .v-tab__slider) {
  width: 4px !important;
  height: 70%;
  /* align-self: center !important; */
  margin: auto;
  border-radius: 5px !important;
}

:deep(.horizontal .v-tab.v-tab--selected .v-tab__slider) {
  height: 4px !important;
  margin: 0 auto;
  border-radius: 5px !important;
}

:deep(.horizontal .v-btn--size-default) {
  padding: 0 10px !important;
}

.set-margin {
  margin-bottom: 130px !important;
}

.truncate-tab {
  min-width: 0px !important;
  max-width: 250px !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: normal !important;
  text-align: left !important;
  display: -webkit-box !important;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
