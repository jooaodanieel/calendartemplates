import { createRouter, createWebHistory } from 'vue-router';
import TemplateForm from '@/createTemplate/pages/TemplateForm.vue';
import TemplateHub from '@/createTemplate/pages/TemplateHub.vue';
import SchedulerForm from '@/scheduleEvent/pages/SchedulerForm.vue';
import Onboarding from "@/onboarding/pages/index.vue"

export const ROOT = 'root';
export const SCHEDULE = 'schedule'
export const NEW_TEMPLATE = 'new template';
export const TEMPLATE_HUB = 'template hub';

const routes = [
  { path: '/', component: Onboarding, name: ROOT },
  { path: '/template', component: TemplateForm, name: NEW_TEMPLATE },
  { path: '/template/hub', component: TemplateHub, name: TEMPLATE_HUB },
  { path: '/schedule', component: SchedulerForm, name: SCHEDULE }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export const isCurrently = function (routeName) {
  return router.currentRoute.value.name === routeName;
};

export default router;
