<template>
  <nav class="navbar">
    <span v-if="!isCurrently(ROOT)">
      <RouterLink :to="{ name: ROOT }">Nuovo evento</RouterLink>
    </span>
    <span v-if="!isCurrently(NEW_TEMPLATE)">
      <RouterLink :to="{ name: NEW_TEMPLATE }">Nuovo template</RouterLink>
    </span>
    <span v-if="!isCurrently(TEMPLATE_HUB)">
      <RouterLink :to="{ name: TEMPLATE_HUB }">Template Hub</RouterLink>
    </span>

    <button v-if="!accessToken" @click="signIn()" class="profile-badge">
      Accedi con Google
    </button>
    <div v-else-if="userInfo" class="profile-badge">
      <img :src="userInfo.picture" :alt="userInfo.name" class="profile-pic" />
      <span>{{ userInfo.name }}</span>
    </div>
  </nav>
</template>

<script setup>
import { NEW_TEMPLATE, ROOT, TEMPLATE_HUB, isCurrently } from '../router';
import { accessToken, userInfo } from '../integrations/google_calendar';
</script>

<style scoped>
.navbar {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 5px 0px;
  border-bottom: 1px solid rgba(249, 249, 249, 0.15);
  box-shadow: 0px 5px rgba(249, 249, 249, 0.15);
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
