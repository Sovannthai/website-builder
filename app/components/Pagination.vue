<template>
  <div>
    <v-pagination
      class="my-6"
      size="35px"
      v-model="currentPage"
      :length="pageCount"
      rounded="circle"
    />
  </div>
</template>

<script lang="ts">
export default {
  props: {
    items: {
      type: Number,
      required: true,
    },
    itemsPerPage: {
      type: Number,
      default: 8,
    },
    modelValue: {
      type: Number,
      default: 1,
    },
  },
  emits: ["update:modelValue"],
  computed: {
    currentPage: {
      get() {
        return this.modelValue;
      },
      set(value: number) {
        this.$emit("update:modelValue", value);
      },
    },
    pageCount() {
      return Math.ceil(this.items / this.itemsPerPage);
    },
  },
};
</script>
