import { createField } from "vue-wswg-editor";

export default {
  normalText: createField.text({
    label: "Subtitle Text",
    default: "Check out our",
  }),
  showImg: createField.select(
    [
      { label: "No", value: "false", id: "no" },
      { label: "Yes", value: "true", id: "yes" },
    ],
    { label: "Show Image", default: "false" }
  ),
  boldText: createField.text({ label: "Bold Heading Text", default: "" }),
  boldColor: createField.color({ label: "Bold Text Color", default: "#000000" }),
  boldFontSize: createField.text({ label: "Bold Font Size", default: "2rem" }),
  normalBodyText: createField.text({ label: "Normal Heading Text", default: "" }),
  normalColor: createField.color({ label: "Normal Text Color", default: "#555555" }),
  normalFontSize: createField.text({ label: "Normal Font Size", default: "1rem" }),
};
