import { createField } from "vue-wswg-editor";

export default {
  title: createField.text({
    label: "Section Title",
    default: "Our Gallery",
  }),
  image_items: createField.repeater(
    {
      url: createField.image({ label: "Image" }),
    },
    { label: "Gallery Images", repeaterFieldLabel: "url", default: [] }
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
  // [{ key: "image", … }]. Leave "API field name" blank to read the field of the
  // same name; leave the whole list empty to auto-detect common names.
  apiFields: createField.repeater(
    {
      key: createField.select(
        [
      { label: "Image", value: "image", id: "image" },
        ],
        { label: "Component field", default: "image" }
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
