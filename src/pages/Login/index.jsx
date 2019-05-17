import * as React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withFirebase, actionTypes } from 'react-redux-firebase';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import classNames from 'classnames';
import * as Yup from 'yup';
import { Formik } from 'formik';

import Icon from '@material-ui/core/Icon';
import Indigo from '@material-ui/core/colors/indigo';
import Red from '@material-ui/core/colors/red';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';

import Alert from '../../components/common/Alert';
import withRoot from '../../withRoot';
import LoginForm from './LoginForm';

const LoginSchema = Yup.object().shape({
	password: Yup.string()
		.min(6, 'Password must be 6 characters long')
		.required('Required'),
	email: Yup.string()
		.email('Invalid email')
		.required('Required'),
});

const styles = () => createStyles({
	cardTitle: {
		color: Indigo[900],
	},
	googleButton: {
		backgroundColor: '#4285f4',
		color: 'white',
		'&:hover': {
			backgroundColor: '#376fcc',
		},
	},
	facebookButton: {
		backgroundColor: '#4267b2',
		color: 'white',
		'&:hover': {
			backgroundColor: '#284172',
		},
	},
});

class LoginPage extends React.Component {
	static propTypes = {
		dispatch: PropTypes.func.isRequired,
		firebase: PropTypes.object.isRequired,
		classes: PropTypes.object.isRequired,
		auth: PropTypes.object.isRequired,
	};

	state = {
		error: '',
	}

	submit = (data, actions) => {
		const {
			firebase,
		} = this.props;
		const {
			email,
			password,
		} = data;

		this.setState({
			error: '',
		});

		return firebase.login(
			{ email, password },
		)
			.catch((err) => {
				const {
					code,
					message,
				} = err;

				const errorMessage = {
					'auth/user-not-found': 'User not found',
				};

				this.setState({
					error: errorMessage[code] || message,
				});
			})
			.finally(() => {
				actions.setSubmitting(false);
			});
	};

	handleLoginThroughFacebook = () => {
		const {
			firebase,
			dispatch,
		} = this.props;

		this.setState({
			error: '',
		});

		firebase.login({ provider: 'facebook', type: 'popup' })
			.then(() => Promise.resolve())
			.catch(async (err) => {
				const {
					code,
					email,
					credential: fbCredentials,
				} = err;

				// in case fb login fails and if we get this error
				// usually this error happens if user is registered through google or registered account manually (don't know why this happens)
				// then we will have to first login through google or password and then link the fb profile to firebase user
				if (code === 'auth/account-exists-with-different-credential') {
					const methods = await firebase.auth().fetchSignInMethodsForEmail(email);
					const hasPasswordProvider = methods.includes('password');
					const hasGoogleProvider = methods.includes('google.com');

					try {
						// try google first because that's more easy for user
						if (hasGoogleProvider) {
							console.log('trying with google login');
							await firebase.login({ provider: 'google', type: 'popup' });

							console.log('google login success');

							return Promise.resolve(fbCredentials);
						}
					}
					catch (e) {
						if (hasPasswordProvider) {
							// ask for password and login through password and then resolve fbCredentials
						}
					}

					const loginError = new Error('Something went wrong, please try some other login method');
					return Promise.reject(loginError);
				}

				return Promise.reject(err);
			})
			.then(async (fbCredentials) => {
				// if fbCredential is null then it means that user successfully logged in through fb
				// so no need to do anything in that case
				if (fbCredentials) {
					const user = firebase.auth().currentUser;

					if (user) {
						await user.linkAndRetrieveDataWithCredential(fbCredentials);
					}

					const authJSON = firebase.auth().toJSON();
					const newUser = Object.assign({}, authJSON.currentUser);

					delete authJSON.currentUser;

					const newAuth = Object.assign({}, authJSON, newUser);

					dispatch({
						type: actionTypes.AUTH_UPDATE_SUCCESS,
						auth: newAuth,
					});
				}
			})
			.catch((err) => {
				const {
					message,
				} = err;

				this.setState({
					error: message,
				});
			});
	}

	render() {
		const {
			classes,
			firebase,
			auth,
		} = this.props;

		const {
			error,
		} = this.state;

		return (
			<div className="login-container container flex-grow-1 d-flex flex-column justify-content-center">
				<div className="row mb-3 justify-content-center">
					<Card className="col-10 col-md-5 px-3 w-100">
						<CardContent>
							<Typography
								gutterBottom
								variant="h5"
								component="h2"
								className={`text-center my-4 ${classes.cardTitle}`}
							>
								Login
							</Typography>

							<div className="my-2">
								<Formik
									validationSchema={LoginSchema}
									onSubmit={this.submit}
									component={LoginForm}
								/>
							</div>

							{
								!!error && (
									<div className="mb-3 pt-2 text-center">
										<Alert backgroundColor={Red[500]}>
											<strong>Error: </strong>
											{error}
										</Alert>
									</div>
								)
							}

							<hr className="my-4" />

							<Button
								size="large"
								variant="contained"
								className={`w-100 mb-4 ${classes.googleButton}`}
								disabled={!auth.isLoaded}
								onClick={() => firebase.login({ provider: 'google', type: 'popup' })}
							>
								<Icon className={classNames('fab fa-google mr-2')} />
								<span>
									Continue with Google
								</span>
							</Button>

							<Button
								size="large"
								variant="contained"
								className={`w-100 mb-2 ${classes.facebookButton}`}
								disabled={!auth.isLoaded}
								onClick={() => this.handleLoginThroughFacebook()}
							>
								<Icon className={classNames('fab fa-facebook mr-2')} />
								<span>
									Continue with Facebook
								</span>
							</Button>
						</CardContent>
					</Card>
				</div>

				<div className="row">
					<div className="col-12 col-md-4 offset-md-4">
						<div className="row">
							<div className="col-12 col-md-6 text-center">
								<Link component={(props) => <RouterLink to="/signup" {...props} />}>
									<Typography
										gutterBottom
										color="primary"
										variant="subtitle2"
									>
										Create a new Account
									</Typography>
								</Link>
							</div>
							<div className="col-12 col-md-6 text-center">
								<Link component={(props) => <RouterLink to="/forgot-password" {...props} />}>
									<Typography
										gutterBottom
										color="primary"
										variant="subtitle2"
									>
										Forgot Password?
									</Typography>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const LoginPageWithRouter = withRouter(LoginPage);
const MaterializedLoginPage = withRoot(withStyles(styles)(LoginPageWithRouter));

const mapStateToProps = (state) => ({
	auth: state.firebase.auth,
});

export default compose(
	withFirebase,
	connect(mapStateToProps),
)(MaterializedLoginPage);
