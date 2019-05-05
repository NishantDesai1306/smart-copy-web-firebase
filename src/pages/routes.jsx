import * as React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { SnackbarProvider, withSnackbar } from 'notistack';
import { connect } from 'react-redux';

import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import ForgotPassword from './ForgotPassword';
import Dashboard from './Dashboard';
import Profile from './Profile';
import { Authenticated, UserIsNotAuthenticated } from '../components/common/RouteGuards';
import { clearNotifications } from '../actions/notification';

const MAX_NOTIFICATIONS_IN_STACK = 3;
const NOTIFICATION_CHECK_FREQUENCY = 500;

class Routes extends React.Component {
	static propTypes = {
		notifications: PropTypes.arrayOf(PropTypes.string),
		enqueueSnackbar: PropTypes.func.isRequired,
		clearAllNotifications: PropTypes.func.isRequired,
	};

	static defaultProps = {
		notifications: [],
	};

	componentDidMount() {
		setInterval(() => {
			const {
				notifications,
				enqueueSnackbar,
				clearAllNotifications,
			} = this.props;

			const hasNotifications = notifications && notifications.length;

			notifications.forEach((message) => {
				enqueueSnackbar(message);
			});

			if (hasNotifications) {
				clearAllNotifications();
			}
		}, NOTIFICATION_CHECK_FREQUENCY);
	}

	render() {
		return (
			<Switch>
				<Route exact path="/" component={Home} />
				<Route exact path="/login" component={UserIsNotAuthenticated(Login)} />
				<Route exact path="/signup" component={UserIsNotAuthenticated(Signup)} />
				<Route exact path="/forgot-password" component={UserIsNotAuthenticated(ForgotPassword)} />
				<Route exact path="/dashboard/profile" component={Authenticated(Profile)} />
				<Route exact path="/dashboard" component={Authenticated(Dashboard)} />
			</Switch>
		);
	}
}

const mapStateToProps = (state) => ({
	notifications: state.notification.messages,
});

const mapDispatchToProps = (dispatch) => ({
	clearAllNotifications: () => dispatch(clearNotifications()),
});

const ConnectedRoutes = connect(mapStateToProps, mapDispatchToProps)(Routes);
const RoutesWithSnackbar = withSnackbar(ConnectedRoutes);

const IntegrationNotistack = () => (
	<SnackbarProvider maxSnack={MAX_NOTIFICATIONS_IN_STACK}>
		<RoutesWithSnackbar />
	</SnackbarProvider>
);

export default IntegrationNotistack;
