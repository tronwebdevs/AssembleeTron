import {
    AUTH_ADMIN_PENDING,
    ADMIN_AUTHED, 
    ERROR_IN_ADMIN_AUTH,
    ADMIN_LOGOUT,
    UPDATE_ADMIN_TOKEN
} from '../actions/types';

const initialState = {
    authed: false,
    pendings: {},
    token: null
}

export default function (state = initialState, { type, payload }) {
    switch(type) {
        case AUTH_ADMIN_PENDING:
            return {
                ...state,
                pendings: {
                    ...state.pendings,
                    [payload]: true
                }
            }
        case ADMIN_AUTHED:
            return {
                ...state,
                authed: true,
                token: payload.token,
                pendings: {
                    ...state.pendings,
                    auth: false
                }
            }
        case UPDATE_ADMIN_TOKEN:
            return {
                ...state,
                token: payload
            };
        case ERROR_IN_ADMIN_AUTH:
            return {
                ...state,
                pendings: {
                    ...state.pendings,
                    [payload.fetch]: false
                }
            }
        case ADMIN_LOGOUT:
            return initialState;
        default:
            return state;
    }
}

