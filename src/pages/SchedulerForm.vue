<template>
  <Main title="Nuovo evento">
    <div class="field">
      <label>Titolo</label>
      <input v-model="title" placeholder="es. Skill X" />
    </div>

    <div class="field">
      <label>Template</label>
      <select v-model="selectedTemplateId" @change="onTemplateChange">
        <option disabled value="">Scegli...</option>
        <option v-for="t in templates" :key="t.id" :value="t.id">
          {{ t.name }}
        </option>
      </select>
    </div>

    <div class="field">
      <label>Data</label>
      <input v-model="date" placeholder="es. 18/03/2026" />
    </div>

    <div class="field">
      <label>Ora</label>
      <input v-model="time" placeholder="es. 7.10" />
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
      />
    </div>
  </Main>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import EventPreviewCard from '../components/EventPreviewCard.vue';
import Main from '../components/Main.vue';
import { Template } from '../models/template';
import { db } from '../integrations/persistence';
import { TimeCalculations } from '../utils/time_calculations';

const title = ref('');
const date = ref('');
const time = ref('');
const selectedTemplateId = ref('');
const templates = ref([]);
const previewEvents = ref([]);
const anchorIndex = ref(0);
const selectedTemplate = ref(null);

onMounted(async () => {
  templates.value = await db.templates.toArray();
});

function onTemplateChange() {
  const raw = templates.value.find((t) => t.id === selectedTemplateId.value);
  if (!raw) return;

  selectedTemplate.value = new Template(
    raw.name,
    raw.durationInMinutes,
    raw.before,
    raw.after,
    raw.isBusy
  );

  updatePreview();
}

function updatePreview() {
  if (!selectedTemplate.value || !date.value || !time.value) return;

  const events = selectedTemplate.value.applyTo(
    title.value || selectedTemplate.value.name,
    date.value,
    time.value
  );

  const sorted = TimeCalculations.sortEvents(events);
  previewEvents.value = sorted;
  anchorIndex.value = sorted.findIndex(
    (e) => e.label === (title.value || selectedTemplate.value.name)
  );
}

watch([title, date, time], updatePreview);

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
