<template>
  <Main title="Template Hub">
    <section class="hub-section">
      <h3>Esporta</h3>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Blocks</th>
              <th>Tasks</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="template of templates">
              <td>{{ template.name }}</td>

              <td>
                <TemplateBlocksCell :blocks="template.blocks" />
              </td>

              <td>
                <TemplateTasksCell :tasks="template.tasks" />
              </td>

              <td class="action-buttons-cell">
                <button
                  class="copy-button"
                  @click="copyRowToClipboard(template)"
                >
                  coppia
                </button>

                <button class="copy-button green" @click="deleteRow(template)">
                  cancella
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
import { ref, onMounted } from 'vue';
import Snackbar from '@/components/Snackbar.vue';
import Main from '@/components/Main.vue'
import TemplateBlocksCell from '../components/TemplateBlocksCell.vue';
import TemplateTasksCell from '../components/TemplateTasksCell.vue';
import { useCases, views } from '../main.js';

const templates = ref([]);
const importJson = ref('');

const snackbarRef = ref('');

onMounted(async () => {
  templates.value = await views.exportableTemplates()
});

function copyRowToClipboard(template) {
  navigator.clipboard.writeText(JSON.stringify(template));
  snackbarRef.value.show("JSON coppiato nell'area di trasferimento");
}

async function deleteRow(template) {
  await useCases.deleteTemplate(template)
  templates.value = await views.exportableTemplates()

  snackbarRef.value.show('Template cancellato');
}

async function load() {
  if (!importJson.value) return;

  await useCases.importTemplate(importJson.value)
  templates.value = await views.exportableTemplates()
  importJson.value = '';
}
</script>

<style scoped>
.table-wrapper {
  overflow-x: scroll;
  width: 100%;
}

table td, table th {
  border: 1px solid white;
  padding: 3px 10px;
}

table * {
  font-size: 0.85em;
  line-height: 1.5em;
}

td {
  min-width: 150px;
}

.copy-button {
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 5px 7px;
  margin: 5px;
  min-height: 2em;
  background-color: var(--accent);
  color: #424242;
  font-weight: 700;
}

.green {
  background-color: rgb(60, 249, 127);
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
