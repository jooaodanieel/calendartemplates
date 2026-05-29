<template>
  <Main title="Nuovo evento">
    <div class="field">
      <label>Titolo</label>
      <input v-model="title" placeholder="es. Skill X" />
    </div>

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
      <input v-model="date" type="date" />
    </div>

    <div class="field">
      <label>Ora</label>
      <input v-model="time" type="time" />
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
        :isAnchor="index === anchorIndex"
        :style="{
          backgroundColor:
            selectedTemplate && colorById[Number(selectedTemplate.colorId)],
        }"
      />
    </div>
  </Main>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import EventPreviewCard from '../components/EventPreviewCard.vue';
import Main from '../components/Main.vue';
import { colorById } from '../integrations/google_calendar';
import { useCases, views } from '../core/main';

const title = ref('');
const date = ref('');
const time = ref('');
const selectedTemplate = ref(null);
const templates = ref([]);
const previewEvents = ref([]);
const anchorIndex = ref(0);

const formattedDate = computed(() => {
  const [year, month, day] = date.value.split('-');
  return `${day}/${month}/${year}`;
});

const formattedTime = computed(() => {
  const [hours, minutes] = time.value.split(':');
  return `${'' + Number(hours)}.${minutes}`;
});

onMounted(async () => {
  templates.value = await views.availableTemplates()
});

async function updatePreview() {
  previewEvents.value = await views.preview(
    title.value || selectedTemplate.value.name,
    formattedDate.value,
    formattedTime.value
  )

  if (previewEvents.value.length == 0) return

  anchorIndex.value = previewEvents.value.findIndex(
    (e) => e.label === (title.value || selectedTemplate.value.name)
  );
}

async function calculatePreview() {
  if (!selectedTemplate.value || !date.value || !time.value) return;

  useCases.applyTemplateTo({
    template: selectedTemplate.value,
    label: title.value || selectedTemplate.value.name,
    day: formattedDate.value,
    time: formattedTime.value
  })

  setTimeout(updatePreview, 250)
}

watch([selectedTemplate, date, time], calculatePreview)

const SMART_EVENTS_CONFIRMED_EVENT = 'smart-events-confirmed';
const emit = defineEmits([SMART_EVENTS_CONFIRMED_EVENT]);
function confirm() {
  emit(SMART_EVENTS_CONFIRMED_EVENT, previewEvents.value);
  title.value = '';
  date.value = '';
  time.value = '';
  selectedTemplateId.value = '';
  previewEvents.value = [];
  anchorIndex.value = 0;
  selectedTemplate.value = null;
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
