import { createField } from "vue-wswg-editor";

export default {
  logo: createField.image({ label: "Logo" }),
  fixLayout: createField.select(
    [
      { label: "Fixed (Sticky)", value: "true", id: "fixed" },
      { label: "Normal", value: "false", id: "normal" },
    ],
    { label: "Layout Mode", default: "true" }
  ),
  menus: createField.repeater(
    {
      title: createField.text({ label: "Title", default: "Menu Item" }),
      path: createField.text({ label: "Path", default: "/" }),
      icon: createField.text({ label: "Icon Class (remix icon)", default: "" }),
    },
    { label: "Menu Items", repeaterFieldLabel: "title", default: [] }
  ),
};
