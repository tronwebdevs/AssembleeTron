import {
    STUDENT_SUBS,
    STUDENT_IS_PART,
    STUDENT_NOT_PART,
    STUDENT_WAS_PART,
    ERROR_IN_STUDENT_AUTH,
    FETCH_STUDENT_PENDING
} from '../actions/types.js';

export const authStudent = (studentID, part) => dispatch => {
    dispatch({
        type: FETCH_STUDENT_PENDING,
        payload: {
            profile: true
        }
    });
    fetch('api/students?studentID=' + studentID + '&part=' + part)
    .then(res => res.json())
    .then(data => {
        switch (data.code) {
            case -1:
                dispatch({
                    type: ERROR_IN_STUDENT_AUTH,
                    payload: {
                        auth_error: data.message
                    }
                });
                break;
            case 1:
                dispatch({
                    type: STUDENT_SUBS,
                    payload: data
                });
                break;
            case 2: 
                dispatch({
                    type: STUDENT_NOT_PART,
                    payload: data
                });
                break;
            case 3: 
                dispatch({
                    type: STUDENT_WAS_PART,
                    payload: data
                });
                break;
            case 4: 
                dispatch({
                    type: STUDENT_IS_PART,
                    payload: data
                });
                break;
            default:
                dispatch({
                    type: ERROR_IN_STUDENT_AUTH,
                    payload: {
                        gen_error: 'Errore non riconosciuto (student)'
                    }
                });
                break;
        }
    })
    .catch(error => {
        dispatch({
            type: ERROR_IN_STUDENT_AUTH,
            payload: {
                fetch_error: error.message
            }
        });
    });
}

// export const fetchLabs = () => (dispatch, getState) => {
//     const state = getState();
// }