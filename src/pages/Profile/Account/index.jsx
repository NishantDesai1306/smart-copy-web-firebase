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

import { CircularProgress } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';

import withRoot from '../../../withRoot';
import getFilePath from '../../../utils/GetFilePath';
import Alert from '../../../components/common/Alert';
import AccountForm from './AccountForm';
import { showNotification } from '../../../actions/notification';

const AccountSchema = Yup.object().shape({
	username: Yup.string()
		.min(6, 'Username must be 6 characters long')
		.required('Required'),
	email: Yup.string()
		.email('Invalid email')
		.required('Required'),
});


const styles = () => createStyles({
	cardTitle: {
		color: indigo[900],
	},
	profilePicture: {
		cursor: 'pointer',
		height: '100px',
		width: '100px',
	},
});

class AccountPage extends React.Component {
	static propTypes = {
		firebase: PropTypes.any.isRequired,
		createNotification: PropTypes.func.isRequired,
		classes: PropTypes.object.isRequired,
		profile: PropTypes.object.isRequired,
	};

	state = {
		error: '',
		isUploading: false,
	};

	submit = (formData) => {
		const {
			firebase,
			createNotification,
		} = this.props;
		const {
			// email,
			username,
		} = formData;

		firebase.updateProfile({
			username,
		})
			.then(() => {
				createNotification('Profile updated successfully');
			})
			.catch((err) => {
				const {
					// code,
					message,
				} = err;

				this.setState({
					error: message,
				});
			});
	};

	handleProfilePictureChange = (event) => {
		const {
			firebase,
			createNotification,
			profile,
		} = this.props;

		if (event && event.target && event.target.files && event.target.files.length) {
			const file = event.target.files[0];
			const extension = file.name.split('.').pop();
			const newFileName = `${profile.username}.${extension}`;
			const newFile = new File([file], newFileName, {
				type: file.type,
			});

			this.setState({
				isUploading: true,
			});

			firebase.uploadFile('profile pictures', newFile)
				.then((data) => {
					const {
						uploadTaskSnapshot: {
							state,
							metadata,
						},
					} = data;

					if (state === 'success') {
						firebase.updateProfile({
							profilePicture: getFilePath(metadata.name),
						})
							.then(() => {
								this.setState({
									isUploading: false,
								});

								createNotification('Profile picture changes successfully');
							})
							.catch((err) => {
								this.setState({
									isUploading: false,
								});

								console.log('error while updating profile', err);
								createNotification('Failed while updating image');
							});
					}
					else {
						this.setState({
							isUploading: false,
						});

						createNotification('Failed while uploading image');
					}
				})
				.catch((err) => {
					console.error('error while uploading image', err);
					this.setState({
						isUploading: false,
					});

					createNotification('Failed while uploading image');
				});
		}
	}

	render() {
		const {
			classes,
			// firebase,
			profile,
		} = this.props;
		const {
			isUploading,
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
								Account
							</Typography>

							{
								profile.isLoaded ? (
									<div className="my-2">
										<div className="d-flex justify-content-center mb-2">

											{
												isUploading ? (
													<CircularProgress />
												) : (
													<React.Fragment>
														<label
															id="label"
															htmlFor="profile-picture-input-file"
														>
															<Avatar
																alt={profile.username}
																src={profile.profilePicture}
																className={classes.profilePicture}
															/>
														</label>

														<input
															className="d-none"
															id="profile-picture-input-file"
															type="file"
															accept="image/*"
															onChange={this.handleProfilePictureChange}
														/>
													</React.Fragment>
												)
											}
										</div>

										<div className="mb-2">
											<Formik
												initialValues={{ username: profile.username, email: profile.email }}
												enableReinitialize
												validationSchema={AccountSchema}
												onSubmit={this.submit}
												component={AccountForm}
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
									</div>
								) : (
									<div className="d-flex justify-content-center">
										<CircularProgress />
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

const AccountPageWithRouter = withRouter(AccountPage);
const MaterializedAccountPage = withRoot(withStyles(styles)(AccountPageWithRouter));

const mapDispatchToProps = (dispatch) => ({
	createNotification: (message) => dispatch(showNotification(message)),
});
const mapStateToProps = (state) => ({
	profile: state.firebase.profile,
});

export default compose(
	withFirebase,
	connect(mapStateToProps, mapDispatchToProps),
)(MaterializedAccountPage);
