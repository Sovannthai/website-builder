import { createField } from "vue-wswg-editor";

export default {
  title: createField.text({
    label: "Section Title",
    default: "Our Gallery",
  }),
  image_items: createField.repeater(
    {
      url: createField.image({ label: "Image" }),
    },
    { label: "Gallery Images", repeaterFieldLabel: "url", default: [] }
  ),
};
