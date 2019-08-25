import { 
    STUDENT_SUBS,
    STUDENT_IS_PART,
    STUDENT_NOT_PART,
    STUDENT_WAS_PART,
    STUDENT_SUBED,
    UPDATE_STUDENT_LABS_PENDING,
    STUDENT_LABS_FETCHED,
    ERROR_IN_STUDENT_AUTH,
    ERROR_IN_STUDENT_LABS_UPDATE,
    ERROR_IN_STUDENT_LABS_FETCH,
    FETCH_STUDENT_PENDING
} from '../actions/types.js';

const initialState = {
    profile: {
        ID: null,
        name: null,
        surname: null,
        classLabel: null
    },
    subscribed: false,
    labs: [],
    labs_avabile: [],
    pendings: {},
    error: null
}

export default function(state = initialState, { payload, type }) {
    switch(type) {
        case UPDATE_STUDENT_LABS_PENDING:
        case FETCH_STUDENT_PENDING:
            return {
                ...state,
                pendings: {
                    ...state.pendings,
                    [payload]: true
                }
			};
        case STUDENT_LABS_FETCHED:
            return {
                ...state,
                labs_avabile: payload.labs,
                pendings: {
                    ...state.pendings,
                    labs_avabile: false
                },
                error: initialState.error
            };
        case STUDENT_SUBS:
            return {
                ...state,
                profile: payload.student,
                subscribed: false,
                labs_avabile: payload.labs,
                pendings: {
					...state.pendings,
                    profile: false
                },
                error: initialState.error
            };
        case STUDENT_IS_PART:
            return {
                ...state,
                profile: payload.student,
                subscribed: true,
                labs: payload.labs,
                pendings: {
					...state.pendings,
                    profile: false
                },
                error: initialState.error
            };
        case STUDENT_NOT_PART:
        case STUDENT_WAS_PART:
            return {
                ...state,
                profile: payload.student,
                subscribed: false,
                labs: [ -1, -1, -1, -1 ],
                pendings: {
					...state.pendings,
                    profile: false
                },
                error: initialState.error
            };
        case STUDENT_SUBED:
            return {
                ...state,
                subscribed: true,
                labs: payload.labs,
                labs_avabile: initialState.labs_avabile,
                pendings: {
					...state.pendings,
                    subscribe: false
                },
                error: initialState.error
            };
        case ERROR_IN_STUDENT_LABS_FETCH:
        case ERROR_IN_STUDENT_LABS_UPDATE:
        case ERROR_IN_STUDENT_AUTH:
            return {
                ...state,
                error: payload.message,
                pendings: {
                    ...state.pendings,
                    [payload.fetch]: false
                }
			};
        default:
            return state;
    }
}
