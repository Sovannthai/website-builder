import { createField } from "vue-wswg-editor";

export default {
  title: createField.text({
    label: "Title",
    default: "Ready to Get Started?",
  }),
  description: createField.textarea({
    label: "Description",
    rows: 3,
    default: "Contact us today to build your next project.",
  }),
  button: createField.object(
    {
      label: createField.text({ label: "Button Label", default: "Contact Us" }),
      path: createField.text({ label: "Button URL", default: "/contact" }),
    },
    { label: "Button" }
  ),
};
