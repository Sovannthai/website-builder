<template>
  <div class="editor-wrapper">
    <!-- Toolbar -->
    <div class="editor-toolbar">
      <span class="editor-toolbar__page">Editing: <strong>{{ pageName }}</strong></span>
      <div class="editor-toolbar__actions">
        <span v-if="saveStatus" class="editor-toolbar__status" :class="saveStatus">{{ saveMessage }}</span>
        <button class="editor-toolbar__btn" @click="savePage" :disabled="saving">
          {{ saving ? 'Saving…' : 'Save Page' }}
        </button>
        <a class="editor-toolbar__btn editor-toolbar__btn--preview" :href="`/pb/${pageName}`" target="_blank">
          Preview ↗
        </a>
      </div>
    </div>
      <WswgPageBuilder
        v-if="registryReady"
        v-model="pageData"
        blocks-key="blocks"
        settings-key="settings"
        theme="default"
        :url="`/editor`"
        :editable="true"
        default-block-margin="small"
        style="--editor-height: calc(100vh - 48px); height: calc(100vh - 48px); width: 100%;"
      />
      <div v-else class="editor-loading">
        <p>Loading editor blocks…</p>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { WswgPageBuilder, initialiseRegistry } from "vue-wswg-editor";

definePageMeta({ layout: false });

const route = useRoute();
console.log("Route paramsss:", route.query);
const pageName = computed(() => String(route.query.page || "index"));

const registryReady = ref(false);
const saving = ref(false);
const saveStatus = ref<"success" | "error" | "">("");
const saveMessage = ref("");

const pageData = ref<Record<string, any>>({
  blocks: [],
  settings: { layout: "default" },
});

onMounted(async () => {
  // Load existing saved data for this page if available
  try {
    const existing = await $fetch<Record<string, any>>(`/pb-${pageName.value}-schema.json`);
    if (existing?.blocks) {
      pageData.value = existing;
    }
  } catch {
    // No saved data yet — start fresh
  }

  await initialiseRegistry();
  registryReady.value = true;
});

async function savePage() {
  saving.value = true;
  saveStatus.value = "";
  try {
    await $fetch("/api/save-page", {
      method: "POST",
      body: { page: pageName.value, data: pageData.value },
    });
    saveStatus.value = "success";
    saveMessage.value = "Saved!";
  } catch {
    saveStatus.value = "error";
    saveMessage.value = "Save failed";
  } finally {
    saving.value = false;
    setTimeout(() => { saveStatus.value = ""; saveMessage.value = ""; }, 3000);
  }
}
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}
.editor-wrapper {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
:deep(.wswg-page-builder-body) {
  height: 100vh !important;
}
.editor-toolbar {
  height: 48px;
  min-height: 48px;
  background: #1e1e2e;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  gap: 1rem;
  z-index: 100;
}
.editor-toolbar__page {
  font-size: 0.85rem;
  color: #aaa;
}
.editor-toolbar__actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.editor-toolbar__status {
  font-size: 0.8rem;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
}
.editor-toolbar__status.success { background: #166534; color: #bbf7d0; }
.editor-toolbar__status.error   { background: #7f1d1d; color: #fecaca; }
.editor-toolbar__btn {
  padding: 0.35rem 0.9rem;
  font-size: 0.82rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  background: #2563eb;
  color: white;
  font-weight: 600;
  text-decoration: none;
}
.editor-toolbar__btn:disabled { opacity: 0.6; cursor: not-allowed; }
.editor-toolbar__btn--preview { background: #374151; }
.editor-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  font-family: sans-serif;
  color: #666;
  font-size: 1rem;
}
</style>
