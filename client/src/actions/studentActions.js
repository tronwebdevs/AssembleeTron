import {
    STUDENT_SUBS,
    STUDENT_IS_PART,
    STUDENT_NOT_PART,
    STUDENT_WAS_PART,
    STUDENT_SUBED,
    UPDATE_STUDENT_LABS,
    ERROR_IN_STUDENT_AUTH,
    ERROR_IN_STUDENT_LABS_UPDATE,
    FETCH_STUDENT_PENDING
} from '../actions/types.js';

export const authStudent = (studentID, part, callback) => dispatch => {
    dispatch({
        type: FETCH_STUDENT_PENDING,
        payload: {
            profile: true
        }
    });
    fetch('api/students/' + studentID + '?part=' + part)
    .then(res => res.json())
    .then(data => {
        callback(null, data);
        switch (data.code) {
            case -1:
                dispatch({
                    type: ERROR_IN_STUDENT_AUTH,
                    payload: {
                        auth_error: data.message
                    }
                });
                break;
            case 1:
                dispatch({
                    type: STUDENT_SUBS,
                    payload: data
                });
                break;
            case 2: 
                dispatch({
                    type: STUDENT_NOT_PART,
                    payload: data
                });
                break;
            case 3: 
                dispatch({
                    type: STUDENT_WAS_PART,
                    payload: data
                });
                break;
            case 4: 
                dispatch({
                    type: STUDENT_IS_PART,
                    payload: data
                });
                break;
            default:
                dispatch({
                    type: ERROR_IN_STUDENT_AUTH,
                    payload: {
                        gen_error: 'Errore non riconosciuto (student)'
                    }
                });
                break;
        }
    })
    .catch(error => {
        dispatch({
            type: ERROR_IN_STUDENT_AUTH,
            payload: {
                fetch_error: error.message
            }
        });
        callback(error, null);
    });
}

export const subscribeLabs = (studentID, labs, callback) => dispatch => {
    dispatch({
        type: UPDATE_STUDENT_LABS,
        payload: {
            subscribe: true
        }
    });
    fetch('api/students/' + studentID + '/labs', {
        method: 'POST',
        headers: new Headers({
            "Content-Type": "application/json",
        }),
        body: JSON.stringify(labs)
    })
    .then(res => res.json())
    .then(data => {
        callback(null, data);
        if (data.code === -1) {
            dispatch({
                type: ERROR_IN_STUDENT_LABS_UPDATE,
                payload: {
                    auth_error: data.message
                }
            });
        } else if (data.code === 1) {
            dispatch({
                type: STUDENT_SUBED,
                payload: data
            });
        } else {
            dispatch({
                type: ERROR_IN_STUDENT_LABS_UPDATE,
                payload: {
                    gen_error: 'Errore non riconosciuto (student)'
                }
            });
        }
    })
    .catch(error => {
        dispatch({
            type: ERROR_IN_STUDENT_LABS_UPDATE,
            payload: {
                fetch_error: error.message
            }
        });
        callback(error, null);
    });
}