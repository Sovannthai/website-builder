<template>
  <ContactFormComponent :fields="fieldNames" :submit_label="submit_label" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import ContactFormComponent from "~/components/ContactForm.vue";

defineOptions({ label: "Contact Form", emoji: "✉️" });

const props = defineProps<{
  form_fields?: Array<{ name: string }>;
  submit_label: string;
}>();

const fieldNames = computed(() => (props.form_fields ?? []).map((f) => f?.name).filter(Boolean));
</script>
