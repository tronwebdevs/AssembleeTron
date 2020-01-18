import {
    AUTH_ADMIN_PENDING,
    ADMIN_AUTHED, 
    ERROR_IN_ADMIN_AUTH,
    ADMIN_LOGOUT,
    AUTH_SUDOER_PENDING,
    SUDOER_AUTHED,
    ERROR_IN_SUDOER_AUTH
} from '../actions/types';
import axios from 'axios';

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
        axios.post('/api/admins/auth', { password })
            .then(({ data }) => {
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
                const { response } = err;
                if (response && response.data && response.data.message) {
                    err.message = response.data.message;
                }
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

export const authSudoer = password => dispatch => {

    dispatch({
        type: AUTH_SUDOER_PENDING,
        payload: 'sudoer_auth'
    });

    return new Promise((resolve, reject) => {
        axios.post('/api/admins/auth_sudoer', { password })
            .then(({ data }) => {
                if (data.code === 1) {
                    dispatch({
                        type: SUDOER_AUTHED,
                        payload: data
                    });
                    resolve();
                } else {
                    throw new Error(data.message || 'Errore non riconosciuto (autenticazione)');
                }
            })
            .catch(err => {
                const { response } = err;
                if (response && response.data && response.data.message) {
                    err.message = response.data.message;
                }
                dispatch({
                    type: ERROR_IN_SUDOER_AUTH,
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