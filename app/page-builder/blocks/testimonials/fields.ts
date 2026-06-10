import { createField } from "vue-wswg-editor";

export default {
  title: createField.text({
    label: "Section Title",
    default: "What Our Clients Say",
  }),
  items: createField.repeater(
    {
      name: createField.text({ label: "Name", default: "John Doe" }),
      role: createField.text({ label: "Role / Title", default: "CEO" }),
      avatar: createField.image({ label: "Avatar" }),
      message: createField.textarea({ label: "Message", rows: 3, default: "Great service!" }),
    },
    { label: "Testimonials", repeaterFieldLabel: "name", default: [] }
  ),
};
