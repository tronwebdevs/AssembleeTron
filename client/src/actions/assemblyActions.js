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
    
    UPDATE_ADMIN_TOKEN
} from '../actions/types.js';
import store from '../store';
import axios from 'axios';
import FileSaver from 'file-saver';

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
                            payload: {
                                message: data.message
                            }
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
                if (err.response && err.response.data && err.response.data.message) {
                    err.message = err.response.data.message;
                }
                dispatch({
                    type: ERROR_IN_INFO_FETCH,
                    payload: {
                        message: err.message,
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
                if (err.response && err.response.data && err.response.data.message) {
                    err.message = err.response.data.message;
                    dispatch({
                        type: UPDATE_ADMIN_TOKEN,
                        payload: err.response.headers.token
                    });
                }
                dispatch({
                    type: ERROR_IN_INFO_CREATE,
                    payload: {
                        message: err.message,
                        fetch: 'create_info'
                    }
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
                if (err.response && err.response.data && err.response.data.message) {
                    err.message = err.response.data.message;
                    dispatch({
                        type: UPDATE_ADMIN_TOKEN,
                        payload: err.response.headers.token
                    });
                }
                dispatch({
                    type: ERROR_IN_INFO_UPDATE,
                    payload: {
                        message: err.message,
                        fetch: 'update_info'
                    }
                });
                reject(err);
            });
    });
};

/**
 * Request a backup of the assembly
 * @public
 */
export const requestBackup = (overwrite = false) => dispatch => {

    dispatch({
        type: REQUEST_ASSEMBLY_BACKUP,
        payload: 'backup'
    });

    const authToken = store.getState().admin.token;

    return new Promise((resolve, reject) => {
        axios.post('/api/assembly/backups', { overwrite }, {
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
                if (err.response && err.response.data && err.response.data.message) {
                    const { data } = err.response;
                    err.message = data.message;
                    err.code = data.code;
                    dispatch({
                        type: UPDATE_ADMIN_TOKEN,
                        payload: err.response.headers.token
                    });
                }
                dispatch({
                    type: ERROR_IN_ASSEMBLY_BACKUP,
                    payload: {
                        fetch: 'backup',
                        message: err.message
                    }
                });
                reject(err);
            });
    });
};

/**
 * Load assembly from backup
 * @param {string} id
 */
export const loadAssembly = id => dispatch => {

    dispatch({
        type: REQUEST_ASSEMBLY_LOAD,
        payload: 'load'
    });

    const authToken = store.getState().admin.token;

    return new Promise((resolve, reject) => {
        axios.post('/api/assembly/backups/load', { _id: id }, {
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
                if (err.response && err.response.data && err.response.data.message) {
                    err.message = err.response.data.message;
                    dispatch({
                        type: UPDATE_ADMIN_TOKEN,
                        payload: err.response.headers.token
                    });
                }
                dispatch({
                    type: ERROR_IN_ASSEMBLY_LOAD,
                    payload: {
                        fetch: 'load',
                        message: err.message
                    }
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
                if (err.response && err.response.data && err.response.data.message) {
                    err.message = err.response.data.message;
                    dispatch({
                        type: UPDATE_ADMIN_TOKEN,
                        payload: err.response.headers.token
                    });
                }
                dispatch({
                    type: ERROR_IN_LAB_CREATE,
                    payload: {
                        message: err.message,
                        fetch: 'create_lab'
                    }
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
                if (err.response && err.response.data && err.response.data.message) {
                    err.message = err.response.data.message;
                    dispatch({
                        type: UPDATE_ADMIN_TOKEN,
                        payload: err.response.headers.token
                    });
                }
                dispatch({
                    type: ERROR_IN_LAB_UPDATE,
                    payload: {
                        message: err.message,
                        fetch: 'update_lab'
                    }
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
                if (err.response && err.response.data && err.response.data.message) {
                    err.message = err.response.data.message;
                    dispatch({
                        type: UPDATE_ADMIN_TOKEN,
                        payload: err.response.headers.token
                    });
                }
                dispatch({
                    type: ERROR_IN_LAB_DELETE,
                    payload: {
                        message: err.message,
                        fetch: 'delete_lab'
                    }
                });
                reject(err);
            });
    });
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
                                exists: data.code === 0 ? false : true
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
                if (err.response && err.response.data && err.response.data.message) {
                    err.message = err.response.data.message;
                    dispatch({
                        type: UPDATE_ADMIN_TOKEN,
                        payload: err.response.headers.token
                    });
                }
                dispatch({
                    type: ERROR_IN_ASSEMBLY_FETCH,
                    payload: {
                        message: err.message,
                        fetch: 'assembly'
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
        .catch(err => {
            if (err.response && err.response.data && err.response.data.message) {
                err.message = err.response.data.message;
                dispatch({
                    type: UPDATE_ADMIN_TOKEN,
                    payload: err.response.headers.token
                });
            }
            dispatch({
                type: ERROR_IN_LABS_FETCH,
                payload: {
                    message: err.message,
                    fetch: 'labs'
                }
            });
        });
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
        .catch(err => {
            if (err.response && err.response.data && err.response.data.message) {
                err.message = err.response.data.message;
                dispatch({
                    type: UPDATE_ADMIN_TOKEN,
                    payload: err.response.headers.token
                });
            }
            dispatch({
                type: ERROR_IN_STUDENTS_FETCH,
                payload: {
                    message: err.message,
                    fetch: 'students'
                }
            })
        });
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
                if (err.response && err.response.data && err.response.data.message) {
                    err.message = err.response.data.message;
                    dispatch({
                        type: UPDATE_ADMIN_TOKEN,
                        payload: err.response.headers.token
                    });
                }
                dispatch({
                    type: ERROR_IN_ASSEMBLY_DELETE,
                    payload: {
                        message: err.message,
                        fetch: 'delete_assembly'
                    }
                });
                reject(err);
            });
    });
};

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
                if (err.response && err.response.data && err.response.data.message) {
                    err.message = err.response.data.message;
                    dispatch({
                        type: UPDATE_ADMIN_TOKEN,
                        payload: err.response.headers.token
                    });
                }
                dispatch({
                    type: ERROR_IN_ASSEMBLY_PDF,
                    payload: {
                        message: err.message,
                        fetch: 'generate_pdf'
                    }
                });
                reject(err);
            });
    });
}