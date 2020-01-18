import {
    AUTH_ADMIN_PENDING,
    ADMIN_AUTHED, 
    ERROR_IN_ADMIN_AUTH,
    ADMIN_LOGOUT,
    UPDATE_ADMIN_TOKEN,
    AUTH_SUDOER_PENDING,
    SUDOER_AUTHED,
    ERROR_IN_SUDOER_AUTH
} from '../actions/types';

const initialState = {
    authed: false,
    isSudo: false,
    pendings: {},
    token: null
}

export default function (state = initialState, { type, payload }) {
    switch(type) {
        case AUTH_ADMIN_PENDING:
        case AUTH_SUDOER_PENDING:
            return {
                ...state,
                pendings: {
                    ...state.pendings,
                    [payload]: true
                }
            };
        case ADMIN_AUTHED:
            return {
                ...state,
                authed: true,
                isSudo: state.isSudo,
                token: payload.token,
                pendings: {
                    ...state.pendings,
                    auth: false
                }
            };
        case SUDOER_AUTHED:
            return {
                ...state,
                authed: true,
                isSudo: true,
                token: payload.token,
                pendings: {
                    ...state.pendings,
                    audoer_auth: false
                }
            };
        case UPDATE_ADMIN_TOKEN:
            return {
                ...state,
                token: payload
            };
        case ERROR_IN_SUDOER_AUTH:
        case ERROR_IN_ADMIN_AUTH:
            return {
                ...state,
                pendings: {
                    ...state.pendings,
                    [payload.fetch]: false
                }
            };
        case ADMIN_LOGOUT:
            return {
                ...initialState,
                pendings: {
                    loggedout: false
                }
            };
        default:
            return state;
    }
}

