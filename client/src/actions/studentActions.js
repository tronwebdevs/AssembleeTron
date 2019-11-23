import {
    STUDENT_SUBS,
    STUDENT_IS_PART,
    STUDENT_NOT_PART,
    STUDENT_WAS_PART,
    STUDENT_SUBED,
    UPDATE_STUDENT_LABS_PENDING,
    STUDENT_LABS_FETCHED,
    ERROR_IN_STUDENT_AUTH,
    ERROR_IN_STUDENT_LABS_UPDATE,
    ERROR_IN_STUDENT_LABS_FETCH,
    FETCH_STUDENT_PENDING
} from '../actions/types.js';
import axios from 'axios';

/**
 * Authenticate student
 * @param {number} studentID 
 * @param {number} part
 * @public
 */
export const authStudent = (studentID, part) => dispatch => {

    dispatch({
        type: FETCH_STUDENT_PENDING,
        payload: 'profile'
    });

    return new Promise((resolve, reject) => {

        // Security check
        if (isNaN(studentID)) {
            let error = new Error('Identificativo studente errato');
            error.target = 'studentID';
            throw error;
        }
        if (isNaN(part)) {
            let error = new Error('Parametro di partecipazione errato');
            error.target = 'part';
            throw error;
        }

        axios.get('/api/students/' + studentID, {
            params: { part }
        })
            .then(({ data }) => {
                switch (data.code) {
                    case -1:
                        throw new Error(data.message);
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
                        throw new Error('Errore non riconosciuto (student)');
                }
                resolve();
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
                dispatch({
                    type: ERROR_IN_STUDENT_AUTH,
                    payload: {
                        message: err.message,
                        fetch: 'profile',
                        token: err.token
                    }
                });
                reject(err);
            });
    });
};

/**
 * Fetch avabile laboratories for a specific class
 * @param {string} section 
 * @public
 */
export const fetchAvabileLabs = section => (dispatch, getState) => {

    dispatch({
        type: FETCH_STUDENT_PENDING,
        payload: 'labs_avabile'
    });

    const authToken = getState().student.token;

    return new Promise((resolve, reject) => {
        axios.get('/api/students/labs', {
            params: { section },
            headers: { Authorization: `Bearer ${authToken}`}
        })
            .then(({ data }) => {
                if (data.code === 1) {
                    dispatch({
                        type: STUDENT_LABS_FETCHED,
                        payload: data
                    });
                    resolve();
                } else {
                    throw new Error(data.message || 'Errore non riconosciuto (laboratori disponibili)');
                }
            })
            .catch(err => {
                if (err.response && err.response.data && err.response.data.message) {
                    const { data } = err.response;
                    err.message = data.message;
                    err.token = data.token;
                }
                dispatch({
                    type: ERROR_IN_STUDENT_LABS_FETCH,
                    payload: {
                        message: err.message,
                        fetch: 'labs_avabile',
                        token: err.token
                    }
                });
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
export const subscribeLabs = (studentID, labs) => (dispatch, getState) => {

    dispatch({
        type: UPDATE_STUDENT_LABS_PENDING,
        payload: 'subscribe'
    });

    const authToken = getState().student.token;

    return new Promise((resolve, reject) => {
        axios.post('/api/students/' + studentID + '/labs', { labs }, {
            headers: { Authorization: `Bearer ${authToken}`}
        })
            .then(({ data }) => {
                if (data.code === 1) {
                    dispatch({
                        type: STUDENT_SUBED,
                        payload: data
                    });
                    resolve();
                } else {
                    let error;
                    error = new Error(data.message || 'Errore non riconosciuto (student)');
                    error.target = data.target || null;
                    throw error;
                }
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
                    err.token = data.token
                }
                dispatch({
                    type: ERROR_IN_STUDENT_LABS_UPDATE,
                    payload: {
                        message: err.message,
                        fetch: 'subscribe',
                        token: err.token
                    }
                });
                reject(err);
            });
    });
};