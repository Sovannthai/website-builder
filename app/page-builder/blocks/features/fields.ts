import { createField } from "vue-wswg-editor";

export default {
  title: createField.text({
    label: "Section Title",
    default: "Our Services",
  }),
  items: createField.repeater(
    {
      image: createField.image({ label: "Icon / Image" }),
      title: createField.text({ label: "Feature Title", default: "Feature" }),
      description: createField.textarea({
        label: "Description",
        rows: 2,
        default: "Feature description",
      }),
    },
    { label: "Feature Items", repeaterFieldLabel: "title", default: [] }
  ),
};
