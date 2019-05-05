import * as React from 'react';
import PropTypes from 'prop-types';

import { compose } from 'redux';
import { withFirebase } from 'react-redux-firebase';
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

const ChangePasswordSchema = Yup.object().shape({
	currentPassword: Yup.string()
		.required('Required'),
	newPassword: Yup.string()
		.min(6, 'New Password must be 6 characters long')
		.required('Required'),
	confirmNewPassword: Yup.string()
		.min(6, 'New Password must be 6 characters long')
		.required('Required'),
});

const styles = () => createStyles({
	cardTitle: {
		color: indigo[900],
	},
});

class ChangePasswordPage extends React.Component {
	static propTypes = {
		firebase: PropTypes.any.isRequired,
		createNotification: PropTypes.func.isRequired,
		classes: PropTypes.object.isRequired,
	};

	state = {
		error: '',
	};

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

	reAuthenticate = (currentPassword) => {
		const {
			firebase,
		} = this.props;

		const user = firebase.auth().currentUser;
		const cred = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
		return user.reauthenticateWithCredential(cred);
	}

	submit = (formData, actions) => {
		const {
			firebase,
			createNotification,
		} = this.props;
		const {
			currentPassword,
			newPassword,
		} = formData;

		this.reAuthenticate(currentPassword)
			.then(() => {
				const user = firebase.auth().currentUser;

				user.updatePassword(newPassword)
					.then(() => {
						createNotification('Password changed successfully');
					})
					.catch((error) => {
						const {
							// code,
							message,
						} = error;

						this.setState({
							error: message,
						});

						createNotification('Error occurred while changing password');
					});
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
		} = this.state;

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
									validate={this.validate}
									validationSchema={ChangePasswordSchema}
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
});

export default compose(
	withFirebase,
	connect(mapStateToProps, mapDispatchToProps),
)(MaterializedChangePasswordPage);
