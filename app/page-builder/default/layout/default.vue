<template>
  <v-app class="wswg-layout wswg-layout--default" :style="layoutStyle">
    <slot />
  </v-app>
</template>

<script lang="ts">
// Normal script block: exposes layout-level "Page settings" fields to the
// wswg editor. PageSettings reads `layout.fields` off the component options,
// so these must live on the component itself (not only in <script setup>).
import { createField } from "vue-wswg-editor";

export default {
  label: "Default Layout",
  fields: {
    containerWidth: createField.select(
      [
        { label: "Boxed", value: "boxed", id: "cw-boxed" },
        { label: "Full width", value: "full", id: "cw-full" },
      ],
      { label: "Container width", default: "boxed", group: "Layout" }
    ),
    maxWidth: createField.select(
      [
        { label: "1024px", value: "1024", id: "mw-1024" },
        { label: "1280px", value: "1280", id: "mw-1280" },
        { label: "1440px", value: "1440", id: "mw-1440" },
      ],
      {
        label: "Max content width",
        default: "1280",
        group: "Layout",
        // Only relevant when the container is boxed
        conditions: (data: Record<string, any>) => data.containerWidth !== "full",
      }
    ),
    pagePadding: createField.select(
      [
        { label: "None", value: "none", id: "pp-none" },
        { label: "Small", value: "small", id: "pp-small" },
        { label: "Medium", value: "medium", id: "pp-medium" },
        { label: "Large", value: "large", id: "pp-large" },
      ],
      { label: "Side padding", default: "small", group: "Layout" }
    ),
    footerSpacing: createField.boolean({
      label: "Add spacing above footer",
      default: false,
      group: "Layout",
    }),
  },
};
</script>

<script setup lang="ts">
import { computed } from "vue";

// Page settings are spread onto the layout as props by the (Editor)PageRenderer.
// Defaults here mirror the field defaults above so a page with no saved settings
// still renders correctly.
const props = defineProps<{
  containerWidth?: string;
  maxWidth?: string;
  pagePadding?: string;
  footerSpacing?: boolean;
}>();

const PADDING_MAP: Record<string, string> = {
  none: "0",
  small: "1rem",
  medium: "2rem",
  large: "4rem",
};

const layoutStyle = computed(() => {
  const isFull = props.containerWidth === "full";
  const side = PADDING_MAP[props.pagePadding ?? "small"] ?? "1rem";
  return {
    maxWidth: isFull ? "100%" : `${props.maxWidth ?? "1280"}px`,
    paddingLeft: side,
    paddingRight: side,
    paddingBottom: props.footerSpacing ? "4rem" : "0",
  };
});
</script>

<style scoped>
.wswg-layout--default {
  width: 100%;
  margin: 0 auto;
}
</style>
