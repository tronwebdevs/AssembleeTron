import Vue from 'vue';
import VueRouter from 'vue-router';

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
        name: 'Admin',
        component: Admin,
        children: [
            {
                path: '',
                component: AdminDashboard
            }
        ]
    },
    {
        path: '/',
        name: 'Student',
        component: Student,
        children: [
            {
                path: '',
                component: StudentHome
            },
            {
                path: 'verifica',
                component: StudentVerification
            },
            {
                path: 'iscrizione',
                component: StudentLabsSelect
            },
            {
                path: 'conferma',
                component: StudentShowSub
            }
        ]
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

// router.beforeEach((to, from, next) => {
//     console.log(to);
//     console.log(from);
//     console.log(next);
// });

export default router;
