import { 
    STUDENT_SUBS,
    STUDENT_IS_PART,
    STUDENT_NOT_PART,
    STUDENT_WAS_PART,
    STUDENT_SUBED,
    UPDATE_STUDENT_LABS,
    ERROR_IN_STUDENT_AUTH,
    ERROR_IN_STUDENT_LABS_UPDATE,
    FETCH_STUDENT_PENDING
} from '../actions/types.js';

const initialState = {
    profile: {},
    labs: [],
    labs_avabile: [],
    fetch_pending: {},
    errors: ''
}

export default function(state = initialState, action) {
    const { payload, type } = action;
    switch(type) {
        case UPDATE_STUDENT_LABS:
        case FETCH_STUDENT_PENDING:
            return {
                ...state,
                fetch_pending: payload
            }
        case STUDENT_SUBS:
            return {
                ...state,
                profile: payload.student,
                labs_avabile: payload.labs,
                fetch_pending: {
					...state.fetch_pending,
                    profile: false
                }
            };
        case STUDENT_IS_PART:
            return {
                ...state,
                profile: payload.student,
                labs: payload.labs,
                fetch_pending: {
					...state.fetch_pending,
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
					...state.fetch_pending,
                    profile: false
                }
            };
        case STUDENT_SUBED:
            return {
                ...state,
                labs: payload.labs,
                fetch_pending: {
					...state.fetch_pending,
                    subscribe: false
                }
            }
        case ERROR_IN_STUDENT_LABS_UPDATE:
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
