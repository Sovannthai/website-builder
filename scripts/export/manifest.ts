/**
 * Block -> component mapping used by the site exporter.
 *
 * Each page-builder block is a thin wrapper that maps its editor fields onto a
 * plain display component in app/components/. This manifest restates that
 * mapping so the exporter can emit direct component usage instead of the
 * wrapper, letting the exported site drop vue-wswg-editor entirely.
 *
 * Keep in sync with app/page-builder/default/blocks/<name>/<Name>.vue — if a
 * wrapper's template changes, the matching entry here changes too.
 */

export interface BlockMapping {
  /** Component file in app/components/ (without .vue). */
  component: string;
  /** Build the props the component receives from the saved block data. */
  props: (block: Record<string, any>) => Record<string, any>;
  /**
   * Self-contained blocks own their markup rather than wrapping a component,
   * so the exporter copies the block file itself instead.
   */
  sourceFile?: string;
}

const passthrough =
  (...keys: string[]) =>
  (block: Record<string, any>) =>
    Object.fromEntries(keys.filter((k) => block[k] !== undefined).map((k) => [k, block[k]]));

/**
 * List blocks can pull their rows from a backend collection instead of the
 * static content saved in the page. Carry those settings into the export so
 * the standalone site stays dynamic.
 */
const API_PROPS = ["apiCollection", "apiLimit", "apiSort", "apiFields"];

/** Carry a block's API data-source settings (only when one is configured). */
const apiProps = (block: Record<string, any>) =>
  block.apiCollection
    ? Object.fromEntries(API_PROPS.filter((k) => block[k]).map((k) => [k, block[k]]))
    : {};

const withApi =
  (...keys: string[]) =>
  (block: Record<string, any>) => ({ ...passthrough(...keys)(block), ...apiProps(block) });

export const BLOCK_MANIFEST: Record<string, BlockMapping> = {
  AppHeader: { component: "AppHeader", props: withApi("menus") },

  Slider: { component: "Slider", props: withApi("slides") },

  Features: { component: "Features", props: withApi("title", "items") },

  BlogPreview: { component: "BlogPreview", props: withApi("title", "posts") },

  Content: {
    component: "Content",
    props: passthrough("title", "description", "image", "image_position"),
  },

  CTA: { component: "CTA", props: passthrough("title", "description", "button") },

  Stats: { component: "Stats", props: withApi("title", "items") },

  Testimonials: { component: "Testimonials", props: withApi("title", "items") },

  Footer: { component: "Footer", props: () => ({}) },

  Navigation: {
    component: "Navigation",
    props: (b) => ({ menus: b.menus, logo: b.logo, fixLayout: b.fixLayout }),
  },

  AppFeatureCategory: {
    component: "AppFeatureCategory",
    props: (b) => ({
      categoriesEndpoint: b.categoriesEndpoint,
      featureEndpoint: b.featureEndpoint,
    }),
  },

  // --- blocks whose wrapper reshapes the data ---

  Gallery: {
    component: "Gallery",
    props: (b) => ({
      title: b.title,
      images: (b.image_items ?? []).map((item: any) => item?.url).filter(Boolean),
      ...apiProps(b),
    }),
  },

  ContactForm: {
    component: "ContactForm",
    props: (b) => ({
      fields: (b.form_fields ?? []).map((f: any) => f?.name).filter(Boolean),
      submit_label: b.submit_label,
    }),
  },

  Banner: {
    component: "Banner",
    props: (b) => ({
      normalText: b.normalText,
      showImg: b.showImg === true || b.showImg === "true",
      image: b.image,
      bold: { text: b.boldText, color: b.boldColor, fontSize: b.boldFontSize },
      normal: { text: b.normalBodyText, color: b.normalColor, fontSize: b.normalFontSize },
    }),
  },

  // --- self-contained: no underlying component to point at ---

  Hero: {
    component: "Hero",
    sourceFile: "app/page-builder/default/blocks/hero/Hero.vue",
    props: passthrough("heading", "description", "bgColor"),
  },
};
