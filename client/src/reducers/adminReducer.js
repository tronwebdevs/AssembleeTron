import {
    AUTH_ADMIN_PENDING,
    ADMIN_AUTHED, 
    ERROR_IN_ADMIN_AUTH
} from '../actions/types';

const initialState = {
    id: -1,
    username: '',
    isSudoer: false,
    fetch_pending: {},
    error: ''
}

export default function (state = initialState, action) {
    const { type, payload } = action;
    switch(type) {
        case AUTH_ADMIN_PENDING:
            return {
                ...state,
                fetch_pending: payload
            }
        case ADMIN_AUTHED:
            return {
                ...state,
                id: payload.id,
                username: payload.username,
                isSudoer: payload.isSudoer,
                fetch_pending: {
                    auth: false
                }
            }
        case ERROR_IN_ADMIN_AUTH:
            return {
                ...state,
                error: payload,
                fetch_pending: {}
            }
        default:
            return state;
    }
}

