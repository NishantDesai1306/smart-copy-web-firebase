import * as React from 'react';
import PropTypes from 'prop-types';

import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';

import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton/IconButton';
import Icon from '@material-ui/core/Icon';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import withRoot from '../../withRoot';
import getBackgroundColor from '../../utils/GetBackgroundColor';
import getTextColor from '../../utils/GetTextColor';

const styles = () => createStyles({
	sadIcon: {
		fontSize: '30px',
	},
});

class ItemList extends React.Component {
	static propTypes = {
		items: PropTypes.array.isRequired,
		classes: PropTypes.object.isRequired,
		filterText: PropTypes.string.isRequired,
		onAction: PropTypes.func.isRequired,
	};

	state = {
		selectedId: null,
	};

	openMenu = (event) => {
		this.setState({
			selectedId: event.currentTarget.id,
		});
	};

  closeMenu = () => {
		this.setState({
  		selectedId: null,
  	});
  };

	performAction = (actionType) => {
		const {
			selectedId,
		} = this.state;
		const {
			onAction,
		} = this.props;

		onAction({
			actionType,
			itemId: selectedId,
		});

		this.setState({
			selectedId: null,
		});
	}

	render() {
		const {
			items = [],
			classes,
			filterText,
		} = this.props;
		const {
			selectedId,
		} = this.state;

		const anchor = selectedId ? document.getElementById(selectedId) : null;
		let filteredItems = items;

		if (filterText) {
			filteredItems = filteredItems.filter(({ content }) => content.includes(filterText));
		}

		if (!filteredItems || !filteredItems.length) {
			return (
				<Typography variant="h4" gutterBottom className="text-center mt-4 text-muted">
					<Icon className={`mr-2 ${classes.sadIcon}`}>sentiment_dissatisfied</Icon>
					No Items Found
				</Typography>
			);
		}

		return (
			<React.Fragment>
				<Paper elevation={1}>
					<List>
						{
							filteredItems.map((item) => {
								const firstChar = item.content.charAt(0).toUpperCase();
								const background = getBackgroundColor(firstChar);
								const color = getTextColor(background);

								return (
									<ListItem button key={item.id} className="py-3">
										<ListItemAvatar>
											<Avatar style={{ background, color }}>
												{firstChar}
											</Avatar>
										</ListItemAvatar>
										<ListItemText primary={item.content} />
										<ListItemSecondaryAction>
											<IconButton aria-label="options" id={item.id} onClick={this.openMenu}>
												<Icon>more_vert</Icon>
											</IconButton>
										</ListItemSecondaryAction>
									</ListItem>
								);
							})
						}
					</List>
				</Paper>

				<Menu
					id="items-menu"
					anchorEl={anchor}
					open={!!anchor}
					onClose={this.closeMenu}
				>
					<MenuItem onClick={() => this.performAction('edit')}>
						<ListItemIcon>
							<Icon>edit</Icon>
						</ListItemIcon>
						<ListItemText inset primary="Edit" />
					</MenuItem>
					<MenuItem onClick={() => this.performAction('delete')}>
						<ListItemIcon>
							<Icon>delete</Icon>
						</ListItemIcon>
						<ListItemText inset primary="Delete" />
					</MenuItem>
				</Menu>
			</React.Fragment>
		);
	}
}

const MaterializedItemList = withRoot(withStyles(styles)(ItemList));

export default MaterializedItemList;
