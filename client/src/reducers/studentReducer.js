import { 
    STUDENT_SUBS,
    STUDENT_IS_PART,
    STUDENT_NOT_PART,
    STUDENT_WAS_PART,
    ERROR_IN_STUDENT_AUTH,
    FETCH_STUDENT_PENDING
} from '../actions/types.js';

const initialState = {
    profile: {},
    labs: [],
    labs_available: [],
    errors: {},
    fetch_pending: {}
}

export default function(state = initialState, action) {
    const { payload, type } = action;
    switch(type) {
        case FETCH_STUDENT_PENDING:
            return {
                ...state,
                fetch_pending: payload
            }
        case STUDENT_SUBS:
            return {
                ...state,
                profile: payload.student,
                labs_available: payload.labs,
                fetch_pending: {
                    profile: false
                }
            };
        case STUDENT_IS_PART:
            return {
                ...state,
                profile: payload.student,
                labs: payload.labs,
                fetch_pending: {
                    profile: false
                }
            }
        case STUDENT_NOT_PART:
        case STUDENT_WAS_PART:
            return {
                ...state,
                profile: payload.student,
                labs: [ -1, -1, -1, -1 ],
                fetch_pending: {
                    profile: false
                }
            };
        case ERROR_IN_STUDENT_AUTH:
            return {
                ...state,
                errors: payload.error,
                fetch_pending: {}
            }
        default:
            return state;
    }
}