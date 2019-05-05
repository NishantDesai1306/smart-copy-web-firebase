import * as React from 'react';
import PropTypes from 'prop-types';
import { withHandlers } from 'recompose';
import { firestoreConnect, withFirestore } from 'react-redux-firebase';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Fab from '@material-ui/core/Fab';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';

import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

import AppBar from '../../components/common/AppBar/AppBar';
import withRoot from '../../withRoot';
import ItemList from './ItemList';
import AddItemModal from './AddItem/AddItemModal';
import { showNotification } from '../../actions/notification';
import EditItemModal from './EditItem/EditItemModal';
import DeleteItemModal from './DeleteItem/DeleteItemModal';

const styles = () => createStyles({
	addButton: {
		position: 'fixed',
		right: '10vw',
		bottom: '5vh',
	},
});

class Dashboard extends React.Component {
	static propTypes = {
		classes: PropTypes.object.isRequired,
		auth: PropTypes.object.isRequired,
		dispatch: PropTypes.func.isRequired,
		appBarSearchText: PropTypes.string.isRequired,
		items: PropTypes.array,
		addItem: PropTypes.func.isRequired,
		editItem: PropTypes.func.isRequired,
		deleteItem: PropTypes.func.isRequired,
	};

	static defaultProps = {
		items: [],
	};

	state = {
		addItemModal: false,
		itemId: '',
		actionType: '',
	};

	toggleCreateItemModal = () => {
		const {
			addItemModal,
		} = this.state;

		this.setState({
			addItemModal: !addItemModal,
		});
	}

	createItemModalSubmit = (data) => {
		const {
			auth,
			addItem,
		} = this.props;

		addItem({
			content: data.content,
			owner: auth.uid,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		this.setState({
			addItemModal: false,
		});
	};

	performAction = ({ itemId, actionType }) => {
		this.setState({
			itemId,
			actionType,
		});
	};

	editItemModalSubmit = (data) => {
		const {
			editItem,
			items,
			dispatch,
		} = this.props;
		const {
			itemId,
		} = this.state;

		const updatedItem = items.find(({ id }) => id === itemId);

		if (updatedItem) {
			updatedItem.content = data.content;

			editItem(updatedItem);

			this.setState({
				itemId: null,
				actionType: null,
			});
		}
		else {
			dispatch(showNotification('Item not found'));
		}
	};

	closeEditItemModal = () => {
		this.setState({
			itemId: null,
			actionType: null,
		});
	}

	deleteItemModalSubmit = () => {
		const {
			dispatch,
			items,
			deleteItem,
		} = this.props;
		const {
			itemId,
		} = this.state;

		const item = items.some(({ id }) => id === itemId);

		if (item) {
			deleteItem(itemId);

			this.setState({
				itemId: null,
				actionType: null,
			});
		}
		else {
			dispatch(showNotification('Item not found'));
		}
	};

	closeDeleteItemModal = () => {
		this.setState({
			itemId: null,
			actionType: null,
		});
	}

	render() {
		const {
			classes,
			// auth,
			// profile,
			items,
			appBarSearchText,
		} = this.props;
		const {
			addItemModal,
			itemId,
			actionType,
		} = this.state;

		return (
			<div className="homepage-container flex-grow-1 d-flex flex-column">
				<AppBar />

				<div className="container">
					<div className="row">
						<div className="col-12">
							{
								items ? (
									<ItemList
										onAction={this.performAction}
										items={items}
										filterText={appBarSearchText}
									/>
								) : (
									<div className="p-4 mt-4 d-flex justify-content-center align-items-center">
										<CircularProgress />
										<Typography className="ml-3" variant="h6" color="primary">
											Loading Items...
										</Typography>
									</div>
								)
							}
						</div>
					</div>
				</div>

				<Tooltip title="Add" aria-label="Add">
					<Fab
						size="medium"
						color="secondary"
						aria-label="Add"
						className={classes.addButton}
						onClick={this.toggleCreateItemModal}
					>
						<Icon>add</Icon>
					</Fab>
				</Tooltip>

				{
					addItemModal && (
						<AddItemModal
							onCancel={this.toggleCreateItemModal}
							onSubmit={this.createItemModalSubmit}
						/>
					)
				}

				{
					!!(itemId && actionType === 'edit') && (
						<EditItemModal
							item={itemId}
							onCancel={this.closeEditItemModal}
							onSubmit={this.editItemModalSubmit}
						/>
					)
				}

				{
					!!(itemId && actionType === 'delete') && (
						<DeleteItemModal
							item={itemId}
							onCancel={this.closeDeleteItemModal}
							onSubmit={this.deleteItemModalSubmit}
						/>
					)
				}
			</div>
		);
	}
}

const MaterializedDashboard = withRoot(withStyles(styles)(Dashboard));

const mapStateToProps = (state) => {
	const finalProps = {
		auth: state.firebase.auth,
		profile: state.firebase.profile,
		items: undefined,
		appBarSearchText: state.appBar.searchForm.searchText,
	};

	if (state.firestore.data.items) {
		const itemIds = Object.keys(state.firestore.data.items);
		const itemDocs = state.firestore.data.items ? Object.values(state.firestore.data.items) : [];

		finalProps.items = [];

		itemDocs
			.filter((itemDoc) => !!itemDoc)
			.forEach((itemDoc, index) => {
				const item = {
					id: itemIds[index],
					owner: itemDoc.owner,
					content: itemDoc.content,
					createdAt: itemDoc.createdAt.toDate(),
					updatedAt: itemDoc.updatedAt.toDate(),
				};

				if (finalProps.items) {
					finalProps.items.push(item);
				}
			});
	}

	return finalProps;
};

export default compose(
	withFirestore,
	connect(mapStateToProps),
	firestoreConnect((props) => {
		const {
			auth,
		} = props;

		return [
			{
				collection: 'items',
				where: ['owner', '==', auth ? auth.uid : null],
			},
		];
	}),
	withHandlers({
		addItem: (props) => (item) => {
			const {
				firestore,
				dispatch,
			} = props;

			firestore.add(
				{ collection: 'items' },
				item,
			)
				.then(() => {
					dispatch(showNotification('Item Added'));
				})
				.catch((err) => {
					console.log(err);
				});
		},
		editItem: (props) => (item) => {
			const {
				firestore,
				dispatch,
			} = props;

			firestore.update({
				collection: 'items',
				doc: item.id,
			}, {
				content: item.content,
				updatedAt: new Date(),
			})
				.then(() => {
					dispatch(showNotification('Item Updated'));
				})
				.catch((err) => {
					console.log(err);
				});
		},
		deleteItem: (props) => (itemId) => {
			const {
				firestore,
				dispatch,
			} = props;

			firestore.delete({
				collection: 'items',
				doc: itemId,
			})
				.then(() => {
					dispatch(showNotification('Item Deleted'));
				})
				.catch((err) => {
					console.log(err);
				});
		},
	}),
)(MaterializedDashboard);
