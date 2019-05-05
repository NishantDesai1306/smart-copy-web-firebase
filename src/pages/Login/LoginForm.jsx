import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'formik';
import Button from '@material-ui/core/Button';
import { CircularProgress } from '@material-ui/core';
import InputField from '../../components/common/MyInput';

const LoginForm = (props) => {
	const {
		handleSubmit,
		isSubmitting,
		errors,
	} = props;

	const formHasError = Object.keys(errors).length > 0;

	return (
		<form onSubmit={(e) => handleSubmit(e)}>
			<div>
				<Field
					name="email"
					component={InputField}
					type="email"
					icon="email"
					label="Email/Username"
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
					containerClasses="mb-2"
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
							<span>Login</span>
						)
					}
				</Button>
			</div>
		</form>
	);
};

LoginForm.propTypes = {
	handleSubmit: PropTypes.func.isRequired,
	isSubmitting: PropTypes.bool.isRequired,
	errors: PropTypes.object.isRequired,
};

export default LoginForm;
