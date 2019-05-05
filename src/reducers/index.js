import { combineReducers } from 'redux';
import { firebaseReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore';
import { reducer as formReducer } from 'redux-form';
import notificationReducer from './notification';
import appBarReducer from './appBar';

const rootReducer = combineReducers({
	notification: notificationReducer,
	appBar: appBarReducer,
	firebase: firebaseReducer,
	firestore: firestoreReducer,
	form: formReducer,
});

export default rootReducer;
