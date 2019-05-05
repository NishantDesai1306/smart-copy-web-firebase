import * as React from 'react';
import { compose } from 'redux';
import { actionTypes } from 'redux-firestore';
import { withFirestore, firestoreConnect } from 'react-redux-firebase';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { red } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import { CircularProgress } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';

import SlideUp from '../../../components/common/SlideUp';
import withRoot from '../../../withRoot';
import { LIGHT_TEXT_COLOR } from '../../../utils/GetTextColor';

const styles = () => createStyles({
	deleteButton: {
		color: LIGHT_TEXT_COLOR,
		backgroundColor: red[500],
		'&:hover': {
			backgroundColor: red[700],
		},
	},
});

class DeleteItemModal extends React.Component {
	propTypes = {
		classes: PropTypes.object.isRequired,
		// item: PropTypes.string.isRequired,
		onCancel: PropTypes.func.isRequired,
		onSubmit: PropTypes.func.isRequired,
		dispatch: PropTypes.func.isRequired,
		content: PropTypes.string.isRequired,
	};

	submit = () => {
		const {
			onSubmit,
			dispatch,
		} = this.props;

		dispatch({
			type: actionTypes.CLEAR_DATA,
			preserve: {
				data: ['items'],
			},
		});

		onSubmit();
	}

	cancel = () => {
		const {
			onCancel,
			dispatch,
		} = this.props;

		dispatch({
			type: actionTypes.CLEAR_DATA,
			preserve: {
				data: ['items'],
			},
		});

		onCancel();
	}

	render() {
		const {
			classes,
			content,
		} = this.props;

		let textToShow = null;

		if (content) {
			textToShow = content ? content.substring(0, 10) : null;
			textToShow += textToShow.length < content.length ? '...' : '';
		}

		return (
			<Dialog
				open
				onClose={this.cancel}
				TransitionComponent={SlideUp}
			>
				<DialogTitle id="alert-dialog-slide-title">
					Delete Item
				</DialogTitle>
				<DialogContent>
					{
						textToShow ? (
							<DialogContentText id="alert-dialog-slide-description">
								Are you sure you want to delete,
								<strong className="mx-1">{textToShow}</strong>
								?
							</DialogContentText>
						) : (
							<div className="d-flex justify-content-center">
								<CircularProgress />
							</div>
						)
					}
				</DialogContent>
				<DialogActions className="px-2 py-2">
					<Button onClick={this.cancel}>
						Cancel
					</Button>
					<Button
						onClick={this.submit}
						className={classes.deleteButton}
						disabled={!textToShow}
					>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

const MaterializedDeleteItemModal = withRoot(withStyles(styles)(DeleteItemModal));

const mapStateToProps = (state) => {
	const content = state.firestore.data.selectedItem &&
		state.firestore.data.selectedItem.content;

	return {
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
)(MaterializedDeleteItemModal);
