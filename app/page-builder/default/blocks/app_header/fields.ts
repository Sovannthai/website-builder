import { createField } from "vue-wswg-editor";

export default {
  menus: createField.repeater(
    {
      title: createField.text({ label: "Title", default: "Menu Item" }),
      path: createField.text({ label: "Path", default: "/" }),
    },
    { label: "Menu Items", repeaterFieldLabel: "title", default: [] }
  ),
};
