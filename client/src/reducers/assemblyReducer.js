import {
    FETCH_ASSEMBLY_PENDING,
	ASSEMBLY_FETCHED,
    ERROR_IN_ASSEMBLY_FETCH,
    
    REQUEST_ASSEMBLY_BACKUP,
    ASSEMBLY_BACKUP_COMPLETED,
    ERROR_IN_ASSEMBLY_BACKUP,

    REQUEST_ASSEMBLY_LOAD,
    ASSEMBLY_LOAD_COMPLETED,
    ERROR_IN_ASSEMBLY_LOAD,

	DELETE_ASSEMBLY_PENDING,
	ASSEMBLY_DELETED,
	ERROR_IN_ASSEMBLY_DELETE,

	FETCH_INFO_PENDING,
	ASSEMBLY_SUBS_CLOSE,
	ASSEMBLY_SUBS_OPEN,
	ASSEMBLY_NOT_AVABILE,
	ERROR_IN_INFO_FETCH,

	CREATE_INFO_PENDING,
	INFO_CREATED,
	ERROR_IN_INFO_CREATE,

	UPDATE_INFO_PENDING,
	INFO_UPDATED,
	ERROR_IN_INFO_UPDATE,

	FETCH_LABS_PENDING,
	LABS_FETCHED,
	ERROR_IN_LABS_FETCH,

	CREATE_LAB_PENDING,
	LAB_CREATED,
	ERROR_IN_LAB_CREATE,

	UPDATE_LAB_PENDING,
	LAB_UPDATED,
	ERROR_IN_LAB_UPDATE,

	DELETE_LAB_PENDING,
	LAB_DELETED,
	ERROR_IN_LAB_DELETE,

	FETCH_STUDENTS_PENDING,
	STUDENTS_FETCHED,
	ERROR_IN_STUDENTS_FETCH,
} from '../actions/types.js';


const initialState = {
    exists: false,
    info: {},
    labs: [],
    stats: {
        labs: 0,
        students: 0,
        subs: 0
    },
	students: [],
    pendings: {}
};

export default function (state = initialState, { payload, type }) {
    switch (type) {
        case FETCH_ASSEMBLY_PENDING:
        case DELETE_ASSEMBLY_PENDING:
        case REQUEST_ASSEMBLY_BACKUP:
        case REQUEST_ASSEMBLY_LOAD:
        case FETCH_INFO_PENDING:
        case CREATE_INFO_PENDING:
        case UPDATE_INFO_PENDING:
        case FETCH_LABS_PENDING:
        case CREATE_LAB_PENDING:
        case UPDATE_LAB_PENDING:
        case DELETE_LAB_PENDING:
        case FETCH_STUDENTS_PENDING:
            return {
                ...state,
                pendings: {
                    ...state.pendings,
                    [payload]: true
                }
            };
        case ASSEMBLY_BACKUP_COMPLETED:
            return {
                ...state,
                pendings: {
                    ...state.pendings,
                    backup: false
                }
            };
        case ASSEMBLY_LOAD_COMPLETED:
            return {
                ...state,
                exists: true,
				info: payload.info,
				labs: payload.labs || [],
				stats: {
                    ...state.stats,
					labs: (payload.labs || []).length
				},
                pendings: {
                    ...state.pendings,
                    load: false
                }
            };
		case ASSEMBLY_FETCHED:
		case ERROR_IN_ASSEMBLY_FETCH:
			return {
				...state,
				exists: payload.exists || state.exists,
				info: payload.info || {},
				labs: payload.labs || [],
				students: payload.students || [],
				stats: {
					labs: (payload.labs || []).length,
					students: (payload.students || []).length,
					subs: (payload.students || []).filter(std => std.labs !== null).length
				},
				pendings: {
					...state.pendings,
					assembly: false
				}
			};
		case ASSEMBLY_DELETED:
			return {
				...initialState,
				exists: false,
				info: {
					deleted: true
				},
				students: state.students,
				stats: {
					...initialState.stats,
					students: state.stats.students
				},
				pendings: {
					...state.pendings,
					delete_assembly: false
				}
			};
		case ASSEMBLY_SUBS_CLOSE:
		case ASSEMBLY_SUBS_OPEN:
			return {
				...state,
                exists: true,
                info: payload,
                pendings: {
                    ...state.pendings,
                    info: false
                }
			};
		case ASSEMBLY_NOT_AVABILE:
			return {
				...state,
				exists: false,
				pendings: {
                    ...state.pendings,
                    info: false
                }
			};
		case INFO_CREATED:
			return {
				...state,
				exists: true,
				info: payload,
				pendings: {
					...state.pendings,
					create_info: false
                }
			};
		case INFO_UPDATED:
			return {
				...state,
				info: payload,
				pendings: {
					...state.pendings,
					update_info: false
				}
			};
		case LABS_FETCHED:
			return {
				...state,
				labs: payload,
				stats: {
					...state.stats,
					labs: payload.length
				},
				pendings: {
					...state.pendings,
					labs: false
				}
			};
		case LAB_CREATED:
			return {
				...state,
				labs: payload,
				stats: {
					...state.stats,
					labs: payload.length
				},
                pendings: {
                    ...state.pendings,
                    create_lab: false
                }
			};
		case LAB_UPDATED:
			return {
				...state,
				labs: payload,
                pendings: {
                    ...state.pendings,
                    update_lab: false
                }
			};
		case LAB_DELETED:
			return {
				...state,
				labs: payload,
				stats: {
					...state.stats,
					labs: payload.length
				},
                pendings: {
                    ...state.pendings,
                    delete_lab: false
                }
			};
		case STUDENTS_FETCHED:
			return {
                ...state,
				students: payload,
				stats: {
					...state.stats,
					students: payload.length
				},
                pendings: {
                    ...state.pendings,
                    students: false
                }
			};
        case ERROR_IN_ASSEMBLY_DELETE:
        case ERROR_IN_ASSEMBLY_BACKUP:
        case ERROR_IN_ASSEMBLY_LOAD:
		case ERROR_IN_INFO_FETCH:
		case ERROR_IN_INFO_CREATE:
		case ERROR_IN_INFO_UPDATE:
		case ERROR_IN_LABS_FETCH:
		case ERROR_IN_LAB_CREATE:
		case ERROR_IN_LAB_UPDATE:
		case ERROR_IN_LAB_DELETE:
		case ERROR_IN_STUDENTS_FETCH:
            return {
                ...state,
                pendings: {
                    ...state.pendings,
                    [payload.fetch]: false
                }
			};
        default:
            return state;
    }
};