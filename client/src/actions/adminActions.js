import {
    AUTH_ADMIN_PENDING,
    ADMIN_AUTHED, 
    ERROR_IN_ADMIN_AUTH,
    ADMIN_LOGOUT
} from '../actions/types';

/**
 * Authenticate user
 * @param {string} password 
 * @param {function} callback 
 * @public
 */
export const authAdmin = (password, callback) => dispatch => {
    dispatch({
        type: AUTH_ADMIN_PENDING,
        payload: 'auth'
    });
    fetch('/api/admins/auth', {
        method: 'POST',
        headers: new Headers({
            "Content-Type": "application/json",
        }),
        body: JSON.stringify({ password })
    })
    .then(res => res.json())
    .then(data => {
        callback(null, data);
        switch (data.code) {
            case -1:
                dispatch({
                    type: ERROR_IN_ADMIN_AUTH,
                    payload: data.message
                });
                break;
            case 1:
                dispatch({
                    type: ADMIN_AUTHED,
                    payload: data
                });
                break;
            default:
                dispatch({
                    type: ERROR_IN_ADMIN_AUTH,
                    payload: 'Errore non riconosciuto (student)'
                });
                break;
        }
    })
    .catch(error => {
        dispatch({
            type: ERROR_IN_ADMIN_AUTH,
            payload: {
                message: error.message,
                fetch: 'auth'
            }
        });
        callback(error, null);
    });
}

/**
 * Logout
 * @public
 */
export const logout = () => dispatch => dispatch({
    type: ADMIN_LOGOUT,
    payload: null
});