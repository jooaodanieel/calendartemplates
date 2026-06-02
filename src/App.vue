<script setup>
import { onMounted, ref } from 'vue';
import Navbar from './components/Navbar.vue';
import Snackbar from './components/Snackbar.vue';
import { flushToGoogleCalendar, flushToGoogleTasks } from './integrations/google_calendar';
import { templateStore, brokerStore, previewStore } from './integrations/persistence';
import { initGoogleAuth } from './integrations/google_calendar';
import router, { NEW_TEMPLATE } from './router';
import { scaffold } from "./core/main"
import { reactTo } from './core/eventsourcing/broker';

const snackbarRef = ref(null);

onMounted(() => {
  scaffold(templateStore, brokerStore, previewStore)

  reactTo("TEMPLATE_CREATED")
    .with(
      ({ payload: { name } }) => {
        const message = 'Template salvato: ' + name;
        snackbarRef.value.show(message);
      }
  )

  reactTo("TEMPLATE_CREATION_FAILED")
    .with(
      ({ payload: { error } }) => {
        const message = `Template Creation error: ${error}`
        snackbarRef.value.show(message)
      }
    )

  reactTo("TEMPLATE_DELETION_FAILED")
    .with(({ payload: { error }}) => {
      const message = `Template Deletion error: ${error}`
      snackbarRef.value.show(message)
    })

  reactTo("TEMPLATE_IMPORTING_FAILED")
    .with(({ payload: { error } }) => {
      const message = `Template Importing error: ${error}`
      snackbarRef.value.show(message)
    })

  reactTo("PREVIEW_CONFIRMED")
    .with(async ({ payload }) => {
      await flushToGoogleCalendar(payload.events)
      await flushToGoogleTasks(payload.tasks)
      const message =
        'eventi inviati a Google Calendar: ' +
        payload.events.map((evt) => evt.summary).join(', ');

      snackbarRef.value.show(message);
    })

  const script = document.querySelector('script[src*="accounts.google.com"]');

  if (window.google) {
    initGoogleAuth();
  } else {
    script.addEventListener('load', initGoogleAuth);
  }

  conductToNewTemplate();
});

async function conductToNewTemplate() {
  const isEmpty = await templateStore.isEmpty()

  if (isEmpty) {
    router.replace({ name: NEW_TEMPLATE });
    snackbarRef.value.show('Ancora non hai template, creane uno');
  }
}
</script>

<template>
  <Navbar />

  <RouterView />

  <Snackbar ref="snackbarRef" />
</template>
