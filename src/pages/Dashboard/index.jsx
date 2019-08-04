import * as React from 'react';
import PropTypes from 'prop-types';
import { withHandlers } from 'recompose';
import { firestoreConnect, withFirestore } from 'react-redux-firebase';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Fab from '@material-ui/core/Fab';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import Switch from '@material-ui/core/Switch';

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
		appBarSearchText: PropTypes.string.isRequired,
		items: PropTypes.array,
		addItem: PropTypes.func.isRequired,
		editItem: PropTypes.func.isRequired,
		deleteItem: PropTypes.func.isRequired,
		toggleStarStatus: PropTypes.func.isRequired,
		createNotification: PropTypes.func.isRequired,
	};

	static defaultProps = {
		items: [],
	};

	state = {
		showOnlyStarred: false,
		addItemModal: false,
		itemId: '',
		actionType: '',
	};

	toggleOnlyStarred = () => {
		const {
			showOnlyStarred,
		} = this.state;

		this.setState({
			showOnlyStarred: !showOnlyStarred,
		});
	}

	onItemCopied = () => {
		const {
			createNotification,
		} = this.props;

		createNotification('Item copied to your clipboard');
	}

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

	toggleStarStatus = (itemId) => {
		const {
			toggleStarStatus,
			items,
			createNotification,
		} = this.props;

		const item = items.find(({ id }) => id === itemId);

		if (item) {
			toggleStarStatus(item);
		}
		else {
			createNotification('Item not found');
		}
	}

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
			createNotification,
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
			createNotification('Item not found');
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
			createNotification,
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
			createNotification('Item not found');
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
			showOnlyStarred,
			addItemModal,
			itemId,
			actionType,
		} = this.state;

		const itemList = items.filter(({ isStarred }) => !showOnlyStarred || isStarred);

		return (
			<div className="homepage-container flex-grow-1 d-flex flex-column">
				<AppBar />

				<div className="container">
					<div className="row">
						<div className="col-12 col-sm-4 offset-sm-4 text-center p-4">
							<h3 className="m-0">Items</h3>
						</div>
						<div className="col-12 col-sm-4 d-flex align-items-center justify-content-center">
							<div className="d-flex align-items-center justify-content-center">
								<div className={showOnlyStarred ? 'text-muted' : 'strong'}>
									<span>All</span>
								</div>
								<div>
									<Switch
										onChange={this.toggleOnlyStarred}
										checked={showOnlyStarred}
									/>
								</div>
								<div className={`d-flex align-items-center ${showOnlyStarred ? 'strong' : 'text-muted'}`}>
									<span className="mr-1">Only</span>
									<Icon
										color={showOnlyStarred ? 'primary' : 'inherit'}
										classes={{
											colorPrimary: 'gold-star',
										}}
									>
										star
									</Icon>
								</div>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-12">
							{
								items ? (
									<ItemList
										onAction={this.performAction}
										items={itemList}
										filterText={appBarSearchText}
										onItemCopied={this.onItemCopied}
										onToggleStarStatus={this.toggleStarStatus}
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
					isStarred: itemDoc.isStarred,
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

const mapDispatchToProps = (dispatch) => ({
	createNotification: (message) => dispatch(showNotification(message)),
});

export default compose(
	withFirestore,
	connect(mapStateToProps, mapDispatchToProps),
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
				createNotification,
			} = props;

			firestore.add(
				{ collection: 'items' },
				item,
			)
				.then(() => {
					createNotification('Item Added');
				})
				.catch((err) => {
					console.log(err);
				});
		},
		editItem: (props) => (item) => {
			const {
				firestore,
				createNotification,
			} = props;

			firestore.update({
				collection: 'items',
				doc: item.id,
			}, {
				content: item.content,
				updatedAt: new Date(),
			})
				.then(() => {
					createNotification('Item Updated');
				})
				.catch((err) => {
					console.log(err);
				});
		},
		deleteItem: (props) => (itemId) => {
			const {
				firestore,
				createNotification,
			} = props;

			firestore.delete({
				collection: 'items',
				doc: itemId,
			})
				.then(() => {
					createNotification('Item Deleted');
				})
				.catch((err) => {
					console.log(err);
				});
		},
		toggleStarStatus: (props) => (item) => {
			const {
				firestore,
				createNotification,
			} = props;

			firestore.update({
				collection: 'items',
				doc: item.id,
			}, {
				isStarred: !item.isStarred,
				updatedAt: new Date(),
			})
				.then(() => {
					createNotification(`Item ${item.isStarred ? 'Unstarred' : 'Starred'}`);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}),
)(MaterializedDashboard);
