import React from 'react';
import PropTypes from 'prop-types';
import { Field, Form } from 'formik';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import InputField from '../../../components/common/MyInput';

const AccountForm = (props) => {
	const {
		errors,
		isSubmitting,
		resetForm,
		initialValues,
	} = props;

	const formHasError = Object.keys(errors).length > 0;

	return (
		<Form>
			<div>
				<Field
					name="email"
					component={InputField}
					type="email"
					icon="email"
					label="Email/Username"
					disabled
					containerClasses="mb-3 pt-2"
				/>
			</div>

			<div>
				<Field
					name="username"
					component={InputField}
					type="text"
					icon="person"
					label="Username"
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
							<span>Save Changes</span>
						)
					}
				</Button>

				<Button
					color="primary"
					size="large"
					type="button"
					variant="contained"
					className="mt-4 w-100"
					onClick={() => resetForm(initialValues)}
				>
					Reset Changes
				</Button>
			</div>
		</Form>
	);
};

AccountForm.propTypes = {
	errors: PropTypes.object.isRequired,
	isSubmitting: PropTypes.bool.isRequired,
	resetForm: PropTypes.func.isRequired,
	initialValues: PropTypes.object.isRequired,
};

export default AccountForm;
