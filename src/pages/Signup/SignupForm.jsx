import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'formik';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import InputField from '../../components/common/MyInput';

const SignupForm = (props) => {
	const {
		handleSubmit,
		isSubmitting,
		errors,
	} = props;

	const formHasError = Object.keys(errors).length;

	return (
		<form onSubmit={(e) => handleSubmit(e)}>
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

			<div>
				<Field
					name="email"
					component={InputField}
					type="email"
					icon="email"
					label="Email"
					containerClasses="mb-3 pt-2"
				/>
			</div>

			<div>
				<Field
					name="password"
					component={InputField}
					type="password"
					icon="lock"
					label="Password"
					containerClasses="mb-3 pt-2"
				/>
			</div>

			<div>
				<Field
					name="confirmPassword"
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
							<span>Signup</span>
						)
					}
				</Button>
			</div>
		</form>
	);
};

SignupForm.propTypes = {
	handleSubmit: PropTypes.func.isRequired,
	isSubmitting: PropTypes.bool.isRequired,
	errors: PropTypes.object.isRequired,
};

export default SignupForm;
