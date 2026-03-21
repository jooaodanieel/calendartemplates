<script setup>
import { onMounted, ref } from 'vue';
import Navbar from './components/Navbar.vue';
import Snackbar from './components/Snackbar.vue';
import { flushToGoogleCalendar } from './integrations/google_calendar';
import { TemplateDAO } from './integrations/persistence';
import { initGoogleAuth } from './integrations/google_calendar';
import router, { NEW_TEMPLATE } from './router';

const snackbarRef = ref(null);

onMounted(() => {
  const script = document.querySelector('script[src*="accounts.google.com"]');

  if (window.google) {
    initGoogleAuth();
  } else {
    script.addEventListener('load', initGoogleAuth);
  }

  conductToNewTemplate();
});

async function conductToNewTemplate() {
  const isEmpty = await TemplateDAO.isEmpty();

  if (isEmpty) {
    router.replace({ name: NEW_TEMPLATE });
    snackbarRef.value.show('Ancora non hai template, creane uno');
  }
}

async function onTemplateCreated(template) {
  await TemplateDAO.create(template);

  const message = 'Template salvato: ' + template.name;

  snackbarRef.value.show(message);
}

async function onSmartEventsConfirmed(smartEvents) {
  await flushToGoogleCalendar(smartEvents);

  const message =
    'eventi inviati a Google Calendar: ' +
    smartEvents.map((evt) => evt.label).join(', ');

  snackbarRef.value.show(message);
}

async function onTemplateImported(template) {
  await TemplateDAO.create(template);

  const message = 'Template caricato: ' + template.name;

  snackbarRef.value.show(message);
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
