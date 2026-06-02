<template>
  <div class="wrapper">
    <div class="field">
      <label>Task List</label>
      <select class="field" v-model="list" @click="load">
        <option v-for="list in lists" :value="list">
          {{ list.title }}
        </option>
      </select>
    </div>

    <div class="field">
      <label>Label</label>
      <input type="text" v-model="label">
    </div>

    <input type="button" value="done" @click="notify">
  </div>
</template>

<script setup>
import { onMounted, ref, toRaw } from 'vue';
import { views } from '../core/main';

const lists = ref([])
const list = ref(null)
const label = ref("")

const load = async () => {
  lists.value = await views.listTaskLists()
}

onMounted(load)

const emit = defineEmits(['task-created'])
function notify() {
  emit('task-created', {
    list: toRaw(list.value),
    label: label.value
  })
  list.value = null
  label.value = ""
}
</script>

<style scoped>
.wrapper {
  border-radius: 5px;
  border: 1px solid whitesmoke;
  padding: 10px 0px;
  border-left: none;
  border-right: none;
}

.field {
  display: grid;
  grid-template-columns: 90px 1fr;
  align-items: center;
  gap: 8px;
}

.field input,
.field select,
.field option {
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
</style>