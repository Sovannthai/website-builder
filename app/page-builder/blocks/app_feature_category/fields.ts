import { createField } from "vue-wswg-editor";

export default {
  categoriesEndpoint: createField.text({
    label: "Categories API Endpoint",
    default: "/api/categories",
  }),
  featureEndpoint: createField.text({
    label: "Feature API Endpoint",
    default: "/api/features",
  }),
};
