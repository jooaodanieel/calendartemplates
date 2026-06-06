import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';

import { scaffold as scaffoldCreateTemplate } from "./createTemplate/main"
import { scaffold as scaffoldScheduleEvent } from "./scheduleEvent/main"

import { queues } from "./eventsourcing/broker.js";

createApp(App).use(router).mount('#app');

export const useCases = {}
export const views = {}

export function scaffold(templateStore, brokerStore, previewStore, googleClient) {
  queues.setStore(brokerStore)

  scaffoldCreateTemplate({ templateStore, googleClient })
  scaffoldScheduleEvent({ templateStore, previewStore })
}