import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import { loadState, saveState } from './localStorage';

const initialState = {};
const persistentedState = loadState() || initialState;
const middleware = [thunk];
const store = createStore(
	rootReducer,
	persistentedState,
	compose(
		applyMiddleware(...middleware),
		...(window.__REDUX_DEVTOOLS_EXTENSION__
			? [window.__REDUX_DEVTOOLS_EXTENSION__()]
			: [])
	)
);

store.subscribe(() => {
	const { admin, student } = store.getState();
	saveState({
		admin,
		student: {
			...student,
			pendings: {},
			labs_avabile: []
		},
		assembly: {
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
		}
	});
});

export default store;
