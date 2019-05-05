import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'formik';

import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import AppBar from '@material-ui/core/AppBar';

import InputField from '../../../components/common/MyInput';

const EditItemForm = (props) => {
	const {
		handleSubmit,
		errors,
		onCancel,
		isLoading,
	} = props;

	const formHasError = Object.keys(errors).length > 0;

	return (
		<form onSubmit={(e) => handleSubmit(e)}>
			<AppBar className="position-relative">
				<Toolbar>
					<IconButton
						color="inherit"
						onClick={onCancel}
						aria-label="Close"
					>
						<Icon>close</Icon>
					</IconButton>
					<Typography
						variant="h6"
						color="inherit"
						className="flex-grow-1"
					>
						Edit Item
					</Typography>
					<Button
						color="inherit"
						type="submit"
						disabled={formHasError}
					>
						Save
					</Button>
				</Toolbar>
			</AppBar>

			<div className="p-4 text-center">
				{
					isLoading ? (
						<CircularProgress className="mt-4" size={60} thickness={5} />
					) : (
						<Field
							name="content"
							component={InputField}
							type="textarea"
							icon="notes"
							label="Content"
							multiline
							containerClasses="mb-3 pt-2"
						/>
					)
				}
			</div>
		</form>
	);
};

EditItemForm.propTypes = {
	handleSubmit: PropTypes.func.isRequired,
	errors: PropTypes.object.isRequired,
	onCancel: PropTypes.func.isRequired,
	isLoading: PropTypes.bool.isRequired,
};

export default EditItemForm;
