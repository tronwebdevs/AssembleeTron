import {
    ASSEMBLY_SUBS_CLOSE,
    ASSEMBLY_SUBS_OPEN,
    ASSEMBLY_NOT_AVABILE,
    ASSEMBLY_ERROR,
    FETCH_ASSEMBLY_LABS
} from '../actions/types.js';

const initialState = {
    info: {},
    labs: [],
    avabile_labs: [],
    error: {}
};

export default function (state = initialState, action) {
    const { payload, type } = action;
    switch (type) {
        case ASSEMBLY_SUBS_CLOSE:
        case ASSEMBLY_ERROR:
        case ASSEMBLY_NOT_AVABILE:
            return {
                ...state,
                error: {
                    info: payload.message
                }
            }
        case ASSEMBLY_SUBS_OPEN:
            return {
                ...state,
                info: payload
            }
        case FETCH_ASSEMBLY_LABS:
            return {
                ...state,
                avabile_labs: payload
            }
        default:
            return state;
    }
}