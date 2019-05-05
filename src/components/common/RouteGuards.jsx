import locationHelperBuilder from 'redux-auth-wrapper/history4/locationHelper';
import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect';
import { createBrowserHistory } from 'history';
import LoadingScreen from './LoadingScreen'; // change it to your custom component

const locationHelper = locationHelperBuilder({});
const browserHistory = createBrowserHistory();

export const Authenticated = connectedRouterRedirect({
	wrapperDisplayName: 'Authenticated',
	AuthenticatingComponent: LoadingScreen,
	allowRedirectBack: true,
	redirectPath: (state, ownProps) => locationHelper.getRedirectQueryParam(ownProps) || '/login',
	authenticatingSelector: ({ firebase: { auth, isInitializing } }) => !auth.isLoaded || isInitializing === true,
	authenticatedSelector: ({ firebase: { auth } }) => auth.isLoaded && !auth.isEmpty,
	redirectAction: (newLoc) => {
		browserHistory.replace(newLoc);
		return { type: 'UNAUTHED_REDIRECT' };
	},
});

export const UserIsNotAuthenticated = connectedRouterRedirect({
	wrapperDisplayName: 'UserIsNotAuthenticated',
	AuthenticatingComponent: LoadingScreen,
	allowRedirectBack: false,
	redirectPath: (state, ownProps) => locationHelper.getRedirectQueryParam(ownProps) || '/dashboard',
	authenticatingSelector: ({ firebase: { auth, isInitializing } }) => !auth.isLoaded || isInitializing === true,
	authenticatedSelector: ({ firebase: { auth } }) => auth.isLoaded && auth.isEmpty,
	redirectAction: (newLoc) => {
		browserHistory.replace(newLoc);
		return { type: 'UNAUTHED_REDIRECT' };
	},
});
