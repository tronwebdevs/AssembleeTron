import {
    ASSEMBLY_FETCH_PENDING,
    ASSEMBLY_FETCHED,
    ASSEMBLY_FETCH_ERROR,
    ASSEMBLY_LOAD_COMPLETED,
    ASSEMBLY_DELETED,
    ASSEMBLY_SUBS_CLOSE,
    ASSEMBLY_SUBS_OPEN,
    ASSEMBLY_NOT_AVABILE,
    ASSEMBLY_INFO_UPDATED,
    STUDENTS_FETCHED,
    ASSEMBLY_PDF_COMPLETED,
    ADMIN_LOGOUT,
    UPDATE_ADMIN_TOKEN,
    ASSEMBLY_LABS_MUTATION,
    CLEAR_ASSEMBLY_MESSAGE,
    DISPLAY_ASSEMBLY_MESSAGE
} from '../types.js';
import axios from 'axios';
import FileSaver from 'file-saver';
import Vue from 'vue';

const getDefaultState = () => ({
    exists: false,
    info: {},
    labs: [],
    stats: {
        labs: 0,
        students: 0,
        subs: 0
    },
    students: [],
    message: {
        show: false,
        type: 'danger',
        content: ''
    },
    pendings: {}
});
const initialState = getDefaultState();

const setDisplayMessage = (state, { content, type, show }) => {
    Vue.set(state, 'message', {
        type,
        content,
        show
    });

    if (show) {
        setTimeout(() => setDisplayMessage(state, { show: false }), 3000);
    }
};

const mutations = {};
mutations[ASSEMBLY_FETCH_PENDING] = (state, payload) => {
    Vue.set(state.pendings, payload, true);
};
mutations[ASSEMBLY_FETCH_ERROR] = (state, { fetch, message }) => {
    Vue.set(state.pendings, fetch, false);
    setDisplayMessage(state, {
        type: 'danger',
        content: message,
        show: true
    });
};
mutations[ASSEMBLY_LOAD_COMPLETED] = (state, { info, labs, stats }) => {
    state.exists = true;
    state.info = info;
    state.labs = labs;
    state.stats = {
        ...stats,
        labs: (labs || []).length
    };
    Vue.set(state.pendings, 'load', false);
};
mutations[ASSEMBLY_FETCHED] = (state, payload) => {
    if (payload.exists) {
        Vue.set(state, 'exists', payload.exists);
    }
    if (payload.info) {
        Vue.set(state, 'info', payload.info);
    } else {
        Vue.set(state, 'info', {});
    }
    if (!isNaN(payload.labs)) {
        Vue.set(state.stats, 'labs', payload.labs);
    }
    if (!isNaN(payload.students)) {
        Vue.set(state.stats, 'students', payload.students);
    }
    if (!isNaN(payload.subs)) {
        Vue.set(state.stats, 'subs', payload.subs);
    }
    Vue.set(state.pendings, 'assembly', false);
};
mutations[ASSEMBLY_DELETED] = state => {
    state.exists = false;
    state.info.deleted = true;
    state.stats = {
        ...getDefaultState().stats,
        students: state.stats.students
    };
    state.pendings = {
        ...state.pendings,
        assembly: false,
        labs: false,
        delete_assembly: false
    };
};
mutations[ASSEMBLY_SUBS_CLOSE] = (state, payload) => {
    state.exists = true;
    state.info = payload;
    Vue.set(state.pendings, 'info', false);
};
mutations[ASSEMBLY_SUBS_OPEN] = mutations[ASSEMBLY_SUBS_CLOSE];
mutations[ASSEMBLY_NOT_AVABILE] = (state, message) => {
    Vue.set(state, 'exists', false);
    setDisplayMessage(state, {
        type: 'danger',
        content: message,
        show: true
    });
    Vue.set(state.pendings, 'info', false);
};
mutations[ASSEMBLY_INFO_UPDATED] = (state, payload) => {
    setDisplayMessage(state, {
        type: 'success',
        content: 'Informazioni aggiornate con successo',
        show: true
    });
    Vue.set(state, 'exists', true);
    Vue.set(state, 'info', payload);
    Vue.set(state.pendings, 'create_info', false);
};
mutations[ASSEMBLY_LABS_MUTATION] = (state, { labs, fetch }) => {
    Vue.set(state, 'labs', labs);
    Vue.set(state.stats, 'labs', labs.length);
    Vue.set(state.pendings, fetch, false);
};
mutations[STUDENTS_FETCHED] = (state, payload) => {
    Vue.set(state.stats, 'students', payload.length);
    Vue.set(state, 'students', payload);
    Vue.set(state.pendings, 'students', false);
};
mutations[ASSEMBLY_PDF_COMPLETED] = state => {
    Vue.set(state.pendings, 'generate_pdf', false);
    setDisplayMessage(state, {
        type: 'success',
        content: 'PDF genertato con successo',
        show: true
    });
};
mutations[CLEAR_ASSEMBLY_MESSAGE] = state => {
    Vue.set(state, 'message', getDefaultState().message);
};
mutations[DISPLAY_ASSEMBLY_MESSAGE] = (state, { content, type }) => {
    setDisplayMessage(state, {
        type,
        content,
        show: true
    });
};

const actions = {};
/**
 * Handle requests errors
 * @param {object} err
 * @param {function} dispatch
 * @param {object} param2
 * @private
 */
const handleError = (err, commit, fetch) => {
    const { response } = err;
    if (response) {
        const { data, headers, status } = response;
        if (data && data.message) {
            err.message = data.message;
            if (status === 401) {
                commit('admin/' + ADMIN_LOGOUT, null, { root: true });
            } else {
                commit('admin/' + UPDATE_ADMIN_TOKEN, headers.token, {
                    root: true
                });
            }
        }
    }
    commit(ASSEMBLY_FETCH_ERROR, {
        message: err.message || 'Errore sconosciuto',
        fetch
    });
};

/**
 * Fetch assembly info
 * @public
 */
actions.fetchAssemblyInfo = ({ commit }) => {
    commit(ASSEMBLY_FETCH_PENDING, 'info');

    return new Promise((resolve, reject) => {
        axios
            .get('/api/assembly/info')
            .then(({ data }) => {
                switch (data.code) {
                    case 0:
                        commit(ASSEMBLY_NOT_AVABILE, data.message);
                        reject(new Error(data.message));
                        break;
                    case 1:
                    case 3:
                        commit(ASSEMBLY_SUBS_CLOSE, data.info);
                        reject(new Error(data.message));
                        break;
                    case 2:
                        commit(ASSEMBLY_SUBS_OPEN, data.info);
                        resolve();
                        break;
                    default:
                        throw new Error(data.message || 'Errore inaspettato');
                }
            })
            .catch(err => {
                const { response } = err;
                if (response && response.data && response.data.message) {
                    err.message = response.data.message;
                }
                commit(ASSEMBLY_FETCH_ERROR, {
                    message: err.message || 'Errore sconosciuto',
                    fetch: 'info'
                });
                reject(err);
            });
    });
};

/**
 * Create assembly info
 * @param {object} info
 * @public
 */
actions.createAssemblyInfo = ({ commit, rootState }, info) => {
    commit(ASSEMBLY_FETCH_PENDING, 'create_info');

    const authToken = rootState.admin.token;

    return new Promise((resolve, reject) => {
        axios
            .post(
                '/api/assembly/info',
                { info },
                {
                    headers: { Authorization: `Bearer ${authToken}` }
                }
            )
            .then(({ data, headers }) => {
                if (data.code === 1) {
                    commit(ASSEMBLY_INFO_UPDATED, data.info);
                    commit('admin/' + UPDATE_ADMIN_TOKEN, headers.token, {
                        root: true
                    });
                    resolve();
                } else {
                    throw new Error(data.message || 'Errore inaspettato');
                }
            })
            .catch(err => {
                handleError(err, commit, 'create_info');
                reject(err);
            });
    });
};

/**
 * Update assembly info
 * @param {object} info
 * @public
 */
actions.updateAssemblyInfo = ({ commit, rootState }, info) => {
    commit(ASSEMBLY_FETCH_PENDING, 'update_info');

    const authToken = rootState.admin.token;

    return new Promise((resolve, reject) => {
        axios
            .put(
                '/api/assembly/info',
                { info },
                {
                    headers: { Authorization: `Bearer ${authToken}` }
                }
            )
            .then(({ data, headers }) => {
                if (data.code === 1) {
                    commit(ASSEMBLY_INFO_UPDATED, data.info);
                    commit('admin/' + UPDATE_ADMIN_TOKEN, headers.token, {
                        root: true
                    });
                    resolve('Informazioni aggiornate con successo');
                } else {
                    throw new Error(data.message || 'Errore inaspettato');
                }
            })
            .catch(err => {
                handleError(err, commit, 'update_info');
                reject(err);
            });
    });
};

/**
 * Request a backup of the assembly
 * @public
 */
actions.requestBackup = ({ commit, rootState }) => {
    commit(ASSEMBLY_FETCH_PENDING, 'backup');

    const authToken = rootState.admin.token;

    return new Promise((resolve, reject) => {
        axios
            .post(
                '/api/assembly/backups',
                {},
                {
                    headers: { Authorization: `Bearer ${authToken}` }
                }
            )
            .then(({ data, headers }) => {
                if (data.code === 1) {
                    commit(ASSEMBLY_FETCH_ERROR, null);
                    commit('admin/' + UPDATE_ADMIN_TOKEN, headers.token, {
                        root: true
                    });
                    resolve(data.message);
                } else {
                    throw new Error(data.message || 'Errore inaspettato');
                }
            })
            .catch(err => {
                handleError(err, commit, 'backup');
                reject(err);
            });
    });
};

/**
 * Load assembly from backup
 * @param {string} fileName
 */
actions.loadAssembly = ({ commit, rootState }, fileName) => {
    commit(ASSEMBLY_FETCH_PENDING, 'load');

    const authToken = rootState.admin.token;

    return new Promise((resolve, reject) => {
        axios
            .post(
                '/api/assembly/backups/load',
                { fileName },
                {
                    headers: { Authorization: `Bearer ${authToken}` }
                }
            )
            .then(({ data, headers }) => {
                if (data.code === 1) {
                    commit(ASSEMBLY_LOAD_COMPLETED, data.assembly);
                    commit('admin/' + UPDATE_ADMIN_TOKEN, headers.token, {
                        root: true
                    });
                    resolve();
                } else {
                    throw new Error(data.message || 'Errore inaspettato');
                }
            })
            .catch(err => {
                handleError(err, commit, 'load');
                reject(err);
            });
    });
};

/**
 * Create new lab
 * @param {object} lab
 * @public
 */
actions.createAssemblyLab = ({ commit, rootState }, lab) => {
    commit(ASSEMBLY_FETCH_PENDING, 'create_lab');

    const { assembly, admin } = rootState;
    const authToken = admin.token;
    const { labs } = assembly;

    return new Promise((resolve, reject) => {
        axios
            .post(
                '/api/assembly/labs',
                { lab },
                {
                    headers: { Authorization: `Bearer ${authToken}` }
                }
            )
            .then(({ data, headers }) => {
                if (data.code === 1) {
                    commit(ASSEMBLY_LABS_MUTATION, {
                        labs: [...labs, data.lab],
                        fetch: 'create_lab'
                    });
                    commit('admin/' + UPDATE_ADMIN_TOKEN, headers.token, {
                        root: true
                    });
                    resolve(data.lab);
                } else {
                    let error = new Error(data.message || 'Errore inaspettato');
                    error.from = data.from || '';
                    throw error;
                }
            })
            .catch(err => {
                handleError(err, commit, 'create_lab');
                reject(err);
            });
    });
};

/**
 * Update assembly lab
 * @param {object} lab
 * @public
 */
actions.updateAssemblyLab = ({ commit, rootState }, lab) => {
    commit(ASSEMBLY_FETCH_PENDING, 'update_lab');

    const { assembly, admin } = rootState;
    const authToken = admin.token;
    const { labs } = assembly;

    return new Promise((resolve, reject) => {
        axios
            .put(
                '/api/assembly/labs',
                { lab },
                {
                    headers: { Authorization: `Bearer ${authToken}` }
                }
            )
            .then(({ data, headers }) => {
                if (data.code === 1) {
                    let newLabs = labs.map(lab => {
                        if (lab._id === data.lab._id) {
                            return data.lab;
                        }
                        return lab;
                    });
                    commit(ASSEMBLY_LABS_MUTATION, {
                        labs: newLabs,
                        fetch: 'update_lab'
                    });
                    commit('admin/' + UPDATE_ADMIN_TOKEN, headers.token, {
                        root: true
                    });
                    resolve(data.lab);
                } else {
                    throw new Error(data.message || 'Errore inaspettato');
                }
            })
            .catch(err => {
                handleError(err, commit, 'update_lab');
                reject(err);
            });
    });
};

/**
 * Delete assembly lab
 * @param {number} labID
 * @public
 */
actions.deleteAssemblyLab = ({ commit, rootState }, labID) => {
    commit(ASSEMBLY_FETCH_PENDING, 'delete_lab');

    const { assembly, admin } = rootState;
    const authToken = admin.token;
    const { labs } = assembly;

    return new Promise((resolve, reject) => {
        axios
            .delete('/api/assembly/labs', {
                data: { _id: labID },
                headers: { Authorization: `Bearer ${authToken}` }
            })
            .then(({ data, headers }) => {
                if (data.code === 1) {
                    let newLabs = labs.filter(lab => lab._id !== data.lab._id);
                    commit(ASSEMBLY_LABS_MUTATION, {
                        labs: newLabs,
                        fetch: 'delete_lab'
                    });
                    commit('admin/' + UPDATE_ADMIN_TOKEN, headers.token, {
                        root: true
                    });
                    resolve(data.lab.title);
                } else {
                    let error = new Error(data.message || 'Errore inaspettato');
                    error.from = data.from || '';
                    throw error;
                }
            })
            .catch(err => {
                handleError(err, commit, 'delete_lab');
                reject(err);
            });
    });
};

/**
 * Exclude classes from all labs
 * @public
 * @param {int} h
 * @param {array} sections
 */
actions.excludeClassesFromLabs = ({ commit, rootState }, { h, sections }) => {
    commit(ASSEMBLY_FETCH_PENDING, 'labs');

    const authToken = rootState.admin.token;

    return new Promise((resolve, reject) =>
        axios
            .post(
                '/api/assembly/labs/exclude',
                {
                    h,
                    sections
                },
                {
                    headers: { Authorization: `Bearer ${authToken}` }
                }
            )
            .then(({ data, headers }) => {
                if (data.code === 1) {
                    commit(ASSEMBLY_LABS_MUTATION, {
                        labs: data.labs,
                        fetch: 'labs'
                    });
                    commit('admin/' + UPDATE_ADMIN_TOKEN, headers.token, {
                        root: true
                    });
                    resolve();
                } else {
                    throw new Error(data.message || 'Errore inaspettato');
                }
            })
            .catch(err => {
                handleError(err, commit, 'labs');
                reject(err);
            })
    );
};

/**
 * Fetch assembly general info (info, number of students/subsciber/laboratories)
 * @public
 */
actions.fetchAssemblyGeneral = ({ commit, rootState }) => {
    commit(ASSEMBLY_FETCH_PENDING, 'assembly');

    const authToken = rootState.admin.token;

    return new Promise((resolve, reject) => {
        axios
            .get('/api/assembly/', {
                headers: { Authorization: `Bearer ${authToken}` }
            })
            .then(({ data, headers }) => {
                switch (data.code) {
                    case 0:
                    case 1:
                        commit(ASSEMBLY_FETCHED, {
                            ...data,
                            exists: data.code === 0 ? false : true
                        });
                        commit('admin/' + UPDATE_ADMIN_TOKEN, headers.token, {
                            root: true
                        });
                        resolve();
                        break;
                    default:
                        throw new Error(data.message || 'Errore inaspettato');
                }
            })
            .catch(err => {
                const { response } = err;
                let pending = false;
                if (response) {
                    const { data, headers, status } = response;
                    err.status = status;
                    if (data && data.message) {
                        err.message = data.message;
                        if (status === 401) {
                            pending = undefined;
                            commit('admin/' + ADMIN_LOGOUT, null, {
                                root: true
                            });
                        } else {
                            commit(
                                'admin/' + UPDATE_ADMIN_TOKEN,
                                headers.token,
                                { root: true }
                            );
                        }
                    }
                }
                commit(ASSEMBLY_FETCH_ERROR, {
                    message: err.message || 'Errore sconosciuto',
                    fetch: 'assembly',
                    pending
                });
                reject(err);
            });
    });
};

/**
 * Fetch all assembly labs
 * @public
 */
actions.fetchAllLabs = ({ commit, rootState }) => {
    commit(ASSEMBLY_FETCH_PENDING, 'labs');

    const authToken = rootState.admin.token;

    axios
        .get('/api/assembly/labs', {
            params: { action: 'getAll' },
            headers: { Authorization: `Bearer ${authToken}` }
        })
        .then(({ data, headers }) => {
            if (data.code === 1) {
                commit(ASSEMBLY_LABS_MUTATION, {
                    labs: data.labList,
                    fetch: 'labs'
                });
                commit('admin/' + UPDATE_ADMIN_TOKEN, headers.token, {
                    root: true
                });
            } else {
                throw new Error(data.message || 'Errore inaspettato');
            }
        })
        .catch(err => handleError(err, commit, 'labs'));
};

/**
 * Fetch assembly students
 * @public
 */
actions.fetchStudents = ({ commit, rootState }) => {
    commit(ASSEMBLY_FETCH_PENDING, 'students');

    const authToken = rootState.admin.token;

    axios
        .get('/api/assembly/students', {
            params: { action: 'getAll' },
            headers: { Authorization: `Bearer ${authToken}` }
        })
        .then(({ data, headers }) => {
            if (data.code === 1) {
                commit(STUDENTS_FETCHED, data.students);
                commit('admin/' + UPDATE_ADMIN_TOKEN, headers.token, {
                    root: true
                });
            } else {
                throw new Error(data.message || 'Errore inaspettato');
            }
        })
        .catch(err => handleError(err, commit, 'students'));
};

/**
 * Delete assembly (require to prompt password)
 * @public
 */
actions.deleteAssembly = ({ commit, rootState }) => {
    commit(ASSEMBLY_FETCH_PENDING, 'delete_assembly');

    const authToken = rootState.admin.token;

    return new Promise((resolve, reject) => {
        axios
            .delete('/api/assembly', {
                headers: { Authorization: `Bearer ${authToken}` }
            })
            .then(({ data, headers }) => {
                if (data.code === 1) {
                    commit(ASSEMBLY_DELETED, data);
                    commit('admin/' + UPDATE_ADMIN_TOKEN, headers.token, {
                        root: true
                    });
                    resolve();
                } else {
                    throw new Error(data.message || 'Errore inaspettato');
                }
            })
            .catch(err => {
                handleError(err, commit, 'delete_assembly');
                reject(err);
            });
    });
};

/**
 * Generate assembly's PDF
 * @public
 */
actions.generatePdf = ({ commit, rootState }) => {
    commit(ASSEMBLY_FETCH_PENDING, 'generate_pdf');

    const { admin, assembly } = rootState;
    const authToken = admin.token;
    let refreshedToken;

    return new Promise((resolve, reject) => {
        axios
            .get('/api/assembly/export', {
                headers: { Authorization: `Bearer ${authToken}` },
                responseType: 'blob'
            })
            .then(({ data, headers }) => {
                refreshedToken = headers.token;
                return FileSaver.saveAs(data, assembly.info.title + '.pdf');
            })
            .then(() => {
                commit(ASSEMBLY_PDF_COMPLETED);
                commit('admin/' + UPDATE_ADMIN_TOKEN, refreshedToken, {
                    root: true
                });
                resolve();
            })
            .catch(err => {
                handleError(err, commit, 'generate_pdf');
                reject(err);
            });
    });
};

actions.clearMessage = ({ commit }) => {
    commit(CLEAR_ASSEMBLY_MESSAGE);
};

const getters = {};
getters.exists = state => state.exists;
getters.info = state => state.info;
getters.labs = state => state.labs;
getters.stats = state => state.stats;
getters.message = state => state.message;
getters.pendings = state => state.pendings;

export default {
    namespaced: true,
    state: initialState,
    mutations,
    actions,
    getters
};
