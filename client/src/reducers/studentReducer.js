import { 
    STUDENT_SUBS,
    STUDENT_IS_PART,
    STUDENT_NOT_PART,
    STUDENT_WAS_PART,
    ERROR_IN_STUDENT_AUTH
} from '../actions/types.js';

const initialState = {
    profile: {},
    labs: [],
    labs_available: [],
    errors: {},
    authed: false
}

export default function(state = initialState, action) {
    const { payload, type } = action;
    switch(type) {
        case STUDENT_SUBS:
            return {
                ...state,
                profile: payload.student,
                labs_available: payload.labs,
                authed: true
            };
        case STUDENT_IS_PART:
            return {
                ...state,
                profile: payload.student,
                labs: payload.labs,
                authed: true
            }
        case STUDENT_NOT_PART:
        case STUDENT_WAS_PART:
            return {
                ...state,
                profile: payload.student,
                labs: [ -1, -1, -1, -1 ],
                authed: true
            };
        case ERROR_IN_STUDENT_AUTH:
            return {
                ...state,
                errors: payload.error
            }
        default:
            return state;
    }
}