import {
    AUTH_ADMIN_PENDING,
    ADMIN_AUTHED, 
    ERROR_IN_ADMIN_AUTH,
    ADMIN_LOGOUT
} from '../actions/types';

const initialState = {
    authed: false,
    fetch_pending: {}
}

export default function (state = initialState, { type, payload }) {
    switch(type) {
        case AUTH_ADMIN_PENDING:
            return {
                ...state,
                fetch_pending: {
                    ...state.fetch_pending,
                    [payload]: true
                }
            }
        case ADMIN_AUTHED:
            return {
                ...state,
                authed: true,
                fetch_pending: {
                    ...state.fetch_pending,
                    auth: false
                }
            }
        case ERROR_IN_ADMIN_AUTH:
            return {
                ...state,
                fetch_pending: {
                    ...state.fetch_pending,
                    [payload.fetch]: false
                }
            }
        case ADMIN_LOGOUT:
            return initialState;
        default:
            return state;
    }
}

