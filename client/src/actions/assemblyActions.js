import {
    FETCH_ASSEMBLY_PENDING,
	ASSEMBLY_FETCHED,
    ERROR_IN_ASSEMBLY_FETCH,
    
    REQUEST_ASSEMBLY_BACKUP,
    ASSEMBLY_BACKUP_COMPLETED,
    ERROR_IN_ASSEMBLY_BACKUP,

    REQUEST_ASSEMBLY_LOAD,
    ASSEMBLY_LOAD_COMPLETED,
    ERROR_IN_ASSEMBLY_LOAD,

	DELETE_ASSEMBLY_PENDING,
	ASSEMBLY_DELETED,
	ERROR_IN_ASSEMBLY_DELETE,

	FETCH_INFO_PENDING,
	ASSEMBLY_SUBS_CLOSE,
	ASSEMBLY_SUBS_OPEN,
	ASSEMBLY_NOT_AVABILE,
	ERROR_IN_INFO_FETCH,

	CREATE_INFO_PENDING,
	INFO_CREATED,
	ERROR_IN_INFO_CREATE,

	UPDATE_INFO_PENDING,
	INFO_UPDATED,
	ERROR_IN_INFO_UPDATE,

	FETCH_LABS_PENDING,
	LABS_FETCHED,
	ERROR_IN_LABS_FETCH,

	CREATE_LAB_PENDING,
	LAB_CREATED,
	ERROR_IN_LAB_CREATE,

	UPDATE_LAB_PENDING,
	LAB_UPDATED,
	ERROR_IN_LAB_UPDATE,

	DELETE_LAB_PENDING,
	LAB_DELETED,
	ERROR_IN_LAB_DELETE,

	FETCH_STUDENTS_PENDING,
	STUDENTS_FETCHED,
    ERROR_IN_STUDENTS_FETCH,

    REQUEST_ASSEMBLY_PDF,
    ASSEMBLY_PDF_COMPLETED,
    ERROR_IN_ASSEMBLY_PDF,
    
    UPDATE_ADMIN_TOKEN,
    ADMIN_LOGOUT
} from '../actions/types.js';
import store from '../store';
import axios from 'axios';
import FileSaver from 'file-saver';

/**
 * Handle requests errors
 * @param {object} err 
 * @param {function} dispatch 
 * @param {object} param2 
 * @private
 */
const handleError = (err, dispatch, { type, fetch }) => {
    const { response } = err;
    if (response) {
        const { data, headers, status } = response;
        if (data && data.message) {
            err.message = data.message;
            if (status === 401) {
                dispatch({
                    type: ADMIN_LOGOUT,
                    payload: null
                });
            } else {
                dispatch({
                    type: UPDATE_ADMIN_TOKEN,
                    payload: headers.token
                });
            }
        }
    }
    dispatch({
        type,
        payload: {
            message: err.message || 'Errore sconosciuto',
            fetch
        }
    });
};

/**
 * Fetch assembly info
 * @public
 */
export const fetchAssemblyInfo = () => dispatch => {

    dispatch({
        type: FETCH_INFO_PENDING,
        payload: 'info'
    });

    return new Promise((resolve, reject) => {
        axios.get('/api/assembly/info')
            .then(({ data }) => {
                switch (data.code) {
                    case 0:
                        dispatch({
                            type: ASSEMBLY_NOT_AVABILE,
                            payload: {
                                message: data.message
                            }
                        });
                        reject(new Error(data.message));
                        break;
                    case 1:
                    case 3:
                        dispatch({
                            type: ASSEMBLY_SUBS_CLOSE,
                            payload: data.info
                        });
                        reject(new Error(data.message));
                        break;
                    case 2:
                        dispatch({
                            type: ASSEMBLY_SUBS_OPEN,
                            payload: data.info
                        });
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
                dispatch({
                    type: ERROR_IN_INFO_FETCH,
                    payload: {
                        message: err.message || 'Errore sconosciuto',
                        fetch: 'info'
                    }
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
export const createAssemblyInfo = info => dispatch => {

    dispatch({
        type: CREATE_INFO_PENDING,
        payload: 'create_info'
    });

    const authToken = store.getState().admin.token;

    return new Promise((resolve, reject) => {
        axios.post('/api/assembly/info', { info }, {
            headers: { Authorization: `Bearer ${authToken}`}
        })
            .then(({ data, headers }) => {
                if (data.code === 1) {
                    dispatch({
                        type: INFO_CREATED,
                        payload: data.info
                    });
                    dispatch({
                        type: UPDATE_ADMIN_TOKEN,
                        payload: headers.token
                    });
                    resolve();
                } else {
                    throw new Error(data.message || 'Errore inaspettato');
                }
            })
            .catch(err => {
                handleError(err, dispatch, {
                    type: ERROR_IN_INFO_CREATE,
                    fetch: 'create_info'
                });
                reject(err);
            });
    });
};

/**
 * Update assembly info
 * @param {object} info
 * @public
 */
export const updateAssemblyInfo = info => dispatch => {

    dispatch({
        type: UPDATE_INFO_PENDING,
        payload: 'update_info'
    });

    const authToken = store.getState().admin.token;

    return new Promise((resolve, reject) => {
        axios.put('/api/assembly/info', { info }, {
            headers: { Authorization: `Bearer ${authToken}`}
        })
            .then(({ data, headers }) => {
                if (data.code === 1) {
                    dispatch({
                        type: INFO_UPDATED,
                        payload: data.info
                    });
                    dispatch({
                        type: UPDATE_ADMIN_TOKEN,
                        payload: headers.token
                    });
                    resolve('Informazioni aggiornate con successo');
                } else {
                    throw new Error(data.message || 'Errore inaspettato');
                }
            })
            .catch(err => {
                handleError(err, dispatch, {
                    type: ERROR_IN_INFO_UPDATE,
                    fetch: 'update_info'
                });
                reject(err);
            });
    });
};

/**
 * Request a backup of the assembly
 * @public
 */
export const requestBackup = () => dispatch => {

    dispatch({
        type: REQUEST_ASSEMBLY_BACKUP,
        payload: 'backup'
    });

    const authToken = store.getState().admin.token;

    return new Promise((resolve, reject) => {
        axios.post('/api/assembly/backups', {}, {
            headers: { Authorization: `Bearer ${authToken}`}
        })
            .then(({ data, headers }) => {
                if (data.code === 1) {
                    dispatch({
                        type: ASSEMBLY_BACKUP_COMPLETED,
                        payload: null
                    });
                    dispatch({
                        type: UPDATE_ADMIN_TOKEN,
                        payload: headers.token
                    });
                    resolve(data.message);
                } else {
                    throw new Error(data.message || 'Errore inaspettato');
                }
            })
            .catch(err => {
                handleError(err, dispatch, {
                    type: ERROR_IN_ASSEMBLY_BACKUP,
                    fetch: 'backup'
                });
                reject(err);
            });
    });
};

/**
 * Load assembly from backup
 * @param {string} fileName
 */
export const loadAssembly = fileName => dispatch => {

    dispatch({
        type: REQUEST_ASSEMBLY_LOAD,
        payload: 'load'
    });

    const authToken = store.getState().admin.token;

    return new Promise((resolve, reject) => {
        axios.post('/api/assembly/backups/load', { fileName }, {
            headers: { Authorization: `Bearer ${authToken}`}
        })
            .then(({ data, headers }) => {
                if (data.code === 1) {
                    dispatch({
                        type: ASSEMBLY_LOAD_COMPLETED,
                        payload: data.assembly
                    });
                    dispatch({
                        type: UPDATE_ADMIN_TOKEN,
                        payload: headers.token
                    });
                    resolve();
                } else {
                    throw new Error(data.message || 'Errore inaspettato');
                }
            })
            .catch(err => {
                handleError(err, dispatch, {
                    type: ERROR_IN_ASSEMBLY_LOAD,
                    fetch: 'load'
                });
                reject(err);
            });
    });
};

/**
 * Create new lab
 * @param {object} lab
 * @public
 */
export const createAssemblyLab = lab => dispatch => {

    const { assembly, admin } = store.getState();
    const authToken = admin.token;
    const { labs } = assembly;

    dispatch({
        type: CREATE_LAB_PENDING,
        payload: 'create_lab'
    });

    return new Promise((resolve, reject) => {
        axios.post('/api/assembly/labs', { lab }, {
            headers: { Authorization: `Bearer ${authToken}`}
        })
            .then(({ data, headers }) => {
                if (data.code === 1) {
                    dispatch({
                        type: LAB_CREATED,
                        payload: [ ...labs, data.lab ]
                    });
                    dispatch({
                        type: UPDATE_ADMIN_TOKEN,
                        payload: headers.token
                    });
                    resolve(data.lab);
                } else {
                    let error = new Error(data.message || 'Errore inaspettato');
                    error.from = data.from || "";
                    throw error;
                }
            })
            .catch(err => {
                handleError(err, dispatch, {
                    type: ERROR_IN_LAB_CREATE,
                    fetch: 'create_lab'
                });
                reject(err);
            });
    });
};

/**
 * Update assembly lab
 * @param {object} lab
 * @public
 */
export const updateAssemblyLab = lab => dispatch => {
    
    const { assembly, admin } = store.getState();
    const authToken = admin.token;
    const { labs } = assembly;

    dispatch({
        type: UPDATE_LAB_PENDING,
        payload: 'update_lab'
    });

    return new Promise((resolve, reject) => {
        axios.put('/api/assembly/labs', { lab }, {
            headers: { Authorization: `Bearer ${authToken}`}
        })
            .then(({ data, headers }) => {
                if (data.code === 1) {
                    dispatch({
                        type: LAB_UPDATED,
                        payload: labs.map(lab => {
                            if (lab._id === data.lab._id) {
                                return data.lab;
                            }
                            return lab;
                        })
                    });
                    dispatch({
                        type: UPDATE_ADMIN_TOKEN,
                        payload: headers.token
                    });
                    resolve(data.lab);
                } else {
                    throw new Error(data.message || 'Errore inaspettato');
                }
            })
            .catch(err => {
                handleError(err, dispatch, {
                    type: ERROR_IN_LAB_UPDATE,
                    fetch: 'update_lab'
                });
                reject(err);
            });
    });
};

/**
 * Delete assembly lab
 * @param {number} labID
 * @public
 */
export const deleteAssemblyLab = labID => dispatch => {

    const { assembly, admin } = store.getState();
    const authToken = admin.token;
    const { labs } = assembly;

    dispatch({
        type: DELETE_LAB_PENDING,
        payload: 'delete_lab'
    });

    return new Promise((resolve, reject) => {
        axios.delete('/api/assembly/labs', { 
            data: { _id: labID },
            headers: { Authorization: `Bearer ${authToken}`}
        })
            .then(({ data, headers }) => {
                if (data.code === 1) {
                    dispatch({
                        type: LAB_DELETED,
                        payload: labs.filter(lab => lab._id !== data.lab._id)
                    });
                    dispatch({
                        type: UPDATE_ADMIN_TOKEN,
                        payload: headers.token
                    });
                    resolve(data.lab.title);
                } else {
                    let error = new Error(data.message || 'Errore inaspettato');
                    error.from = data.from || "";
                    throw error;
                }
            })
            .catch(err => {
                handleError(err, dispatch, {
                    type: ERROR_IN_LAB_DELETE,
                    fetch: 'delete_lab'
                });
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
export const excludeClassesFromLabs = (h, sections) => dispatch => {
    dispatch({
        type: FETCH_LABS_PENDING,
        payload: 'labs'
    });

    const authToken = store.getState().admin.token;

    return new Promise((resolve, reject) => 
        axios.post('/api/assembly/labs/exclude', {
            h, sections
        },{
            headers: { Authorization: `Bearer ${authToken}`}
        })
            .then(({ data, headers }) => {
                if (data.code === 1) {
                    dispatch({
                        type: LABS_FETCHED,
                        payload: data.labs
                    });
                    dispatch({
                        type: UPDATE_ADMIN_TOKEN,
                        payload: headers.token
                    });
                    resolve();
                } else {
                    throw new Error(data.message || 'Errore inaspettato');
                }
            })
            .catch(err => {
                handleError(err, dispatch, {
                    type: ERROR_IN_LABS_FETCH,
                    fetch: 'labs'
                });
                reject(err);
            })
    );
};

/**
 * Fetch assembly general info (info, number of students/subsciber/laboratories)
 * @public
 */
export const fetchAssemblyGeneral = () => dispatch => {

    dispatch({
        type: FETCH_ASSEMBLY_PENDING,
        payload: 'assembly'
    });

    const authToken = store.getState().admin.token;

    return new Promise((resolve, reject) => {
        axios.get('/api/assembly/', {
            headers: { Authorization: `Bearer ${authToken}`}
        })
            .then(({ data, headers }) => {
                switch (data.code) {
                    case 0:
                    case 1:
                        dispatch({
                            type: ASSEMBLY_FETCHED,
                            payload: {
                                ...data,
                                exists: data.code === 0 ? false : true,
                                pending: false
                            }
                        });
                        dispatch({
                            type: UPDATE_ADMIN_TOKEN,
                            payload: headers.token
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
                            dispatch({
                                type: ADMIN_LOGOUT,
                                payload: null
                            });
                        } else {
                            dispatch({
                                type: UPDATE_ADMIN_TOKEN,
                                payload: headers.token
                            });
                        }
                    }
                }
                dispatch({
                    type: ERROR_IN_ASSEMBLY_FETCH,
                    payload: {
                        message: err.message || 'Errore sconosciuto',
                        fetch: 'assembly',
                        pending
                    }
                });
                reject(err);
            });
    });
};

/**
 * Fetch all assembly labs
 * @public
 */
export const fetchAllLabs = () => dispatch => {

    dispatch({
        type: FETCH_LABS_PENDING,
        payload: 'labs'
    });

    const authToken = store.getState().admin.token;

    axios.get('/api/assembly/labs', {
        params: { action: 'getAll' },
        headers: { Authorization: `Bearer ${authToken}`}
    })
        .then(({ data, headers }) => {
            if (data.code === 1) {
                dispatch({
                    type: LABS_FETCHED,
                    payload: data.labList
                });
                dispatch({
                    type: UPDATE_ADMIN_TOKEN,
                    payload: headers.token
                });
            } else {
                throw new Error(data.message || 'Errore inaspettato');
            }
        })
        .catch(err =>
            handleError(err, dispatch, {
                type: ERROR_IN_LABS_FETCH,
                fetch: 'labs'
            })
        );
};

/**
 * Fetch assembly students
 * @public
 */
export const fetchStudents = () => dispatch => {

    dispatch({
        type: FETCH_STUDENTS_PENDING,
        payload: 'students'
    });

    const authToken = store.getState().admin.token;

    axios.get('/api/assembly/students', {
        params: { action: 'getAll' },
        headers: { Authorization: `Bearer ${authToken}`}
    })
        .then(({ data, headers }) => {
            if (data.code === 1) {
                dispatch({
                    type: STUDENTS_FETCHED,
                    payload: data.students
                });
                dispatch({
                    type: UPDATE_ADMIN_TOKEN,
                    payload: headers.token
                });
            } else {
                throw new Error(data.message || 'Errore inaspettato');
            }
        })
        .catch(err =>
            handleError(err, dispatch, {
                type: ERROR_IN_STUDENTS_FETCH,
                fetch: 'students'
            })
        );
};

/**
 * Delete assembly (require to prompt password)
 * @public
 */
export const deleteAssembly = () => dispatch => {

    dispatch({
        type: DELETE_ASSEMBLY_PENDING,
        payload: 'delete_assembly'
    });

    const authToken = store.getState().admin.token;

    return new Promise((resolve, reject) => {
        axios.delete('/api/assembly', {
            headers: { Authorization: `Bearer ${authToken}`}
        })
            .then(({ data, headers }) => {
                if (data.code === 1) {
                    dispatch({
                        type: ASSEMBLY_DELETED,
                        payload: data
                    });
                    dispatch({
                        type: UPDATE_ADMIN_TOKEN,
                        payload: headers.token
                    });
                    resolve();
                } else {
                    throw new Error(data.message || 'Errore inaspettato');
                }
            })
            .catch(err => {
                handleError(err, dispatch, {
                    type: ERROR_IN_ASSEMBLY_DELETE,
                    fetch: 'delete_assembly'
                });
                reject(err);
            });
    });
};

/**
 * Generate assembly's PDF
 * @public
 */
export const generatePdf = () => dispatch => {
    dispatch({
        type: REQUEST_ASSEMBLY_PDF,
        payload: 'generate_pdf'
    });

    const { admin, assembly } = store.getState()
    const authToken = admin.token;
    let refreshedToken;

    return new Promise((resolve, reject) => {
        axios.get('/api/assembly/export', {
            headers: { Authorization: `Bearer ${authToken}`},
            responseType: 'blob',
        })
            .then(({ data, headers }) => {
                refreshedToken = headers.token;
                return FileSaver.saveAs(data, assembly.info.title + '.pdf');
            })
            .then(() => {
                dispatch({
                    type: ASSEMBLY_PDF_COMPLETED,
                    payload: {}
                });
                dispatch({
                    type: UPDATE_ADMIN_TOKEN,
                    payload: refreshedToken
                });
                resolve('Operazione completata con successo');
            })
            .catch(err => {
                handleError(err, dispatch, {
                    type: ERROR_IN_ASSEMBLY_PDF,
                    fetch: 'generate_pdf'
                });
                reject(err);
            });
    });
};
