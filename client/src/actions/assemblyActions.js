import {
    FETCH_ASSEMBLY_INFO,
    ASSEMBLY_SUBS_CLOSE,
    ASSEMBLY_SUBS_OPEN,
    ASSEMBLY_NOT_AVABILE,
    ERROR_IN_ASSEMBLY_FETCH,

    FETCH_ASSEMBLY_LABS,
    ASSEMBLY_LABS_FETCHED,
    ERROR_IN_LABS_FETCH,

    FETCH_ASSEMBLY_STUDENTS,
    ASSEMBLY_STUDENTS_FETCHED,
    ERROR_IN_STUDENTS_FETCH,

    UPDATE_ASSEMBLY_INFO,
    ASSEMBLY_INFO_UPDATED,
    ERROR_IN_ASSEMBLY_INFO_UPDATE,

    CREATE_ASSEMBLY_LAB,
    ASSEMBLY_LAB_CREATED,
    ERROR_IN_ASSEMBLY_LAB_CREATE,
    
    UPDATE_ASSEMBLY_LAB,
    ASSEMBLY_LAB_UPDATED,
    ERROR_IN_ASSEMBLY_LAB_UPDATE,

    DELETE_ASSEMBLY_LAB,
    ASSEMBLY_LAB_DELETED,
    ERROR_IN_ASSEMBLY_LAB_DELETE,
    
    FETCH_ASSEMBLY_PENDING,
    FETCH_ASSEMBLY_DONE,

    DELETE_ASSEMBLY,
    ASSEMBLY_DELETED,
    ERROR_IN_ASSEMBLY_DELETE
} from '../actions/types.js';

/**
 * Fetch assembly info
 * @public
 */
export const fetchAssemblyInfo = () => dispatch => {
    dispatch({
        type: FETCH_ASSEMBLY_INFO,
        payload: 'info'
    });
    fetch('/api/assembly/info')
    .then(resp => resp.json())
    .then(data => {
        switch (data.code) {
            case 0:
                dispatch({
                    type: ASSEMBLY_NOT_AVABILE,
                    payload: {
                        message: data.message
                    }
                });
                break;
            case 1:
            case 3:
                dispatch({
                    type: ASSEMBLY_SUBS_CLOSE,
                    payload: {
                        message: data.message
                    }
                });
                break;
            case 2:
                dispatch({
                    type: ASSEMBLY_SUBS_OPEN,
                    payload: data.info
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
            fetch: 'info'
        }
    }))
};

/**
 * Update assembly info
 * @param {object} info 
 * @param {function} callback 
 * @public
 */
export const updateAssemblyInfo = (info, callback) => dispatch => {
    dispatch({
        type: UPDATE_ASSEMBLY_INFO,
        payload: 'update_info'
    });
    fetch('/api/assembly/info', {
        method: 'PUT',
        headers: new Headers({
            "Content-Type": "application/json",
        }),
        body: JSON.stringify(info)
    })
    .then(res => res.json())
    .then(data => {
        if (data.code === 1) {
            dispatch({
                type: ASSEMBLY_INFO_UPDATED,
                payload: data.info
            });
            callback(null, data.info);
        } else {
            throw new Error(data.message || 'Errore inaspettato');
        }
    })
    .catch(err => {
        dispatch({
            type: ERROR_IN_ASSEMBLY_INFO_UPDATE,
            payload: {
                message: err.message,
                fetch: 'update_info'
            }
        });
        callback(err, null);
    });
};

/**
 * @function createAssemblyLab() Create new lab
 * @param {object} lab 
 * @param {function(object, function)} callback
 * @public
 */
export const createAssemblyLab = (lab, callback) => (dispatch, getState) => {
    const { assembly } = getState();
    const { labs } = assembly;
    dispatch({
        type: CREATE_ASSEMBLY_LAB,
        payload: 'create_lab'
    });
    fetch('/api/assembly/labs', {
        method: 'POST',
        headers: new Headers({
            "Content-Type": "application/json",
        }),
        body: JSON.stringify({ lab })
    })
    .then(res => res.json())
    .then(data => {
        if (data.code === 1) {
            dispatch({
                type: ASSEMBLY_LAB_CREATED,
                payload: [ ...labs, data.lab ]
            });
            callback(null, data.lab);
        } else {
            let error = new Error(data.message || 'Errore inaspettato');
            error.from = data.from || "";
            throw error;
        }
    })
    .catch(err => {
        dispatch({
            type: ERROR_IN_ASSEMBLY_LAB_CREATE,
            payload: {
                message: err.message,
                fetch: 'create_lab'
            }
        });
        callback(err, null);
    });
};

/**
 * Update assembly lab
 * @param {object} lab 
 * @param {function} callback
 * @public
 */
export const updateAssemblyLab = (lab, callback) => (dispatch, getState) => {
    const { assembly } = getState();
    const { labs } = assembly;
    dispatch({
        type: UPDATE_ASSEMBLY_LAB,
        payload: 'update_lab'
    });
    fetch('/api/assembly/labs', {
        method: 'PUT',
        headers: new Headers({
            "Content-Type": "application/json",
        }),
        body: JSON.stringify({ lab })
    })
    .then(res => res.json())
    .then(data => {
        if (data.code === 1) {
            dispatch({
                type: ASSEMBLY_LAB_UPDATED,
                payload: labs.map(lab => {
                    if (lab.ID === data.lab.ID) {
                        return data.lab;
                    }
                    return lab;
                })
            });
            callback(null, data.lab);
        } else {
            throw new Error(data.message || 'Errore inaspettato');
        }
    })
    .catch(err => {
        dispatch({
            type: ERROR_IN_ASSEMBLY_LAB_UPDATE,
            payload: {
                message: err.message,
                fetch: 'update_lab'
            }
        });
        callback(err, null);
    });
};

/**
 * Delete assembly lab
 * @param {number} labID 
 * @param {function} callback
 * @public
 */
export const deleteAssemblyLab = (labID, callback) => (dispatch, getState) => {
    const { assembly } = getState();
    const { labs } = assembly;
    dispatch({
        type: DELETE_ASSEMBLY_LAB,
        payload: 'delete_lab'
    });
    fetch('/api/assembly/labs', {
        method: 'DELETE',
        headers: new Headers({
            "Content-Type": "application/json",
        }),
        body: JSON.stringify({ ID: labID })
    })
    .then(res => res.json())
    .then(data => {
        if (data.code === 1) {
            dispatch({
                type: ASSEMBLY_LAB_DELETED,
                payload: labs.filter(lab => lab.ID !== data.labID)
            });
            callback(null, data.labID);
        } else {
            let error = new Error(data.message || 'Errore inaspettato');
            error.from = data.from || "";
            throw error;
        }
    })
    .catch(err => {
        dispatch({
            type: ERROR_IN_ASSEMBLY_LAB_DELETE,
            payload: {
                message: err.message,
                fetch: 'delete_lab'
            }
        });
        callback(err, null);
    });
};

/**
 * Fetch assembly general info (info, number of students/subsciber/laboratories)
 * @public
 */
export const fetchAssemblyGeneral = () => dispatch => {
    dispatch({
        type: FETCH_ASSEMBLY_PENDING,
        payload: 'admin_dashboard'
    });
    fetch('/api/assembly/')
    .then(resp => resp.json())
    .then(data => {
        switch (data.code) {
            case 0:
                dispatch({
                    type: ASSEMBLY_NOT_AVABILE,
                    payload: {
                        message: data.message
                    }
                });
                break;
            case 1:
            case 2:
            case 3:
                dispatch({
                    type: FETCH_ASSEMBLY_DONE,
                    payload: data
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
            fetch: 'admin_dashboard'
        }
    }))
};

/**
 * Fetch all assembly labs
 * @public
 */
export const fetchAllLabs = () => dispatch => {
    dispatch({
        type: FETCH_ASSEMBLY_LABS,
        payload: 'labs'
    });
    fetch('/api/assembly/labs?action=getAll')
    .then(resp => resp.json())
    .then(data => {
        if (data.code === 1) {
            dispatch({
                type: ASSEMBLY_LABS_FETCHED,
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
    }))
};

/**
 * Fetch assembly students
 * @public
 */
export const fetchStudents = () => dispatch => {
    dispatch({
        type: FETCH_ASSEMBLY_STUDENTS,
        payload: 'students'
    });
    fetch('/api/assembly/students?action=getAll')
    .then(resp => resp.json())
    .then(data => {
        if (data.code === 1) {
            dispatch({
                type: ASSEMBLY_STUDENTS_FETCHED,
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
    }))
};

/**
 * Delete assembly (require to prompt password)
 * @public
 */
export const deleteAssembly = () => dispatch => {
    dispatch({
        type: DELETE_ASSEMBLY,
        payload: 'delete_assembly'
    });
    const password = prompt('Conferma la password');
    fetch('/api/assembly', {
        method: 'DELETE',
        headers: new Headers({
            "Content-Type": "application/json",
        }),
        body: JSON.stringify({ password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.code === 1) {
            dispatch({
                type: ASSEMBLY_DELETED,
                payload: null
            });
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
    });
};