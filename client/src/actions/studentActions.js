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
import { safeFetch } from './utils';

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

        safeFetch('/api/students/' + studentID + '?part=' + part)
            .then(data => {
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
                dispatch({
                    type: ERROR_IN_STUDENT_AUTH,
                    payload: {
                        message: err.message,
                        fetch: 'profile'
                    }
                });
                reject(err);
            });
    });
};

/**
 * Fetch avabile laboratories for a specific class
 * @param {string} classLabel 
 * @public
 */
export const fetchAvabileLabs = classLabel => dispatch => {

    dispatch({
        type: FETCH_STUDENT_PENDING,
        payload: 'labs_avabile'
    });

    return new Promise((resolve, reject) => {
        safeFetch('/api/students/labs?classLabel=' + classLabel)
            .then(data => {
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
                dispatch({
                    type: ERROR_IN_STUDENT_LABS_FETCH,
                    payload: {
                        message: err.message,
                        fetch: 'labs_avabile'
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
export const subscribeLabs = (studentID, labs) => dispatch => {

    dispatch({
        type: UPDATE_STUDENT_LABS_PENDING,
        payload: 'subscribe'
    });

    return new Promise((resolve, reject) => {
        safeFetch('/api/students/' + studentID + '/labs', {
            method: 'POST',
            headers: new Headers({
                "Content-Type": "application/json",
            }),
            body: JSON.stringify(labs)
        })
            .then(data => {
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
                dispatch({
                    type: ERROR_IN_STUDENT_LABS_UPDATE,
                    payload: {
                        message: err.message,
                        fetch: 'subscribe'
                    }
                });
                reject(err);
            });
    });
};