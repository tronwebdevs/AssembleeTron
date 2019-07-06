import {
    FETCH_ASSEMBLY_INFO,
    ASSEMBLY_SUBS_CLOSE,
    ASSEMBLY_SUBS_OPEN,
    ASSEMBLY_NOT_AVABILE,
    ERROR_IN_ASSEMBLY_FETCH,

    FETCH_ASSEMBLY_LABS,
    ASSEMBLY_LABS_FETCHED,
    ERROR_IN_LABS_FETCH,

    FETCH_ASSEMBLY_STUDENTS,
    ASSEMBLY_STUDENTS_FETCHED,
    ERROR_IN_STUDENTS_FETCH,

    UPDATE_ASSEMBLY_INFO,
    ASSEMBLY_INFO_UPDATED,
    ERROR_IN_ASSEMBLY_INFO_UPDATE,

    CREATE_ASSEMBLY_LAB,
    ASSEMBLY_LAB_CREATED,
    ERROR_IN_ASSEMBLY_LAB_CREATE,
    
    UPDATE_ASSEMBLY_LAB,
    ASSEMBLY_LAB_UPDATED,
    ERROR_IN_ASSEMBLY_LAB_UPDATE,

    DELETE_ASSEMBLY_LAB,
    ASSEMBLY_LAB_DELETED,
    ERROR_IN_ASSEMBLY_LAB_DELETE,
    
    FETCH_ASSEMBLY_PENDING,
    FETCH_ASSEMBLY_DONE,

    DELETE_ASSEMBLY,
    ASSEMBLY_DELETED,
    ERROR_IN_ASSEMBLY_DELETE
} from '../actions/types.js';


const initialState = {
    info: {},
    labs: [],
    stats: {
        labs: 0,
        students: 0,
        subs: 0
    },
    students: [],
    error: '',
    fetch_pending: {}
};

export default function (state = initialState, { payload, type }) {
    switch (type) {
        case FETCH_ASSEMBLY_STUDENTS:
        case FETCH_ASSEMBLY_INFO:
        case FETCH_ASSEMBLY_LABS:
        case UPDATE_ASSEMBLY_INFO:
        case CREATE_ASSEMBLY_LAB:
        case UPDATE_ASSEMBLY_LAB:
        case DELETE_ASSEMBLY_LAB:
        case FETCH_ASSEMBLY_PENDING:
        case DELETE_ASSEMBLY:
            return {
                ...state,
                fetch_pending: {
                    ...state.fetch_pending,
                    [payload]: true
                }
            };
        case ASSEMBLY_SUBS_CLOSE:
        case ASSEMBLY_NOT_AVABILE:
        case ERROR_IN_ASSEMBLY_FETCH:
            return {
                ...state,
                error: payload.message,
                fetch_pending: {
                    ...state.fetch_pending,
                    info: false
                }
            };
        case ASSEMBLY_SUBS_OPEN:
            return {
                ...state,
                info: payload,
                fetch_pending: {
                    ...state.fetch_pending,
                    info: false
                }
            };
        case ASSEMBLY_LAB_DELETED:
            return {
                ...state,
                labs: payload,
                fetch_pending: {
                    ...state.fetch_pending,
                    delete_lab: false
                }
            };
        case ASSEMBLY_LABS_FETCHED:
            return {
                ...state,
                labs: payload,
                fetch_pending: {
                    ...state.fetch_pending,
                    labs: false
                }
            };
        case ASSEMBLY_INFO_UPDATED:
            return {
                ...state,
                info: payload,
                fetch_pending: {
                    ...state.fetch_pending,
                    update_info: false
                }
            };
        case ASSEMBLY_STUDENTS_FETCHED:
            return {
                ...state,
                students: payload,
                fetch_pending: {
                    ...state.fetch_pending,
                    students: false
                }
            };
        case FETCH_ASSEMBLY_DONE:
            return {
                ...state,
                info: payload.info,
                stats: {
                    labs: payload.labsCount,
                    students: payload.stdCount,
                    subs: payload.subsCount
                },
                fetch_pending: {
                    ...state.fetch_pending,
                    admin_dashboard: false
                }
            };
        case ASSEMBLY_LAB_CREATED:
            return {
                ...state,
                labs: payload,
                fetch_pending: {
                    ...state.fetch_pending,
                    create_lab: false
                }
            };
        case ASSEMBLY_LAB_UPDATED:
            return {
                ...state,
                labs: payload,
                fetch_pending: {
                    ...state.fetch_pending,
                    update_lab: false
                }
            };
        case ASSEMBLY_DELETED:
            return {
                ...initialState,
                info: {
                    deleted: true
                },
                students: state.students,
                stats: {
                    ...initialState.stats,
                    students: state.stats.students
                },
                fetch_pending: {
                    delete_assembly: false
                }
            };
        case ERROR_IN_STUDENTS_FETCH:
        case ERROR_IN_ASSEMBLY_INFO_UPDATE:
        case ERROR_IN_ASSEMBLY_LAB_CREATE:
        case ERROR_IN_ASSEMBLY_LAB_UPDATE:
        case ERROR_IN_ASSEMBLY_LAB_DELETE:
        case ERROR_IN_LABS_FETCH:
        case ERROR_IN_ASSEMBLY_DELETE:
            return {
                ...state,
                error: payload.message,
                fetch_pending: {
                    ...state.fetch_pending,
                    [payload.fetch]: false
                }
            };
        default:
            return state;
    }
}