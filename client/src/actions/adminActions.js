import {
    AUTH_ADMIN_PENDING,
    ADMIN_AUTHED, 
    ERROR_IN_ADMIN_AUTH
} from '../actions/types';

export const authAdmin = (username, password, callback) => dispatch => {
    dispatch({
        type: AUTH_ADMIN_PENDING,
        payload: {
            auth: true
        }
    });
    fetch('/api/admins/auth', {
        method: 'POST',
        headers: new Headers({
            "Content-Type": "application/json",
        }),
        body: JSON.stringify({
            username, password
        })
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
                fetch_error: error.message
            }
        });
        callback(error, null);
    });
}