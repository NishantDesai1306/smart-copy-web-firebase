import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'formik';

import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import AppBar from '@material-ui/core/AppBar';

import InputField from '../../../components/common/MyInput';

const AddItemForm = (props) => {
	const {
		handleSubmit,
		errors,
		onCancel,
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
						Create Item
					</Typography>
					<Button
						color="inherit"
						type="submit"
						disabled={formHasError}
					>
						Create
					</Button>
				</Toolbar>
			</AppBar>
			<div className="p-4">
				<Field
					name="content"
					component={InputField}
					type="textarea"
					icon="notes"
					label="Content"
					multiline
					containerClasses="mb-3 pt-2"
				/>
			</div>
		</form>
	);
};

AddItemForm.propTypes = {
	handleSubmit: PropTypes.func.isRequired,
	errors: PropTypes.object.isRequired,
	onCancel: PropTypes.func.isRequired,
};

export default AddItemForm;
