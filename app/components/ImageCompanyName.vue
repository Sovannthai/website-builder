<template>
  <div class="image__company-name">
    <img :src="`/images/${logo}`" alt="logo" style="width: 60px; height: 50px;" />
    <bold-text :bold="bold" :normal="normal" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    color: {
      type: String,
      default: 'color-white'
    },
    logo: {
      type: String,
      default: 'logo.png'
    }
  },
  data() {
    return {
      bold: { text: 'Company', color: this.color },
      normal: { text: 'Name', color: this.color }
    }
  }
})
</script>
<style scoped lang="scss">
.image__company-name {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
</style>
