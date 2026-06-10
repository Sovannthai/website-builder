import { createField } from "vue-wswg-editor";

export default {
  heading: createField.text({
    label: "Heading",
    required: true,
    default: "Welcome",
  }),
  description: createField.textarea({
    label: "Description",
    rows: 4,
    default: "Add your description here.",
  }),
  bgColor: createField.color({
    label: "Background Color",
    default: "#ffffff",
  }),
};
