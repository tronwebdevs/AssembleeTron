import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store/';

import Student from '@/views/Student/';
import StudentHome from '@/views/Student/Home';
import StudentVerification from '@/views/Student/Verification';
import StudentShowSub from '@/views/Student/ShowSub';
import StudentLabsSelect from '@/views/Student/LabsSelect';

import Admin from '@/views/Admin/';
import AdminLogin from '@/views/Admin/Login';
import AdminDashboard from '@/views/Admin/Dashboard';

import NotFound from '@/views/NotFound';

Vue.use(VueRouter);

const routes = [
    {
        path: '/gestore',
        component: Admin,
        children: [
            {
                name: 'Dashboard',
                path: '',
                component: AdminDashboard,
                meta: {
                    requiresAdminAuth: true
                }
            },
            {
                name: 'Login',
                path: 'login',
                component: AdminLogin
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
                    requiresStdAuth: true
                }
            },
            {
                name: 'Iscrizione',
                path: 'iscrizione',
                component: StudentLabsSelect,
                meta: {
                    requiresStdAuth: true
                }
            },
            {
                name: 'Conferma',
                path: 'conferma',
                component: StudentShowSub,
                meta: {
                    requiresStdAuth: true
                }
            }
        ]
    },
    {
        path: '*',
        component: NotFound
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

router.beforeEach((to, from, next) => {
    if (
        to.matched.some(record => record.meta.requiresStdAuth) &&
        store.getters['student/profile']._id === null
    ) {
        next('/');
    } else if (
        to.matched.some(record => record.meta.requiresAdminAuth) &&
        store.getters['admin/authed'] !== true
    ) {
        console.log(store.getters['admin/authed']);
        next('/gestore/login');
    } else {
        next();
    }
});

export default router;
