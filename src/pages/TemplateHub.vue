<template>
  <div class="template-hub">

    <section class="hub-section">
      <h3>Esporta</h3>
      <div class="field">
        <label>Template</label>
        <select v-model="selectedExportId" @change="onExportSelect">
          <option disabled value="">Scegli...</option>
          <option v-for="t in templates" :key="t.id" :value="t.id">
            {{ t.name }}
          </option>
        </select>
      </div>

      <div v-if="exportJson" class="preview-wrapper">
          <div class="button-header">
              <button class="copy-button" @click="copyToClipboard">copy</button>
          </div>
          <pre class="json-preview">{{ exportJson }}</pre>
      </div>
    </section>

    <section class="hub-section">
      <h3>Importa</h3>
      <textarea v-model="importJson" placeholder="Incolla il JSON qui..." />
      <button @click="load">Carica</button>
    </section>

  </div>

  <Snackbar ref="snackbarRef" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../integrations/persistence'
import Snackbar from '../components/Snackbar.vue'

const templates = ref([])
const selectedExportId = ref('')
const exportJson = ref('')
const importJson = ref('')

const snackbarRef = ref('')

const emit = defineEmits(['template-imported'])

onMounted(async () => {
  templates.value = await db.templates.toArray()
})

function copyToClipboard() {
  navigator.clipboard.writeText(exportJson.value);
  snackbarRef.value.show("JSON coppiato nell'area di trasferimento");
}

function onExportSelect() {
  const raw = templates.value.find(t => t.id === selectedExportId.value)
  if (!raw) return
  const { id, ...withoutId } = raw
  exportJson.value = JSON.stringify(withoutId, null, 2)
}

function load() {
  if (!importJson.value) return
  try {
    const parsed = JSON.parse(importJson.value)
    emit('template-imported', parsed)
    importJson.value = ''
  } catch {
    emit('import-error')
  }
}
</script>

<style scoped>
.preview-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: stretch;

  border: 1px solid #ccc;
  border-radius: 8px;
}

.button-header {
  background-color: #444;
  border-radius: 8px;
  min-height: 2em;
  padding: 5px;
  display: inline-flex;
  flex-direction: row-reverse;
}

.copy-button {
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 5px;
  height: 2em;
  background-color: #212121;
}

.template-hub {
  max-width: 400px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.hub-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.field {
  display: grid;
  grid-template-columns: 90px 1fr;
  align-items: center;
  gap: 8px;
}
.field select {
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.json-preview {
  margin-top: -5px;
  margin-bottom: -5px;
  background: #f5f5f5;
  border-radius: 8px;
  padding: 12px;
  font-size: 0.8em;
  overflow-x: auto;
  white-space: pre-wrap;
  text-align: left;

  max-height: 20em;
  overflow-y: scroll;
}
textarea {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  min-height: 120px;
  resize: vertical;
  font-size: 0.9em;
}
button {
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid #333;
  cursor: pointer;
  align-self: flex-start;
}
</style>