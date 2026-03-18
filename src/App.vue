<script setup>
import { flushToGoogleCalendar } from './integrations/google_calendar';
import { storeTemplate } from './integrations/persistence';
import Snackbar from './components/Snackbar.vue';
import { onMounted, ref } from 'vue';
import { initGoogleAuth, isSignedIn, userInfo, signIn } from './integrations/google_calendar';

const snackbarRef = ref(null);

onMounted(() => {
    const script = document.querySelector('script[src*="accounts.google.com"]')
    script.addEventListener('load', () => initGoogleAuth())
    if (window.google) initGoogleAuth()
})

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

async function onTemplateImported(template) {
  await storeTemplate(template)

  const message = "Template caricato: " + template.name;
  
  snackbarRef.value.show(message)
  console.log(message)
}

function onTemplateImportError() {
  const message = "Template NON caricato, JSON mal formattato";
  
  snackbarRef.value.show(message)
  console.log(message)
}
</script>

<template>
  <nav class="navbar">
    <RouterLink to="/">Nuovo evento</RouterLink>
    <RouterLink to="/template">Nuovo template</RouterLink>
    <RouterLink to="/template/hub">Template Hub</RouterLink>

    <button v-if="!isSignedIn()" @click="signIn()" class="profile-badge">Accedi con Google</button>
    <div v-else-if="userInfo" class="profile-badge">
      <img :src="userInfo.picture" :alt="userInfo.name" class="profile-pic">
      <span>{{ userInfo.name }}</span>
    </div>
  </nav>


  <RouterView
    @smart-events-confirmed="onSmartEventsConfirmed"
    @template-created="onTemplateCreated"
    @template-imported="onTemplateImported"
    @import-error="onTemplateImportError"
  />

  <Snackbar ref="snackbarRef" />
</template>

<style>
.navbar {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.profile-badge {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid var(--border);
  background-color: var(--bg);
  color: var(--text-h);
  font-size: 14px;
  font-family: var(--sans);
  cursor: pointer;
  transition: box-shadow 0.2s;
}

.profile-badge:hover {
  box-shadow: var(--shadow);
}

button.profile-badge::before {
  content: '';
  display: inline-block;
  width: 18px;
  height: 18px;
  background-image: url('https://www.google.com/favicon.ico');
  background-size: contain;
  background-repeat: no-repeat;
}

.profile-pic {
  width: 18px;
  height: 18px;
  border-radius: 50%;
}
</style>