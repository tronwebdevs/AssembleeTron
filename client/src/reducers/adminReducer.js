import {
    AUTH_ADMIN_PENDING,
    ADMIN_AUTHED, 
    ERROR_IN_ADMIN_AUTH,
    ADMIN_LOGOUT
} from '../actions/types';

const initialState = {
    authed: false,
    fetch_pending: {},
    error: null
}

export default function (state = initialState, { type, payload }) {
    switch(type) {
        case AUTH_ADMIN_PENDING:
            return {
                ...state,
                fetch_pending: {
                    ...state.fetch_pending,
                    [payload]: true
                },
                error: initialState.error
            }
        case ADMIN_AUTHED:
            return {
                ...state,
                authed: true,
                fetch_pending: {
                    ...state.fetch_pending,
                    auth: false
                },
                error: initialState.error
            }
        case ERROR_IN_ADMIN_AUTH:
            return {
                ...state,
                error: payload.message,
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

