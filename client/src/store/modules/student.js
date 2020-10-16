import {
    STUDENT_SUBS,
    STUDENT_IS_PART,
    STUDENT_NOT_PART,
    STUDENT_SUBED,
    STUDENT_FETCH_PENDING,
    STUDENT_LABS_FETCHED,
    STUDENT_FETCH_ERROR,
    STUDENT_LOGOUT,
    UPDATE_STUDENT_TOKEN
} from '../types.js';
import axios from 'axios';

const getDefaultState = () => ({
    profile: {
        _id: null,
        studentId: null,
        name: null,
        surname: null,
        section: null
    },
    verified: false,
    sunscribed: false,
    labs: null,
    labs_available: [],
    pendings: {},
    token: null
});
const initialState = getDefaultState();

const mutations = {};
mutations[UPDATE_STUDENT_TOKEN] = (state, token) => {
    if (token) {
        state.token = token;
    }
};
mutations[STUDENT_FETCH_PENDING] = (state, payload) => {
    state.pendings[payload] = true;
};
mutations[STUDENT_FETCH_ERROR] = (state, { fetch, message }) => {
    state.pendings[fetch] = false;
    console.error(message);
};
mutations[STUDENT_LABS_FETCHED] = (state, labs) => {
    state.pendings.labs_available = false;
    state.labs_available = labs;
};
mutations[STUDENT_SUBS] = (state, { student, labs }) => {
    state.pendings.profile = false;
    state.profile = student;
    state.subscribed = true;
    state.labs_available = labs;
};
mutations[STUDENT_IS_PART] = (state, { student, labs }) => {
    state.pendings.profile = false;
    state.profile = student;
    state.subscribed = true;
    state.labs = labs;
};
mutations[STUDENT_NOT_PART] = (state, { student }) => {
    state.profile = student;
    state.labs = [];
    state.subscribed = false;
    state.pendings.profile = false;
};
mutations[STUDENT_SUBED] = (state, labs) => {
    state.subscribe = false;
    state.labs = labs;
    state.labs_available = getDefaultState().labs_available;
};
mutations[STUDENT_LOGOUT] = state => {
    Object.assign(state, getDefaultState());
};

const actions = {};
/**
 * Authenticate student
 * @param {number} studentID
 * @param {number} part
 * @public
 */
actions.authStudent = ({ commit }, { studentID, part, remember }) => {
    commit(STUDENT_FETCH_PENDING, 'profile');

    return new Promise((resolve, reject) => {
        // Security check
        if (isNaN(studentID)) {
            let error = new Error('Identificativo studente errato');
            error.target = 'studentID';
            throw error;
        }
        if (isNaN(part) || (part !== 0 && part !== 1)) {
            let error = new Error('Parametro di partecipazione errato');
            error.target = 'part';
            throw error;
        }

        if (typeof remember !== 'boolean') {
            let error = new Error('Parametro non valido');
            error.target = 'remeberMe';
            throw error;
        }

        axios
            .get(`/api/students/${studentID}`, {
                params: { part, remember }
            })
            .then(({ data }) => {
                switch (data.code) {
                    case -1:
                        throw new Error(data.message);
                    case 1:
                        commit(STUDENT_SUBS, data);
                        break;
                    case 2:
                        commit(STUDENT_NOT_PART, data);
                        break;
                    case 3:
                        commit(STUDENT_NOT_PART, data);
                        break;
                    case 4:
                        commit(STUDENT_IS_PART, data);
                        break;
                    default:
                        throw new Error('Errore non riconosciuto (student)');
                }
                commit(UPDATE_STUDENT_TOKEN, data.token);
                resolve(data.code);
            })
            .catch(err => {
                if (err.response && err.response.data) {
                    const { data } = err.response;
                    if (data.message) {
                        err.message = data.message;
                    }
                    if (data.target && data.target !== 0) {
                        err.target = data.target;
                    }
                    err.token = data.token;
                }
                commit(STUDENT_FETCH_ERROR, {
                    message: err.message,
                    fetch: 'profile'
                });
                commit(UPDATE_STUDENT_TOKEN, err.token);
                reject(err);
            });
    });
};

/**
 * Fetch avabile laboratories for a specific class
 * @public
 */
actions.fetchAvabileLabs = ({ commit, state }) => {
    commit(STUDENT_FETCH_PENDING, 'labs_avabile');

    const { profile, token } = state;

    return new Promise((resolve, reject) => {
        axios
            .get('/api/students/labs', {
                params: { section: profile.section },
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(({ data, headers }) => {
                if (data.code === 1) {
                    commit(STUDENT_LABS_FETCHED, data);
                    commit(UPDATE_STUDENT_TOKEN, headers.token);
                    resolve();
                } else {
                    throw new Error(
                        data.message ||
                            'Errore non riconosciuto (laboratori disponibili)'
                    );
                }
            })
            .catch(err => {
                if (err.response) {
                    if (err.response.status === 401) {
                        commit(STUDENT_LOGOUT);
                        reject(err);
                    }
                    if (err.response.data && err.response.data.message) {
                        const { data } = err.response;
                        err.message = data.message;
                        err.token = err.response.headers.token;
                    }
                }
                commit(STUDENT_FETCH_ERROR, {
                    message: err.message,
                    fetch: 'labs_avabile'
                });
                commit(UPDATE_STUDENT_TOKEN, err.token);
                reject(err);
            });
    });
};

/**
 * Submit student labs
 * @param {number} studentID
 * @param {array} labs
 * @public
 */
actions.subscribeLabs = ({ commit, state }, { studentID, labs }) => {
    commit(STUDENT_FETCH_PENDING, 'subscribe');

    return new Promise((resolve, reject) => {
        axios
            .post(
                `/api/students/${studentID}/labs`,
                { labs },
                {
                    headers: { Authorization: `Bearer ${state.token}` }
                }
            )
            .then(({ data, headers }) => {
                if (data.code === 1) {
                    commit(STUDENT_SUBED, data);
                    commit(UPDATE_STUDENT_TOKEN, headers.token);
                    resolve();
                } else {
                    let error;
                    error = new Error(
                        data.message || 'Errore non riconosciuto (student)'
                    );
                    if (data.target !== undefined) {
                        error.target = data.target;
                    }
                    throw error;
                }
            })
            .catch(err => {
                if (err.response && err.response.data) {
                    const { data } = err.response;
                    if (data.message) {
                        err.message = data.message;
                    }
                    if (data.target !== undefined) {
                        err.target = data.target;
                    }
                    err.token = err.response.headers.token;
                }
                commit(STUDENT_FETCH_ERROR, {
                    message: err.message,
                    fetch: 'subscribe'
                });
                commit(UPDATE_STUDENT_TOKEN, err.token);
                reject(err);
            });
    });
};

/**
 * Logout
 * @public
 */
actions.logout = ({ commit }) => commit(STUDENT_LOGOUT);

const getters = {};
getters.profile = state => state.profile;
getters.verified = state => state.verified;
getters.sunscribed = state => state.sunscribed;
getters.labs = state => state.labs;
getters.labs_available = state => state.labs_available;
getters.pendings = state => state.pendings;

export default {
    namespaced: true,
    state: initialState,
    mutations,
    actions,
    getters
};
