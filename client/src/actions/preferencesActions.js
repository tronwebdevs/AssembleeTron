import { SWITCH_THEME } from './types';
import store from '../store';

export const switchTheme = () => dispatch => {

    const currentTheme = store.getState().preferences.theme;

    dispatch({
        type: SWITCH_THEME,
        payload: currentTheme === 'light' ? 'dark' : 'light'
    });
};