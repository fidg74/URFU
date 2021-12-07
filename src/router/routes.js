import ProjectList from '@/pages/ProjectList.vue';
import Passport from '@/pages/passport.vue';
import PassportEdit from '@/pages/passport-edit.vue';
import PassportHistory from '@/pages/PassportHistory.vue';
import TeamProject from '@/pages/Implementation.vue';
import NewRequest from '@/pages/NewRequest.vue';
import Request from '@/pages/Request.vue';
import Settings from '@/pages/Settings.vue';
import Curators from '@/pages/Curators.vue';
import Results from '@/pages/Results.vue';
import MainLearning from '@/pages/main.vue';
import MainPractice from '@/pages/main-practice.vue';

import UI from '@/pages/UI.vue';

const routes = [
    {
        path: '/',
        // redirect: '/requests',
        component: MainLearning,
    }, {
        path: '/requests',
        alias: '/projects',
        component: ProjectList,
    }, {
        path: '/implementations',
        component: ProjectList,
    }, {
        path: '/passport/:id',
        component: Passport,
    }, {
        path: '/passport/:id/edit',
        component: PassportEdit,
    }, {
        path: '/passport/:id/history',
        component: PassportHistory,
    }, {
        path: '/passport/:id/implementation',
        component: TeamProject,
    }, {
        path: '/requests/:id',
        component: Request,
    }, {
        path: '/results/:id',
        component: Results,
    }, {
        path: '/new_request/:id?',
        component: NewRequest,
    }, {
        path: '/ui',
        component: UI,
    }, {
        path: '/settings',
        component: Settings,
    }, {
        path: '/curators',
        component: Curators,
    }, {
        path: '/main-practice',
        component: MainPractice,
    },
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
    routes.push({
        path: '*',
        redirect: '/',
    });
}

export default routes;
