<script setup>
import { flushToGoogleCalendar } from './integrations/google_calendar';
import { storeTemplate } from './integrations/persistence';
import Snackbar from './components/Snackbar.vue';
import { ref } from 'vue';

const snackbarRef = ref(null);

async function onTemplateCreated(template) {
  await storeTemplate(template);

  const message = "Template salvato: " + template.name;

  snackbarRef.value.show(message);
  console.log(message);
}

async function onSmartEventsConfirmed(smartEvents) {
  await flushToGoogleCalendar(smartEvents)

  const message = 'eventi inviati a Google Calendar: ' + smartEvents.map(evt => evt.label)
  .join(", ")

  snackbarRef.value.show(message);
  console.log(message);
}
</script>

<template>
  <nav class="navbar">
    <RouterLink to="/">Nuovo evento</RouterLink>
    <RouterLink to="/template">Nuovo template</RouterLink>
  </nav>


  <RouterView
    @smart-events-confirmed="onSmartEventsConfirmed"
    @template-created="onTemplateCreated"
  />

  <Snackbar ref="snackbarRef" />
</template>

<style>
.navbar {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  gap: 10px;
  width: 100%;
}
</style>