import { createField } from "vue-wswg-editor";

export default {
  menus: createField.repeater(
    {
      title: createField.text({ label: "Title", default: "Menu Item" }),
      path: createField.text({ label: "Path", default: "/" }),
    },
    { label: "Menu Items", repeaterFieldLabel: "title", default: [] }
  ),

  // --- Dynamic data -------------------------------------------------------
  // Leave blank to use the menu above (or the site's shared menu); set a
  // collection key to build the nav from the backend instead.
  apiCollection: createField.text({
    label: "API endpoint",
    description:
      'Collection key ("navigation"), path ("/api/nav") or full URL. ' +
      'Blank uses the menu above.',
    default: "",
  }),
  apiLimit: createField.text({
    label: "Max items",
    default: "20",
    conditions: (data) => !!data.apiCollection,
  }),
  apiSort: createField.text({
    label: "Sort",
    description: "e.g. sort",
    default: "",
    conditions: (data) => !!data.apiCollection,
  }),
  // Tells the component which API field fills each part, e.g.
  // [{ key: "title", … }, { key: "path", … }]. Leave "API field name" blank to read the field of the
  // same name; leave the whole list empty to auto-detect common names.
  apiFields: createField.repeater(
    {
      key: createField.select(
        [
      { label: "Label", value: "title", id: "title" },
      { label: "Link", value: "path", id: "path" },
      { label: "Sub-items", value: "children", id: "children" },
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
