import {
    ADMIN_FETCH_PENDING,
    ADMIN_AUTHED,
    ADMIN_LOGOUT,
    SUDOER_AUTHED,
    ADMIN_FETCH_ERROR
} from '../types';
import axios from 'axios';
import Vue from 'vue';

const getDefaultState = () => ({
    authed: false,
    sudoer: false,
    pendings: {},
    token: null
});
const initialState = getDefaultState();

const mutations = {};
mutations[ADMIN_FETCH_PENDING] = (state, payload) => {
    Vue.set(state.pendings, payload, true);
};
mutations[ADMIN_AUTHED] = (state, data) => {
    Vue.set(state, 'authed', true);
    Vue.set(state, 'token', data.token);
    Vue.set(state.pendings, 'auth', false);
};
mutations[ADMIN_FETCH_ERROR] = (state, { message, fetch }) => {
    Vue.set(state.pendings, fetch, false);
    console.error(message);
};
mutations[SUDOER_AUTHED] = (state, data) => {
    Vue.set(state, 'token', data.token);
    Vue.set(state, 'authed', true);
    Vue.set(state, 'sudoer', true);
    Vue.set(state.pendings, 'sudoer_auth', false);
};
mutations[ADMIN_LOGOUT] = state => {
    Object.assign(state, getDefaultState());
    Vue.set(state.pendings, 'loggedout', false);
};

const actions = {};
/**
 * Authenticate user
 * @param {string} password
 * @public
 */
actions.authAdmin = ({ commit }, password) => {
    commit(ADMIN_FETCH_PENDING, 'auth');

    return new Promise((resolve, reject) => {
        axios
            .post('/api/admins/auth', { password })
            .then(({ data }) => {
                if (data.code === 1) {
                    commit(ADMIN_AUTHED, data);
                    resolve(data);
                } else {
                    throw new Error(
                        data.message ||
                            'Errore non riconosciuto (autenticazione)'
                    );
                }
            })
            .catch(err => {
                const { response } = err;
                if (response && response.data && response.data.message) {
                    err.message = response.data.message;
                }
                commit(ADMIN_FETCH_ERROR, {
                    message: err.message,
                    fetch: 'auth'
                });
                reject(err);
            });
    });
};

actions.authSudoer = ({ commit }, password) => {
    commit(ADMIN_FETCH_PENDING, 'sudoer_auth');

    axios
        .post('/api/admins/auth_sudoer', { password })
        .then(({ data }) => {
            if (data.code === 1) {
                commit(SUDOER_AUTHED, data);
            } else {
                throw new Error(
                    data.message || 'Errore non riconosciuto (autenticazione)'
                );
            }
        })
        .catch(err => {
            const { response } = err;
            if (response && response.data && response.data.message) {
                err.message = response.data.message;
            }
            commit(ADMIN_FETCH_ERROR, {
                message: err.message,
                fetch: 'auth'
            });
        });
};

/**
 * Logout
 * @public
 */
actions.logout = ({ commit }) => commit(ADMIN_LOGOUT);

const getters = {};
getters.authed = state => state.authed;
getters.sudoer = state => state.sudoer;
getters.pendings = state => state.pendings;

export default {
    namespaced: true,
    state: initialState,
    mutations,
    actions,
    getters
};
