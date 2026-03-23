<template>
  <div class="block-list">
    <button v-if="position === 'before'" class="add-btn" @click="toggleForm">
      +
    </button>

    <div v-if="showForm" class="inline-form">
      <label>Nome</label>
      <input v-model="newName" placeholder="es. Doccia" />
      <label>Durata (min)</label>
      <input v-model.number="newDuration" type="number" />
      <label>Busy:</label>
      <input type="checkbox" v-model="newIsBusy" />
      <span></span>
      <button @click="addBlock">Aggiungi</button>
    </div>

    <BlockCard v-for="(block, index) in blocks" :key="index" :block="block" />

    <button v-if="position === 'after'" class="add-btn" @click="toggleForm">
      +
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BlockCard from './BlockCard.vue';

const props = defineProps({
  blocks: {
    type: Array,
    required: true,
  },
  position: {
    type: String,
    default: 'after',
  },
});

const emit = defineEmits(['add-block']);

const showForm = ref(false);
const newName = ref('');
const newDuration = ref(null);
const newIsBusy = ref(true);

function toggleForm() {
  showForm.value = !showForm.value;
  newName.value = '';
  newDuration.value = null;
  newIsBusy.value = true;
}

function addBlock() {
  if (!newName.value || !newDuration.value) return;

  emit('add-block', {
    name: newName.value,
    isBusy: newIsBusy.value,
    durationInMinutes: newDuration.value,
  });
  toggleForm();
}
</script>

<style scoped>
.block-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 100%;
}
.add-btn {
  width: 32px;
  height: 32px;
  border-radius: 25%;
  border: 1px solid #ccc;
  background: transparent;
  font-size: 1.2em;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.inline-form {
  display: grid;
  grid-template-columns: 80px 1fr;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px;
  border: 1px solid #eee;
  border-radius: 8px;
}
.inline-form input {
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.inline-form button {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  cursor: pointer;
}
</style>
