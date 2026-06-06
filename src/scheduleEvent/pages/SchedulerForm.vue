<template>
  <Main title="Nuovo evento">

    <div class="field">
      <label>Template</label>
      <select v-model="selectedTemplate">
        <option disabled value="">Scegli...</option>
        <option v-for="(template, name) in templates" :key="name" :value="template">
          {{ name }}
        </option>
      </select>
    </div>

    <div class="field">
      <label>Data</label>
      <input v-model="inputDate" type="date" />
    </div>

    <div class="field">
      <label>Ora</label>
      <input v-model="inputTime" type="time" />
    </div>

    <div v-if="titleToSet" class="field">
      <label>Titolo</label>
      <input v-model="title" placeholder="es. Skill X" />
    </div>

    <div v-if="previewEvents.length" class="preview-section">
      <div class="preview-header">
        <span>Preview</span>
        <button @click="confirm">Conferma</button>
      </div>

      <EventPreviewCard
        v-for="(event, index) in previewEvents"
        :key="index"
        :event="event"
        :style="{
          backgroundColor:
            selectedTemplate && colorById[Number(selectedTemplate.colorId)],
        }"
      />
    </div>
  </Main>
</template>

<script setup>
import { ref, watch, onMounted, computed, toRaw } from 'vue';
import Main from '../../components/Main.vue';
import { colorById } from '../../integrations/google_calendar.js';
import { calDateTimeFromHtmlInputs, now, toHtmlInputDate } from '../../utils/datetime.js';
import EventPreviewCard from '../components/EventPreviewCard.vue';
import { useCases, views } from '../main.js';

const title = ref('');
const inputDate = ref(toHtmlInputDate(now()));
const inputTime = ref(now().time);
const selectedTemplate = ref(null);
const templates = ref([]);
const previewEvents = ref([]);

const titleToSet = computed(() => {
  if (!selectedTemplate.value) return false

  const dynamicBlock = selectedTemplate.value.blocks
    .find(({ scheduling }) => scheduling.type === "dynamic")

  return dynamicBlock !== undefined
})

const dynamicTitle = computed(() => {
  const emptyTitle = title.value == ""

  return emptyTitle ? selectedTemplate.value.name : title.value
})

const calDateTime = computed(() => calDateTimeFromHtmlInputs(inputDate.value, inputTime.value))

onMounted(async () => {
  templates.value = await views.availableTemplates()
});

async function updatePreview() {
  previewEvents.value = await views.preview(
    dynamicTitle.value,
    calDateTime.value
  )
}

async function calculatePreview() {
  if (selectedTemplate.value === null || inputDate.value == '' || inputTime.value == '')
    return

  useCases.applyTemplateTo({
    template: toRaw(selectedTemplate.value),
    label: dynamicTitle.value,
    calDT: calDateTime.value
  })

  setTimeout(updatePreview, 250)
}

watch([selectedTemplate, inputDate, inputTime, title], calculatePreview)

function confirm() {
  useCases.confirmPreview({
    label: dynamicTitle.value,
    calDateTime: calDateTime.value
  })

  title.value = '';
  inputDate.value = toHtmlInputDate(now());
  inputTime.value = now().time;
  selectedTemplate.value = null;
  previewEvents.value = [];
}
</script>

<style scoped>
.field {
  display: grid;
  grid-template-columns: 90px 1fr;
  align-items: center;
  gap: 8px;
}
.field input,
.field select {
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.preview-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}
.preview-header button {
  padding: 6px 14px;
  border-radius: 6px;
  border: 1px solid #333;
  cursor: pointer;
  font-size: 0.9em;
}
</style>
