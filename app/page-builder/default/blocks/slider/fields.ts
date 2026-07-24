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

  // --- Dynamic data -------------------------------------------------------
  // Leave the collection blank to use the static items above; set it to a
  // backend collection key (e.g. "news") to pull rows live at runtime.
  apiCollection: createField.text({
    label: "API endpoint",
    description:
      'Collection key ("news"), path ("/api/news") or full URL ' +
      '("https://api.site.com/news"). Blank uses the static content above.',
    default: "",
  }),
  apiLimit: createField.text({
    label: "Max rows",
    default: "6",
    conditions: (data) => !!data.apiCollection,
  }),
  apiSort: createField.text({
    label: "Sort",
    description: "e.g. -date_created",
    default: "",
    conditions: (data) => !!data.apiCollection,
  }),
  // Tells the component which API field fills each part, e.g.
  // [{ key: "title", … }, { key: "description", … }]. Leave "API field name" blank to read the field of the
  // same name; leave the whole list empty to auto-detect common names.
  apiFields: createField.repeater(
    {
      key: createField.select(
        [
      { label: "Title", value: "title", id: "title" },
      { label: "Description", value: "description", id: "description" },
      { label: "Image", value: "image", id: "image" },
        ],
        { label: "Component field", default: "title" }
      ),
      value: createField.text({
        label: "API field name",
        description: "e.g. headline_text — blank reads the same name",
        default: "",
      }),
    },
    { label: "API field mapping", repeaterFieldLabel: "key", default: [] }
  ),
};
