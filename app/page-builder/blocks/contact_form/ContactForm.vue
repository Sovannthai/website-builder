<template>
  <section class="cf-block">
    <div class="cf-card">
      <form class="cf-form" @submit.prevent>
        <div class="cf-row">
          <div v-if="form_fields.some(f => f.name === 'name')" class="cf-field">
            <label>Name</label>
            <input type="text" placeholder="Your name" />
          </div>
          <div v-if="form_fields.some(f => f.name === 'email')" class="cf-field">
            <label>Email</label>
            <input type="email" placeholder="Your email" />
          </div>
        </div>
        <div v-if="form_fields.some(f => f.name === 'message')" class="cf-field cf-field--full">
          <label>Message</label>
          <textarea rows="4" placeholder="Your message"></textarea>
        </div>
        <div class="cf-actions">
          <button type="submit">{{ submit_label }}</button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  form_fields: Array<{ name: string }>;
  submit_label: string;
}>();
</script>

<style scoped>
.cf-block {
  padding: 4rem 2rem;
  max-width: 860px;
  margin: 0 auto;
}
.cf-card {
  background: #fff;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
}
.cf-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.cf-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
.cf-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.cf-field--full {
  grid-column: 1 / -1;
}
.cf-field label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #444;
}
.cf-field input,
.cf-field textarea {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0.6rem 0.9rem;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
}
.cf-field input:focus,
.cf-field textarea:focus {
  border-color: #2563eb;
}
.cf-actions {
  display: flex;
  justify-content: flex-end;
}
.cf-actions button {
  padding: 0.6rem 1.6rem;
  background: #111;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
}
</style>
