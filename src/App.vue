<script setup>
import { flushToGoogleCalendar } from './integrations/google_calendar';
import { storeTemplate } from './integrations/persistence';

async function onTemplateCreated(template) {
  await storeTemplate(template);

  console.log("template salvato:")
  console.log(template);
}

async function onSmartEventsConfirmed(smartEvents) {
  await flushToGoogleCalendar(smartEvents)

  console.log('eventi inviati a Google Calendar:')
  console.log(smartEvents)
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