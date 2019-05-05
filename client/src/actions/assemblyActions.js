import {
    ASSEMBLY_SUBS_CLOSE,
    ASSEMBLY_SUBS_OPEN,
    ASSEMBLY_NOT_AVABILE,
    ASSEMBLY_ERROR,
    FETCH_ASSEMBLY_LABS
} from '../actions/types.js';

export const fetchAssemblyInfo = () => dispatch => {
    fetch('api/assembly/info')
    .then(resp => resp.json())
    .then(data => {
        switch (data.code) {
            case 0:
                dispatch({
                    type: ASSEMBLY_NOT_AVABILE,
                    payload: {
                        message: data.message
                    }
                });
                break;
            case 1:
                dispatch({
                    type: ASSEMBLY_SUBS_CLOSE,
                    payload: {
                        message: data.message
                    }
                });
                break;
            case 2:
                dispatch({
                    type: ASSEMBLY_SUBS_OPEN,
                    payload: data.info
                });
                break;
            case 3:
                dispatch({
                    type: ASSEMBLY_SUBS_CLOSE,
                    payload: {
                        message: data.message
                    }
                });
                break;
            default:
                dispatch({
                    type: ASSEMBLY_ERROR,
                    payload: {
                        message: 'Errore non riconosciuto (assembly)'
                    }
                });
                break;
        }
    })
    .catch(err => dispatch({
        type: ASSEMBLY_ERROR,
        payload: {
            message: err.message
        }
    }))
};

export const fetchLabsAvabile = classLabel => dispatch => {
    fetch('api/assembly/labs?classLabel=' + classLabel)
    .then(resp => resp.json())
    .then(data => {
        if (data.code === 1) {
            dispatch({
                type: FETCH_ASSEMBLY_LABS,
                payload: data.labList
            })
        } else {
            dispatch({
                type: ASSEMBLY_ERROR,
                payload: {
                    message: 'Errore inaspettato'
                }
            })
        }
    })
    .catch(err => dispatch({
        type: ASSEMBLY_ERROR,
        payload: {
            message: err.message
        }
    }))
};

export const fetchAllLabs = () => dispatch => {

};