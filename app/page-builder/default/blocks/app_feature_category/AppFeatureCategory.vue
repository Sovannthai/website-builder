<template>
  <AppFeatureCategoryComponent
    :categories-endpoint="categoriesEndpoint"
    :feature-endpoint="featureEndpoint"
  />
</template>

<script setup lang="ts">
import AppFeatureCategoryComponent from '~/components/AppFeatureCategory.vue';

defineOptions({ label: "Feature Category", emoji: "📂" });

defineProps<{
  categoriesEndpoint: string;
  featureEndpoint: string;
}>();
</script>
