import { createRouter, createWebHistory } from 'vue-router'
import MapView from '../views/MapView.vue'
import LoginView from '../views/LoginView.vue'
import SigninView from '../views/SigninView.vue'

const routes = [
    {
        path: '/',
        redirect: '/map'  // Reindirizza la root alla mappa
    },
    {
        path: '/map',
        name: 'map',
        component: MapView
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView
    },
    {
        path: '/signin',
        name: 'signin',
        component: SigninView
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router