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
} from '../actions/types.js';
import { safeFetch } from './utils';

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
        safeFetch('/api/assembly/info')
            .then(data => {
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

    return new Promise((resolve, reject) => {
        safeFetch('/api/assembly/info', {
            method: 'POST',
            headers: new Headers({
                "Content-Type": "application/json",
            }),
            body: JSON.stringify(info)
        })
            .then(data => {
                if (data.code === 1) {
                    dispatch({
                        type: INFO_CREATED,
                        payload: data.info
                    });
                    resolve();
                } else {
                    throw new Error(data.message || 'Errore inaspettato');
                }
            })
            .catch(err => {
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

    return new Promise((resolve, reject) => {
        safeFetch('/api/assembly/info', {
            method: 'PUT',
            headers: new Headers({
                "Content-Type": "application/json",
            }),
            body: JSON.stringify(info)
        })
            .then(data => {
                if (data.code === 1) {
                    dispatch({
                        type: INFO_UPDATED,
                        payload: data.info
                    });
                    resolve('Informazioni aggiornate con successo');
                } else {
                    throw new Error(data.message || 'Errore inaspettato');
                }
            })
            .catch(err => {
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
export const requestBackup = () => dispatch => {

    dispatch({
        type: REQUEST_ASSEMBLY_BACKUP,
        payload: 'backup'
    });

    return new Promise((resolve, reject) => {
        safeFetch('/api/assembly/backups', {
            method: 'POST'
        })
            .then(data => {
                if (data.code === 1) {
                    dispatch({
                        type: ASSEMBLY_BACKUP_COMPLETED,
                        payload: null
                    });
                    resolve(data.message);
                } else {
                    throw new Error(data.message || 'Errore inaspettato');
                }
            })
            .catch(err => {
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
 * @param {string} uuid 
 */
export const loadAssembly = uuid => dispatch => {

    dispatch({
        type: REQUEST_ASSEMBLY_LOAD,
        payload: 'load'
    });

    return new Promise((resolve, reject) => {
        safeFetch('/api/assembly/backups/load', {
            method: 'POST',
            headers: new Headers({
                "Content-Type": "application/json",
            }),
            body: JSON.stringify({ uuid })
        })
            .then(data => {
                if (data.code === 1) {
                    dispatch({
                        type: ASSEMBLY_LOAD_COMPLETED,
                        payload: data.assembly
                    });
                    resolve();
                } else {
                    throw new Error(data.message || 'Errore inaspettato');
                }
            })
            .catch(err => {
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
export const createAssemblyLab = lab => (dispatch, getState) => {

    const { assembly } = getState();
    const { labs } = assembly;

    dispatch({
        type: CREATE_LAB_PENDING,
        payload: 'create_lab'
    });

    return new Promise((resolve, reject) => {
        safeFetch('/api/assembly/labs', {
            method: 'POST',
            headers: new Headers({
                "Content-Type": "application/json",
            }),
            body: JSON.stringify({ lab })
        })
            .then(data => {
                if (data.code === 1) {
                    dispatch({
                        type: LAB_CREATED,
                        payload: [ ...labs, data.lab ]
                    });
                    resolve(data.lab);
                } else {
                    let error = new Error(data.message || 'Errore inaspettato');
                    error.from = data.from || "";
                    throw error;
                }
            })
            .catch(err => {
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
export const updateAssemblyLab = lab => (dispatch, getState) => {
    
    const { assembly } = getState();
    const { labs } = assembly;

    dispatch({
        type: UPDATE_LAB_PENDING,
        payload: 'update_lab'
    });

    return new Promise((resolve, reject) => {
        safeFetch('/api/assembly/labs', {
            method: 'PUT',
            headers: new Headers({
                "Content-Type": "application/json",
            }),
            body: JSON.stringify({ lab })
        })
            .then(data => {
                if (data.code === 1) {
                    dispatch({
                        type: LAB_UPDATED,
                        payload: labs.map(lab => {
                            if (lab.ID === data.lab.ID) {
                                return data.lab;
                            }
                            return lab;
                        })
                    });
                    resolve(data.lab);
                } else {
                    throw new Error(data.message || 'Errore inaspettato');
                }
            })
            .catch(err => {
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
export const deleteAssemblyLab = labID => (dispatch, getState) => {

    const { assembly } = getState();
    const { labs } = assembly;

    dispatch({
        type: DELETE_LAB_PENDING,
        payload: 'delete_lab'
    });

    return new Promise((resolve, reject) => {
        safeFetch('/api/assembly/labs', {
            method: 'DELETE',
            headers: new Headers({
                "Content-Type": "application/json",
            }),
            body: JSON.stringify({ ID: labID })
        })
            .then(data => {
                if (data.code === 1) {
                    dispatch({
                        type: LAB_DELETED,
                        payload: labs.filter(lab => lab.ID !== data.labID)
                    });
                    resolve(data.labID);
                } else {
                    let error = new Error(data.message || 'Errore inaspettato');
                    error.from = data.from || "";
                    throw error;
                }
            })
            .catch(err => {
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
    safeFetch('/api/assembly/')
        .then(data => {
            switch (data.code) {
                case 0:
                case 1:
                case 2:
                case 3:
                    dispatch({
                        type: ASSEMBLY_FETCHED,
                        payload: {
                            ...data,
                            exists: data.code === 0 ? false : true
                        }
                    });
                    break;
                default:
                    throw new Error(data.message || 'Errore inaspettato');
            }
        })
        .catch(err => dispatch({
            type: ERROR_IN_ASSEMBLY_FETCH,
            payload: {
                message: err.message,
                fetch: 'assembly'
            }
        }));
};

/**
 * Fetch all assembly labs
 * @public
 * @deprecated
 */
export const fetchAllLabs = () => dispatch => {

    dispatch({
        type: FETCH_LABS_PENDING,
        payload: 'labs'
    });

    safeFetch('/api/assembly/labs?action=getAll')
        .then(data => {
            if (data.code === 1) {
                dispatch({
                    type: LABS_FETCHED,
                    payload: data.labList
                })
            } else {
                throw new Error(data.message || 'Errore inaspettato');
            }
        })
        .catch(err => dispatch({
            type: ERROR_IN_LABS_FETCH,
            payload: {
                message: err.message,
                fetch: 'labs'
            }
        }));
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

    safeFetch('/api/assembly/students?action=getAll')
        .then(data => {
            if (data.code === 1) {
                dispatch({
                    type: STUDENTS_FETCHED,
                    payload: data.students
                })
            } else {
                throw new Error(data.message || 'Errore inaspettato');
            }
        })
        .catch(err => dispatch({
            type: ERROR_IN_STUDENTS_FETCH,
            payload: {
                message: err.message,
                fetch: 'students'
            }
        }));
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

    const password = prompt('Conferma la password');

    return new Promise((resolve, reject) => {
        safeFetch('/api/assembly', {
            method: 'DELETE',
            headers: new Headers({
                "Content-Type": "application/json",
            }),
            body: JSON.stringify({ password })
        })
            .then(data => {
                if (data.code === 1) {
                    dispatch({
                        type: ASSEMBLY_DELETED,
                        payload: null
                    });
                    resolve();
                } else {
                    throw new Error(data.message || 'Errore inaspettato');
                }
            })
            .catch(err => {
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