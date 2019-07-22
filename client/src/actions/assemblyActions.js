import {
    FETCH_ASSEMBLY_PENDING,
	ASSEMBLY_FETCHED,
	ERROR_IN_ASSEMBLY_FETCH,

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

/**
 * Fetch assembly info
 * @public
 */
export const fetchAssemblyInfo = () => dispatch => {
    dispatch({
        type: FETCH_INFO_PENDING,
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
        type: ERROR_IN_INFO_FETCH,
        payload: {
            message: err.message,
            fetch: 'info'
        }
    }))
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
    fetch('/api/assembly/info', {
        method: 'POST',
        headers: new Headers({
            "Content-Type": "application/json",
        }),
        body: JSON.stringify(info)
    })
    .then(res => res.json())
    .then(data => {
        if (data.code === 1) {
            dispatch({
                type: INFO_CREATED,
                payload: data.info
            });
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
    });
}

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
                type: INFO_UPDATED,
                payload: data.info
            });
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
        type: CREATE_LAB_PENDING,
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
                type: LAB_CREATED,
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
            type: ERROR_IN_LAB_CREATE,
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
        type: UPDATE_LAB_PENDING,
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
                type: LAB_UPDATED,
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
            type: ERROR_IN_LAB_UPDATE,
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
        type: DELETE_LAB_PENDING,
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
                type: LAB_DELETED,
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
            type: ERROR_IN_LAB_DELETE,
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
        payload: 'assembly'
    });
    fetch('/api/assembly/')
    .then(resp => resp.json())
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
    }))
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
    fetch('/api/assembly/labs?action=getAll')
    .then(resp => resp.json())
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
    }))
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
    fetch('/api/assembly/students?action=getAll')
    .then(resp => resp.json())
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
    }))
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