import { createRouter, createWebHistory } from 'vue-router'
import MapView from '../views/MapView.vue'
import LoginView from '../views/LoginView.vue'
import SigninView from '../views/SigninView.vue'
import ProfileView from "@/views/profileView.vue";
import ManageOperator from "@/views/admin/ManageOperator.vue";
import AddOperator from "@/views/admin/AddOperator.vue";
import AdminDashboard from "@/views/admin/AdminDashboard.vue";
import OperatorView from "@/views/OperatorView.vue";
import StatsView from "@/views/StatsView.vue";
import AddDevice from "@/views/admin/AddDevice.vue";
import ManageDevice from "@/views/admin/ManageDevice.vue";

const routes = [
    {
        path: '/',
        redirect: '/map'
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
    },
    {
       path: '/profilo',
       name: 'profile',
       component: ProfileView
    },
    {
        path: '/stats',
        name: 'stats',
        component: StatsView
    },
    {
        path:'/admin',
        component: AdminDashboard,
        //meta:{requiresAdmin: true},
        children:[
            {
                path:'manage-operator',
                name:'manageOperator',
                component: ManageOperator
            },
            {
                path:'add-operator',
                name:'add-operator',
                component: AddOperator
            },
            {
                path: 'add-device',
                name:'add-device',
                component: AddDevice
            },
            {
                path:'manage-device',
                name:'manage-device',
                component: ManageDevice
            },
            {
                path:'',
                redirect:'/admin/manage-operator'
            }
        ]
    },
    {
        path: '/parking',
        name: 'OperatorView',
        component: OperatorView,
    },

]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router