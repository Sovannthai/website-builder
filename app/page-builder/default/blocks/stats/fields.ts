import { createField } from "vue-wswg-editor";

export default {
  title: createField.text({
    label: "Section Title",
    default: "Our Numbers",
  }),
  items: createField.repeater(
    {
      value: createField.text({ label: "Value", default: "100" }),
      suffix: createField.text({ label: "Suffix", default: "+" }),
      label: createField.text({ label: "Label", default: "Projects" }),
      description: createField.textarea({ label: "Description", rows: 2, default: "" }),
      icon: createField.text({ label: "MDI Icon (e.g. mdi-chart-line)", default: "mdi-chart-line" }),
    },
    { label: "Stat Items", repeaterFieldLabel: "label", default: [] }
  ),
};
