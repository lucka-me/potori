import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard.vue')
    },
    {
        path: '/charts',
        name: 'Charts',
        component: () => import(/* webpackChunkName: "charts" */ '@/views/Charts.vue'),
    },
    {
        path: '/list',
        name: 'List',
        component: () => import(/* webpackChunkName: "list" */ '@/views/NominationList.vue'),
    },
    {
        path: '/details',
        name: 'Details',
        component: () => import(/* webpackChunkName: "details" */ '@/views/NominationDetails.vue'),
    },
    {
        path: '/map',
        name: 'Map',
        component: () => import(/* webpackChunkName: "map" */ '@/views/NominationMap.vue'),
    },
    {
      path: '/preferences',
      name: 'Preferences',
      component: () => import(/* webpackChunkName: "preferences" */ '@/views/Preferences.vue')
    },

    {
        path: '/match',
        name: 'Match',
        component: () => import(/* webpackChunkName: "match" */ '@/views/MatchView.vue')
    },
];

const router = createRouter({
    history: createWebHashHistory('/next/'),
    routes: routes,
});

export default router
