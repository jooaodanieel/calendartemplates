<script setup>
import { flushToGoogleCalendar } from './integrations/google_calendar';
import { storeTemplate } from './integrations/persistence';
import Snackbar from './components/Snackbar.vue';
import { onMounted, ref } from 'vue';
import { initGoogleAuth } from './integrations/google_calendar';
import Navbar from './components/Navbar.vue';

const snackbarRef = ref(null);

onMounted(() => {
  const script = document.querySelector('script[src*="accounts.google.com"]');

  if (window.google) {
    initGoogleAuth();
  } else {
    script.addEventListener('load', initGoogleAuth);
  }
});

async function onTemplateCreated(template) {
  await storeTemplate(template);

  const message = 'Template salvato: ' + template.name;

  snackbarRef.value.show(message);
  console.log(message);
}

async function onSmartEventsConfirmed(smartEvents) {
  await flushToGoogleCalendar(smartEvents);

  const message =
    'eventi inviati a Google Calendar: ' +
    smartEvents.map((evt) => evt.label).join(', ');

  snackbarRef.value.show(message);
  console.log(message);
}

async function onTemplateImported(template) {
  await storeTemplate(template);

  const message = 'Template caricato: ' + template.name;

  snackbarRef.value.show(message);
  console.log(message);
}

function onTemplateImportError() {
  const message = 'Template NON caricato, JSON mal formattato';

  snackbarRef.value.show(message);
  console.log(message);
}
</script>

<template>
  <Navbar />

  <RouterView
    @smart-events-confirmed="onSmartEventsConfirmed"
    @template-created="onTemplateCreated"
    @template-imported="onTemplateImported"
    @import-error="onTemplateImportError"
  />

  <Snackbar ref="snackbarRef" />
</template>
