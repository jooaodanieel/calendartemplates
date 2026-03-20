<template>
  <Main title="Template Hub">
    <section class="hub-section">
      <h3>Esporta</h3>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th v-for="attr in attrs">{{ attr }}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="template of templates">
              <td v-for="attr in attrs">
                {{ template.displayString(attr) }}
              </td>
              <td>
                <button
                  class="copy-button"
                  @click="copyRowToClipboard(template)"
                >
                  copy
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="hub-section">
      <h3>Importa</h3>
      <textarea v-model="importJson" placeholder="Incolla il JSON qui..." />
      <button class="load" @click="load">Carica</button>
    </section>
  </Main>

  <Snackbar ref="snackbarRef" />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Template } from '../models/template';
import Snackbar from '../components/Snackbar.vue';
import Main from '../components/Main.vue';
import { allTemplates } from '../integrations/persistence';

const templates = ref([]);
const attrs = computed(() => Object.keys(new Template()));
const importJson = ref('');

const snackbarRef = ref('');

const emit = defineEmits(['template-imported']);

onMounted(async () => {
  templates.value = await allTemplates();
});

function copyRowToClipboard(template) {
  const { id, ...withoutId } = template;
  navigator.clipboard.writeText(JSON.stringify(withoutId));
  snackbarRef.value.show("JSON coppiato nell'area di trasferimento");
}

function load() {
  if (!importJson.value) return;
  try {
    const parsed = JSON.parse(importJson.value);
    emit('template-imported', parsed);
    importJson.value = '';
  } catch {
    emit('import-error');
  }
}
</script>

<style scoped>
.table-wrapper {
  overflow-x: scroll;
  width: 100%;
}

table * {
  border: 1px solid white;
  padding: 3px 10px;
  font-size: 0.85em;
}

td {
  min-width: 150px;
}

.copy-button {
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 5px 7px;
  min-height: 2em;
  background-color: var(--accent);
  color: #424242;
  font-weight: 700;
}

.hub-section {
  display: flex;
  flex-direction: column;
}

textarea {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  min-height: 120px;
  width: inherit;
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

button.load {
  margin-top: 10px;
  align-self: center;
}
</style>
