import { createRouter, createWebHistory } from 'vue-router'
import TemplateForm from '../pages/TemplateForm.vue'
import SchedulerForm from '../pages/SchedulerForm.vue'

const routes = [
    { path: '/', component: SchedulerForm },
    { path: '/template', component: TemplateForm }
]

export default createRouter({
    history: createWebHistory(),
    routes
})