import { createField } from "vue-wswg-editor";

export default {
  form_fields: createField.repeater(
    {
      name: createField.select(
        [
          { label: "Name", value: "name", id: "name" },
          { label: "Email", value: "email", id: "email" },
          { label: "Message", value: "message", id: "message" },
        ],
        { label: "Field", default: "name" }
      ),
    },
    {
      label: "Form Fields",
      repeaterFieldLabel: "name",
      default: [{ name: "name" }, { name: "email" }, { name: "message" }],
    }
  ),
  submit_label: createField.text({
    label: "Submit Button Label",
    default: "Send Message",
  }),
};
