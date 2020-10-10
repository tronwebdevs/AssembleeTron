import Vue from 'vue';
import Vuex from 'vuex';

import adminModule from './modules/admin';
import studentModule from './modules/student';
import assemblyModule from './modules/assembly';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        admin: adminModule,
        student: studentModule,
        assembly: assemblyModule
    }
});
