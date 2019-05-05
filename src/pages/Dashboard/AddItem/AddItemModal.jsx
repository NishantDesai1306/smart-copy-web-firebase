import * as React from 'react';
import PropTypes from 'prop-types';

import { Formik } from 'formik';
import * as Yup from 'yup';

import Dialog from '@material-ui/core/Dialog';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';

import withRoot from '../../../withRoot';
import SlideUp from '../../../components/common/SlideUp';
import AddItemForm from './AddItemForm';

const AddItemSchema = Yup.object().shape({
	content: Yup.string()
		.required('Required'),
});
const styles = () => createStyles({});

class AddItemModal extends React.Component {
	static propTypes = {
		onCancel: PropTypes.func.isRequired,
		onSubmit: PropTypes.func.isRequired,
	};

	submitForm = (formData) => {
		const {
			onSubmit,
		} = this.props;

		onSubmit(formData);
	}

	render() {
		const {
			// classes,
			onCancel,
		} = this.props;

		return (
			<Dialog
				fullScreen
				open
				onClose={onCancel}
				TransitionComponent={SlideUp}
			>
				<Formik
					validationSchema={AddItemSchema}
					onSubmit={this.submitForm}
					render={(formikProps) => (
						<AddItemForm {...formikProps} onCancel={onCancel} />
					)}
				/>
			</Dialog>
		);
	}
}

const MaterializedAddItemModal = withRoot(withStyles(styles)(AddItemModal));

export default MaterializedAddItemModal;
