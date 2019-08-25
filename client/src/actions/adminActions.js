import {
    AUTH_ADMIN_PENDING,
    ADMIN_AUTHED, 
    ERROR_IN_ADMIN_AUTH,
    ADMIN_LOGOUT
} from '../actions/types';
import { safeFetch } from './utils';

/**
 * Authenticate user
 * @param {string} password 
 * @public
 */
export const authAdmin = password => dispatch => {

    dispatch({
        type: AUTH_ADMIN_PENDING,
        payload: 'auth'
    });

    return new Promise((resolve, reject) => {
        safeFetch('/api/admins/auth', {
            method: 'POST',
            headers: new Headers({
                "Content-Type": "application/json",
            }),
            body: JSON.stringify({ password })
        })
            .then(data => {
                if (data.code === 1) {
                    dispatch({
                        type: ADMIN_AUTHED,
                        payload: data
                    });
                    resolve();
                } else {
                    throw new Error(data.message || 'Errore non riconosciuto (autenticazione)');
                }
            })
            .catch(err => {
                dispatch({
                    type: ERROR_IN_ADMIN_AUTH,
                    payload: {
                        message: err.message,
                        fetch: 'auth'
                    }
                });
                reject(err);
            });
    });
};

/**
 * Logout
 * @public
 */
export const logout = () => dispatch => dispatch({
    type: ADMIN_LOGOUT,
    payload: null
});