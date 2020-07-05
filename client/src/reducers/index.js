import { combineReducers } from 'redux';
import studentReducer from './studentReducer';
import assemblyReducer from './assemblyReducer';
import adminReducer from './adminReducer';
import preferencesReducer from './preferencesReducer';

export default combineReducers({
	student: studentReducer,
	assembly: assemblyReducer,
    admin: adminReducer,
    preferences: preferencesReducer
});
