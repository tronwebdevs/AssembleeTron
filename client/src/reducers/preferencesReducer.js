import { SWITCH_THEME } from '../actions/types';

const initialState = {
    theme: 'none'
};

export default function(state = initialState, { type, payload }) {
    switch (type) {
        case SWITCH_THEME:
            return {
                ...state,
                theme: payload
            }
        default:
            return state;
    }
};