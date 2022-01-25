import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes
})

const routes = [
    {
        path: '/login',
        name: 'Logn'
    }
]



export default router ;