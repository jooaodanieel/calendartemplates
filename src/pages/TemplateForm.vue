<template>
  <Main title="Nuovo template">
    <div class="field">
      <label>Nome</label>
      <input v-model="name" placeholder="es. Corso palestra" />
    </div>

    <div class="field">
      <label>Durata (in min)</label>
      <input v-model.number="duration" type="number" />
    </div>

    <div class="field">
      <label>Mark as <strong>busy</strong></label>
      <input type="checkbox" v-model="isBusy">
    </div>

    <div class="section">
      <BlockList
        :blocks="beforeBlocks"
        position="before"
        @add-block="addBefore"
      />

      <div class="anchor-card">
        <span>{{ name || 'Nome template' }}</span>
        <span class="duration">({{ duration || 0 }} min)</span>
      </div>

      <BlockList :blocks="afterBlocks" @add-block="addAfter" />
    </div>

    <button class="create-btn" @click="create">Crea</button>
  </Main>
</template>

<script setup>
import { ref } from 'vue';
import BlockList from '../components/BlockList.vue';
import Main from '../components/Main.vue';
import { Template } from '../models/template';

const name = ref('');
const duration = ref(null);
const isBusy = ref(true);
const beforeBlocks = ref([]);
const afterBlocks = ref([]);

const TEMPLATE_CREATED_EVENT = 'template-created';
const emit = defineEmits([TEMPLATE_CREATED_EVENT]);

function addBefore(block) {
  beforeBlocks.value.unshift(block);
}

function addAfter(block) {
  afterBlocks.value.push(block);
}

function create() {
  if (!name.value || !duration.value) return;

  let builder = Template.builder()
    .for(name.value)
    .withDurationMinutes(duration.value)
    .markAsBusy(isBusy.value);

  for (const block of beforeBlocks.value) {
    builder = builder.precededBy(
      Template.builder()
        .for(block.name)
        .withDurationMinutes(block.durationInMinutes)
    );
  }

  for (const block of afterBlocks.value) {
    builder = builder.followedBy(
      Template.builder()
        .for(block.name)
        .withDurationMinutes(block.durationInMinutes)
    );
  }

  emit(TEMPLATE_CREATED_EVENT, builder.build());
  name.value = '';
  duration.value = null;
  beforeBlocks.value = [];
  afterBlocks.value = [];
}
</script>

<style scoped>
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
  background-color: var(--accent-bg);
  color: var(--accent);
}
.create-btn {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #333;
  cursor: pointer;
  font-size: 1em;
}
</style>
