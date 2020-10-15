import { SWITCH_THEME } from '../types';

const initialState = {
    theme: 'none'
};

const mutations = {};
mutations[SWITCH_THEME] = state => {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
};

const actions = {};
actions.switchTheme = ({ commit }) => {
    commit(SWITCH_THEME);
};

const getters = {};
getters.isDark = state => state.theme === 'dark';

export default {
    namespaced: true,
    state: initialState,
    mutations,
    actions,
    getters
};
