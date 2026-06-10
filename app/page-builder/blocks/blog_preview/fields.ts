import { createField } from "vue-wswg-editor";

export default {
  title: createField.text({
    label: "Section Title",
    default: "Latest News",
  }),
  posts: createField.repeater(
    {
      title: createField.text({ label: "Post Title", default: "Post Title" }),
      summary: createField.textarea({ label: "Summary", rows: 2, default: "Post summary." }),
      path: createField.text({ label: "URL Path", default: "/blogs/1" }),
    },
    { label: "Blog Posts", repeaterFieldLabel: "title", default: [] }
  ),
};
