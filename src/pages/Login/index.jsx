import * as React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withFirebase } from 'react-redux-firebase';
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
								onClick={() => firebase.login({ provider: 'facebook', type: 'popup' })}
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
