import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import firebase from 'firebase/app';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { createFirestoreInstance } from 'redux-firestore';

import Routes from './pages/routes';
import store from './store/index';
import { DUMMY_PROFILE_PICTURE, PROFILE_PICTURE_PATH } from './constants/index';
import { register } from './serviceWorker';

register();

const rrfConfig = {
	userProfile: 'users',
	attachAuthIsReady: true,
	firebaseStateName: 'firebase',
	profileFactory: (userData, profileData) => {
		console.log('up', userData, profileData);
		const { username, email } = profileData;

		return {
			email,
			username,
			profilePicture: `${PROFILE_PICTURE_PATH}${DUMMY_PROFILE_PICTURE}?alt=media`,
			testing: 'abcd',
		};
	},
	useFirestoreForProfile: true,
};

const rrfProps = {
	firebase,
	config: rrfConfig,
	dispatch: store.dispatch,
	createFirestoreInstance,
};

ReactDOM.render(
	<Provider store={store}>
		<ReactReduxFirebaseProvider {...rrfProps}>
			<BrowserRouter>
				<Routes />
			</BrowserRouter>
		</ReactReduxFirebaseProvider>
	</Provider>,
	document.querySelector('#root'),
);
