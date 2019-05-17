import * as React from 'react';
import PropTypes from 'prop-types';

import { compose } from 'redux';
import { withFirebase, actionTypes } from 'react-redux-firebase';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { Formik } from 'formik';
import * as Yup from 'yup';

import indigo from '@material-ui/core/colors/indigo';
import red from '@material-ui/core/colors/red';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';

import withRoot from '../../../withRoot';
import Alert from '../../../components/common/Alert';
import ChangePasswordForm from './ChangePasswordForm';
import { showNotification } from '../../../actions/notification';

const getChangePasswordFormSchema = (isCurrentPasswordRequired) => {
	const schema = {
		newPassword: Yup.string()
			.min(6, 'New Password must be 6 characters long')
			.required('Required'),
		confirmNewPassword: Yup.string()
			.min(6, 'New Password must be 6 characters long')
			.required('Required'),
	};

	if (isCurrentPasswordRequired) {
		schema.currentPassword = Yup.string()
			.required('Required');
	}

	return Yup.object().shape(schema);
};

const styles = () => createStyles({
	cardTitle: {
		color: indigo[900],
	},
});

class ChangePasswordPage extends React.Component {
	static propTypes = {
		dispatch: PropTypes.func.isRequired,
		firebase: PropTypes.any.isRequired,
		auth: PropTypes.object.isRequired,
		createNotification: PropTypes.func.isRequired,
		classes: PropTypes.object.isRequired,
	};

	state = {
		error: '',
		registeredProviders: [],
	};

	componentWillMount() {
		const {
			auth,
		} = this.props;

		this.setRegisteredProviders(auth);
	}

	componentWillReceiveProps(nextProps) {
		this.setRegisteredProviders(nextProps.auth);
	}

	setRegisteredProviders = (auth) => {
		if (auth) {
			console.log('auth', auth);
			const registeredProviders = auth.providerData.map(({ providerId }) => providerId);

			this.setState({
				registeredProviders,
			});
		}
	}

	validate = (formData) => {
		const {
			newPassword,
			confirmNewPassword,
		} = formData;
		const errors = {};

		if (newPassword && newPassword !== confirmNewPassword) {
			errors.confirmNewPassword = 'New Password and Confirm Password must match';
		}

		return errors;
	};

	getFBAccessToken = () => new Promise((resolve, reject) => {
		const token = window.FB.getAccessToken();

		if (token) {
			return resolve(token);
		}

		return window.FB.login((response) => {
			const {
				status,
				authResponse,
			} = response;

			if (status === 'connected') {
				return resolve(authResponse.accessToken);
			}

			const error = new Error('Please completed the Facebook login process to proceed');
			return reject(error);
		});
	});

	reAuthenticate = async (currentPassword) => {
		const {
			firebase,
		} = this.props;
		const {
			registeredProviders,
		} = this.state;
		const user = firebase.auth().currentUser;
		const hasPasswordProvider = registeredProviders.includes('password');
		let cred = null;

		if (hasPasswordProvider) {
			cred = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
		}
		else if (registeredProviders.includes('google.com')) {
			const googleUser = window.gapi.auth2.getAuthInstance().currentUser.get();
			const isSignedIn = window.gapi.auth2.getAuthInstance().isSignedIn.get();

			if (isSignedIn) {
				const idToken = googleUser.getAuthResponse().id_token;
				cred = firebase.auth.GoogleAuthProvider.credential(idToken);
			}
		}
		else if (registeredProviders.includes('facebook.com')) {
			const fbAccessToken = await this.getFBAccessToken();
			cred = firebase.auth.FacebookAuthProvider.credential(fbAccessToken);
		}

		if (!cred) {
			const error = new Error('Could not setup credentials for reauthentication');
			return Promise.reject(error);
		}

		return user.reauthenticateAndRetrieveDataWithCredential(cred);
	}

	submit = (formData, actions) => {
		const {
			firebase,
			createNotification,
			dispatch,
		} = this.props;
		const {
			registeredProviders,
		} = this.state;
		const {
			currentPassword,
			newPassword,
		} = formData;
		const hasPasswordProvider = registeredProviders.includes('password');
		const user = firebase.auth().currentUser;

		this.reAuthenticate(currentPassword)
			.then(() => {
				// if user does not have password provider we cannot update password directly
				if (hasPasswordProvider) {
					return user.updatePassword(newPassword);
				}

				// else we will have to create credential obj based on user's email and new password and link it
				// to logged in user's account
				const passwordCredentials = firebase.auth.EmailAuthProvider.credential(user.email, newPassword);

				return user.linkAndRetrieveDataWithCredential(passwordCredentials);
			})
			.then(() => {
				// notify react-redux-firebase about the change
				// it could be the case that user has signed up via google or facebook and then he/she wants to
				// link password to the account and in that case the auth stored in redux needs to get updated because it
				// will have old info regarding the like of providers that the account has
				const authJSON = firebase.auth().toJSON();
				const newUser = Object.assign({}, authJSON.currentUser);

				delete authJSON.currentUser;

				const newAuth = Object.assign({}, authJSON, newUser);

				dispatch({
					type: actionTypes.AUTH_UPDATE_SUCCESS,
					auth: newAuth,
				});

				createNotification('Password changed successfully');
			})
			.catch((error) => {
				const {
					code,
					message,
				} = error;
				const messages = {
					'auth/wrong-password': 'Your current  password is incorrect',
				};
				const errorMessage = messages[code] || message;

				this.setState({
					error: errorMessage,
				});

				createNotification(errorMessage);
			})
			.finally(() => {
				actions.setSubmitting(false);
			});
	};

	render() {
		const {
			classes,
			// firebase,
		} = this.props;
		const {
			error,
			registeredProviders = [],
		} = this.state;

		const hasPasswordProvider = registeredProviders.includes('password');

		return (
			<div className="profile-container container flex-grow-1 d-flex flex-column justify-content-center">
				<div className="row mb-3 justify-content-center">
					<Card className="col-10 col-md-5 px-3 w-100">
						<CardContent>
							<Typography
								gutterBottom
								variant="h5"
								component="h2"
								className={`text-center my-4 ${classes.cardTitle}`}
							>
								Change Password
							</Typography>

							<div className="mb-2">
								<Formik
									enableReinitialize
									initialValues={{ showCurrentPassword: hasPasswordProvider }}
									validate={this.validate}
									validationSchema={getChangePasswordFormSchema(hasPasswordProvider)}
									onSubmit={this.submit}
									component={ChangePasswordForm}
								/>
							</div>

							{
								!!error && (
									<div className="mb-3 pt-2 text-center">
										<Alert backgroundColor={red[500]}>
											<strong>Error: </strong>
											{error}
										</Alert>
									</div>
								)
							}
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}
}

const ChangePasswordPageWithRouter = withRouter(ChangePasswordPage);
const MaterializedChangePasswordPage = withRoot(withStyles(styles)(ChangePasswordPageWithRouter));

const mapDispatchToProps = (dispatch) => ({
	createNotification: (message) => dispatch(showNotification(message)),
});
const mapStateToProps = (state) => ({
	profile: state.firebase.profile,
	auth: state.firebase.auth,
});

export default compose(
	withFirebase,
	connect(mapStateToProps, mapDispatchToProps),
)(MaterializedChangePasswordPage);
