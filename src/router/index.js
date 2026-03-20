import { createRouter, createWebHistory } from 'vue-router';
import TemplateForm from '../pages/TemplateForm.vue';
import SchedulerForm from '../pages/SchedulerForm.vue';
import TemplateHub from '../pages/TemplateHub.vue';

export const ROOT = 'root';
export const NEW_TEMPLATE = 'new template';
export const TEMPLATE_HUB = 'template hub';

const routes = [
  { path: '/', component: SchedulerForm, name: ROOT },
  { path: '/template', component: TemplateForm, name: NEW_TEMPLATE },
  { path: '/template/hub', component: TemplateHub, name: TEMPLATE_HUB },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export const isCurrently = function (routeName) {
  return router.currentRoute.value.name === routeName;
};

export default router;
