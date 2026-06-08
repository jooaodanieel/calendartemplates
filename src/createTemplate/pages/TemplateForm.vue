<template>
  <Main title="Nuovo template">
    <InputField label="nome">
      <input v-model="name" placeholder="es. Corso palestra" />
    </InputField>

    <InputField label="Colore">
      <ColorPicker :colors="googleEventColors" v-model="color" />
    </InputField>

    <TemplateBlockForm
      :references="blockRefs"
      @block-created="addBlock"
    />

    <TemplateTaskForm
      @task-created="addTask"
    />

    <div class="view-panel">
      <div>
        <h3>Event Templates</h3>
        <div v-for="block in blocks" class="card">
          <p>{{ block.title }} <span v-if="block.isBusy">(busy)</span></p>
          
          <p v-if="block.scheduling.type === 'fixed'">
            {{ block.scheduling.start.time }} - {{ block.scheduling.end.time }}
          </p>

          <p v-if="block.scheduling.type === 'calculated'">
            {{ block.scheduling.duration }} min {{ block.scheduling.diffRef }} {{ block.scheduling.reference }}
          </p>

          <p v-if="block.scheduling.type === 'dynamic'">
            a dynamic {{ block.scheduling.duration }}-min block
          </p>
        </div>
      </div>
      
      <div>
        <h3>Task Templates</h3>
        <div v-for="task in tasks" class="card">
          <p>{{ task.label }} [{{ task.list.title }}]</p>
        </div>
      </div>
    </div>
    
    <button class="create-btn" @click="create">Crea</button>
  </Main>
</template>

<script setup>
import { computed, ref, toRaw } from 'vue';

import Main from '@/components/Main.vue';
import InputField from '@/components/InputField.vue';
import { googleEventColors } from '@/integrations/google_calendar.js';

import ColorPicker from '../components/ColorPicker.vue';
import TemplateBlockForm from '../components/TemplateBlockForm.vue';
import TemplateTaskForm from '../components/TemplateTaskForm.vue';

import { useCases } from '../main.js';

const name = ref('');
const color = ref(null);
const blocks = ref([])
const tasks = ref([])

const blockRefs = computed(() => blocks.value.map(b => b.title))

function addBlock(block) {
  blocks.value.push({ ...block })
}

function addTask(task) {
  tasks.value.push({ ...task })
}

function create() {
  if (!name.value) return;

  const template = {
    name: name.value,
    colorId: color.value.id,
    blocks: toRaw(blocks.value),
    tasks: toRaw(tasks.value)
  }

  useCases.createTemplate(template)
  name.value = '';
  color.value = null
  blocks.value = []
  tasks.value = []
}
</script>

<style scoped>
.view-panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px;
}

.card {
  border: 1px solid whitesmoke;
  border-radius: 10px;
  padding: 10px 2px;
  margin: 5px 0px;
}

.color-picker {
  min-width: 10px;
  min-height: 10px;
  border-radius: 50%;
}

.field {
  display: grid;
  grid-template-columns: 120px 1fr;
  align-items: center;
  gap: 8px;
}
.field input {
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.anchor-card {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  border: 2px solid #333;
  border-radius: 8px;
  font-weight: 500;
  color: #333;
}
.create-btn {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #333;
  cursor: pointer;
  font-size: 1em;
}
</style>
