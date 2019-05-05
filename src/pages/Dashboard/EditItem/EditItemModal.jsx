import * as React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { compose } from 'redux';
import { actionTypes } from 'redux-firestore';
import { withFirestore, firestoreConnect } from 'react-redux-firebase';

import { Formik } from 'formik';
import * as Yup from 'yup';

import Dialog from '@material-ui/core/Dialog';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';

import SlideUp from '../../../components/common/SlideUp';
import withRoot from '../../../withRoot';
import EditItemForm from './EditItemForm';

const EditItemSchema = Yup.object().shape({
	content: Yup.string()
		.required('Required'),
});

const styles = () => createStyles({});

class EditItemModal extends React.Component {
	static propTypes = {
		// classes: PropTypes.object.isRequired,
		item: PropTypes.string.isRequired,
		onCancel: PropTypes.func.isRequired,
		onSubmit: PropTypes.func.isRequired,
		dispatch: PropTypes.func.isRequired,
		content: PropTypes.string,
	};

	static defaultProps = {
		content: '',
	};

	clearFormDataFromStore = () => {
		const {
			dispatch,
		} = this.props;

		dispatch({
			type: actionTypes.CLEAR_DATA,
			preserve: {
				data: ['items'],
			},
		});
	}

	submitForm = (formData) => {
		const {
			onSubmit,
		} = this.props;

		this.clearFormDataFromStore();
		onSubmit(formData);
	}

	cancel = () => {
		const {
			onCancel,
		} = this.props;

		this.clearFormDataFromStore();
		onCancel();
	}

	render() {
		const {
			// classes,
			content,
		} = this.props;

		return (
			<Dialog
				fullScreen
				open
				onClose={this.cancel}
				TransitionComponent={SlideUp}
			>
				<Formik
					initialValues={{ content }}
					enableReinitialize
					validationSchema={EditItemSchema}
					onSubmit={this.submitForm}
					render={(formikProps) => (
						<EditItemForm
							isLoading={!content}
							onCancel={this.cancel}
							{...formikProps}
						/>
					)}
				/>
			</Dialog>
		);
	}
}

const MaterializedEditItemModal = withRoot(withStyles(styles)(EditItemModal));

const mapStateToProps = (state) => {
	const content = state.firestore.data.selectedItem &&
		state.firestore.data.selectedItem.content;

	return {
		editItemFormData: state.form.editItem,
		content,
	};
};

export default compose(
	withFirestore,
	connect(mapStateToProps),
	firestoreConnect((props) => [
		{
			collection: 'items',
			doc: props.item,
			storeAs: 'selectedItem',
		},
	]),
)(MaterializedEditItemModal);
