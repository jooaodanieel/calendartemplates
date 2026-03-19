import { createRouter, createWebHistory } from 'vue-router';
import TemplateForm from '../pages/TemplateForm.vue';
import SchedulerForm from '../pages/SchedulerForm.vue';
import TemplateHub from '../pages/TemplateHub.vue';

const routes = [
  { path: '/', component: SchedulerForm },
  { path: '/template', component: TemplateForm },
  { path: '/template/hub', component: TemplateHub },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
