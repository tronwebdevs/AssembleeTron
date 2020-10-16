import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store/';

import Student from '@/views/Student/';
import StudentHome from '@/views/Student/Home';
import StudentVerification from '@/views/Student/Verification';
import StudentShowSub from '@/views/Student/ShowSub';
import StudentLabsSelect from '@/views/Student/LabsSelect';

import Admin from '@/views/Admin/';
import AdminDashboard from '@/views/Admin/Dashboard';

Vue.use(VueRouter);

const routes = [
    {
        path: '/gestore',
        component: Admin,
        children: [
            {
                name: 'Dashboard',
                path: '',
                component: AdminDashboard
            }
        ]
    },
    {
        path: '/',
        component: Student,
        children: [
            {
                name: 'Home',
                path: '',
                component: StudentHome
            },
            {
                name: 'Verifica',
                path: 'verifica',
                component: StudentVerification,
                meta: {
                    requiresAuth: true
                }
            },
            {
                name: 'Iscrizione',
                path: 'iscrizione',
                component: StudentLabsSelect,
                meta: {
                    requiresAuth: true
                }
            },
            {
                name: 'Conferma',
                path: 'conferma',
                component: StudentShowSub,
                meta: {
                    requiresAuth: true
                }
            }
        ]
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (store.getters['student/profile']._id === null) {
            next('/');
        }
    }
    next();
});

export default router;
