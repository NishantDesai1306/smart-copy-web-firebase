import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

import firebaseConfig from '../config/firebase';
import rootReducer from '../reducers';

// initialize firebase instance
firebase.initializeApp(firebaseConfig);
firebase.firestore();
firebase.storage();

const store = createStore(
	rootReducer,
	applyMiddleware(thunk),
);

export default store;
