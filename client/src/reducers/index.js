import { combineReducers } from 'redux';
import studentReducer from './studentReducer';
import assemblyReducer from './assemblyReducer';

export default combineReducers({
    student: studentReducer,
    assembly: assemblyReducer
});