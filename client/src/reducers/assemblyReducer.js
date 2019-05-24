import {
    FETCH_ASSEMBLY_SUBS_CLOSE,
    FETCH_ASSEMBLY_SUBS_OPEN,
    FETCH_ASSEMBLY_NOT_AVABILE,
    FETCH_ASSEMBLY_ERROR,
    FETCH_ASSEMBLY_LABS,
    FETCH_ASSEMBLY_AVABILE_LABS,
    FETCH_ASSEMBLY_PENDING,
    ASSEMBLY_CLEAR_PENDING
} from '../actions/types.js';

const initialState = {
    info: {},
    labs: [],
    error: '',
    fetch_pending: {}
};

export default function (state = initialState, action) {
    const { payload, type } = action;
    switch (type) {
        case FETCH_ASSEMBLY_PENDING:
            const keys = Object.keys(payload);
            return {
                ...state,
                fetch_pending: {
                    ...state.fetch_pending,
                    [keys[0]]: payload[keys[0]]
                }
            };
        case FETCH_ASSEMBLY_SUBS_CLOSE:
        case FETCH_ASSEMBLY_ERROR:
        case FETCH_ASSEMBLY_NOT_AVABILE:
            return {
                ...state,
                error: payload.message,
                fetch_pending: {
                    ...state.fetch_pending,
                    info: false
                }
            };
        case FETCH_ASSEMBLY_SUBS_OPEN:
            return {
                ...state,
                info: payload,
                fetch_pending: {
                    ...state.fetch_pending,
                    info: false
                }
            };
        case FETCH_ASSEMBLY_LABS:
            return {
                ...state,
                labs: payload,
                fetch_pending: {
                    ...state.fetch_pending,
                    labs: false
                }
            };
        case FETCH_ASSEMBLY_AVABILE_LABS: 
            return {
                ...state,
                avabile_labs: payload,
                fetch_pending: {
                    ...state.fetch_pending,
                    avabile_labs: false
                }
            };
        case ASSEMBLY_CLEAR_PENDING:
            return {
                ...state,
                fetch_pending: {}
            };
        default:
            return state;
    }
}