import React from 'react';
import PropTypes from 'prop-types';
import { Field, Form } from 'formik';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import InputField from '../../../components/common/MyInput';

const ChangePasswordForm = (props) => {
	const {
		errors,
		isSubmitting,
		values,
	} = props;

	const formHasError = Object.keys(errors).length > 0;

	return (
		<Form>
			{
				values.showCurrentPassword && (
					<div>
						<Field
							name="currentPassword"
							component={InputField}
							type="password"
							icon="lock"
							label="Current Password"
							containerClasses="mb-3 pt-2"
						/>
					</div>
				)
			}

			<div>
				<Field
					name="newPassword"
					component={InputField}
					type="password"
					icon="lock"
					label="New Password"
					containerClasses="mb-3 pt-2"
				/>
			</div>

			<div>
				<Field
					name="confirmNewPassword"
					component={InputField}
					type="password"
					icon="lock"
					label="Confirm Password"
					containerClasses="mb-3 pt-2"
				/>
			</div>

			<div className="text-center mb-3 pt-2">
				<Button
					color="primary"
					size="large"
					type="submit"
					variant="contained"
					className="w-100"
					disabled={formHasError}
				>
					{
						isSubmitting ? (
							<CircularProgress color="secondary" size={25} />
						) : (
							<span>Change Password</span>
						)
					}
				</Button>
			</div>
		</Form>
	);
};

ChangePasswordForm.propTypes = {
	errors: PropTypes.object.isRequired,
	isSubmitting: PropTypes.bool.isRequired,
	values: PropTypes.object.isRequired,
};

export default ChangePasswordForm;
