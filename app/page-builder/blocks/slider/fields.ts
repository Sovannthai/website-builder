import { createField } from "vue-wswg-editor";

export default {
  slides: createField.repeater(
    {
      image: createField.image({ label: "Slide Image" }),
      title: createField.text({ label: "Title", default: "Slide Title" }),
      description: createField.textarea({
        label: "Description",
        rows: 3,
        default: "Slide description",
      }),
    },
    { label: "Slides", repeaterFieldLabel: "title", default: [] }
  ),
};
