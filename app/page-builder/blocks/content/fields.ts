import { createField } from "vue-wswg-editor";

export default {
  title: createField.text({
    label: "Title",
    default: "Who We Are",
  }),
  description: createField.textarea({
    label: "Description",
    rows: 5,
    default: "Your content goes here.",
  }),
  image: createField.image({ label: "Image" }),
  image_position: createField.select(
    [
      { label: "Right", value: "right", id: "right" },
      { label: "Left", value: "left", id: "left" },
    ],
    { label: "Image Position", default: "right" }
  ),
};
