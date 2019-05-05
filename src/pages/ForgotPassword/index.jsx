import * as React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Link as RouterLink } from 'react-router-dom';
import { withFirebase } from 'react-redux-firebase';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import { Formik } from 'formik';

import indigo from '@material-ui/core/colors/indigo';
import red from '@material-ui/core/colors/red';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';

import withRoot from '../../withRoot';
import ForgotPasswordForm from './ForgotPasswordForm';
import Alert from '../../components/common/Alert';

const ForgotPasswordSchema = Yup.object().shape({
	email: Yup.string()
		.email('Invalid email')
		.required('Required'),
});

const styles = () => createStyles({
	cardTitle: {
		color: indigo[900],
	},
});

class LoginPage extends React.Component {
	static propTypes = {
		classes: PropTypes.object.isRequired,
		firebase: PropTypes.object.isRequired,
		auth: PropTypes.object.isRequired,
	};

	state = {
		error: '',
	};

	submit = (formData, actions) => {
		const {
			firebase,
		} = this.props;
		const {
			email,
		} = formData;

		console.log(firebase, email);

		setTimeout(() => {
			this.setState({
				error: 'abcd',
			});

			actions.setSubmitting(false);
		}, 2000);
	}

	render() {
		const {
			classes,
			// firebase,
			// auth
		} = this.props;
		const {
			error,
		} = this.state;

		return (
			<div className="login-container container flex-grow-1 d-flex flex-column justify-content-center">
				<div className="row mb-3 justify-content-center">
					<Card className="col-5 px-3 w-100">
						<CardContent>
							<Typography
								gutterBottom
								variant="h5"
								component="h2"
								className={`text-center my-4 ${classes.cardTitle}`}
							>
								Forgot Password
							</Typography>

							<div className="my-2">
								<Formik
									validationSchema={ForgotPasswordSchema}
									onSubmit={this.submit}
									component={ForgotPasswordForm}
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

				<div className="row">
					<div className="col-4 offset-4">
						<div className="row">
							<div className="col-12 text-center">
								<Link component={(props) => <RouterLink to="/login" {...props} />}>
									<Typography
										gutterBottom
										color="primary"
										variant="subtitle2"
									>
										Login
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

const MaterializedLoginPage = withRoot(withStyles(styles)(LoginPage));

const mapStateToProps = (state) => ({
	auth: state.firebase.auth,
});

export default compose(
	withFirebase,
	connect(mapStateToProps),
)(MaterializedLoginPage);
