import * as React from 'react';
import PropTypes from 'prop-types';
import { withFirebase } from 'react-redux-firebase';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Popper from '@material-ui/core/Popper';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import InputBase from '@material-ui/core/InputBase';
import Icon from '@material-ui/core/Icon';
import { fade } from '@material-ui/core/styles/colorManipulator';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import InputAdornment from '@material-ui/core/InputAdornment';
import ButtonBase from '@material-ui/core/ButtonBase';

import withRoot from '../../../withRoot';
import AppBarActionCreators from '../../../actions/appBar';

const styles = (theme) => createStyles({
	profileAvatar: {
		width: '40px',
		height: '40px',
	},
	search: {
		position: 'relative',
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.15),
		'&:hover': {
			backgroundColor: fade(theme.palette.common.white, 0.25),
		},
		marginRight: theme.spacing.unit * 2,
		marginLeft: 0,
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			marginLeft: theme.spacing.unit * 3,
			width: 'auto',
		},
	},
	searchIcon: {
		width: theme.spacing.unit * 9,
		height: '100%',
		position: 'absolute',
		pointerEvents: 'none',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	inputRoot: {
		color: 'inherit',
		width: '100%',
	},
	inputInput: {
		paddingTop: theme.spacing.unit,
		paddingRight: theme.spacing.unit,
		paddingBottom: theme.spacing.unit,
		paddingLeft: theme.spacing.unit * 10,
		transition: theme.transitions.create('width'),
		width: '100%',
	},
});

class AppBarComponent extends React.Component {
	static propTypes = {
		firebase: PropTypes.object.isRequired,
		profile: PropTypes.object.isRequired,
		auth: PropTypes.object.isRequired,
		hideSearchBar: PropTypes.bool,
		updateSearchText: PropTypes.func.isRequired,
		appBarSearchText: PropTypes.string.isRequired,
		classes: PropTypes.object.isRequired,
		history: PropTypes.object.isRequired,
	};

	static defaultProps = {
		hideSearchBar: false,
	};

	state = {
		open: false,
	};

	profileTriggerElement = null;

	handleSearchChange = (event) => {
		const {
			updateSearchText,
		} = this.props;
		const text = event.target.value;

		updateSearchText(text);
	}

	handleToggle = () => {
		const {
			open,
		} = this.state;

		this.setState({
			open: !open,
		});
	};

	handleClose = (event) => {
		if (this.profileTriggerElement.contains(event.target)) {
			return;
		}

		this.setState({
			open: false,
		});
	};

	logout = () => {
		const {
			firebase,
		} = this.props;

		firebase.logout();

		this.setState({
			open: false,
		});
	}

	render() {
		const {
			classes,
			// auth,
			profile,
			// firebase,
			appBarSearchText,
			history,
			hideSearchBar,
		} = this.props;
		const {
			open,
		} = this.state;

		return (
			<AppBar position="static">
				<Toolbar>
					<Typography
						variant="h6"
						color="inherit"
						className={`${hideSearchBar ? 'flex-grow-1' : ''} cursor-pointer`}
						onClick={() => history.push('/dashboard')}
					>
						Smart Copy
					</Typography>

					{
						!hideSearchBar && (
							<div className="flex-grow-1 d-flex justify-content-center">
								<div className="col-8 col-md-6">
									<div className={classes.search}>
										<div className={classes.searchIcon}>
											<Icon>search</Icon>
										</div>
										<InputBase
											placeholder="Search…"
											onChange={this.handleSearchChange}
											classes={{
												root: classes.inputRoot,
												input: classes.inputInput,
											}}
											value={appBarSearchText}
											endAdornment={(
												<InputAdornment position="end" className="">
													{
														!!appBarSearchText && (
															<ButtonBase
																centerRipple
																focusRipple
																className="text-light p-1"
																onClick={() => this.handleSearchChange({ target: { value: '' } })}
															>
																<Icon>close</Icon>
															</ButtonBase>
														)
													}
												</InputAdornment>
											)}
										/>
									</div>
								</div>
							</div>
						)
					}

					<Button
						buttonRef={(node) => {
							this.profileTriggerElement = node;
						}}
						color="inherit"
						aria-haspopup="true"
						onClick={this.handleToggle}
					>
						<Avatar
							className={`${classes.profileAvatar}`}
							alt="profile_picture"
							src={profile.profilePicture}
						/>
					</Button>

					<Popper open={open} anchorEl={this.profileTriggerElement} transition disablePortal>
						{({ TransitionProps, placement }) => (
							<Grow
								style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
								{...TransitionProps}
							>
								<Paper>
									<ClickAwayListener onClickAway={this.handleClose}>
										<MenuList>
											<MenuItem onClick={() => history.push('/dashboard/profile')}>
												<Icon className="mr-2">account_circle</Icon>
												Profile
											</MenuItem>
											<MenuItem onClick={this.logout}>
												<Icon className="mr-2">exit_to_app</Icon>
												Logout
											</MenuItem>
										</MenuList>
									</ClickAwayListener>
								</Paper>
							</Grow>
						)}
					</Popper>
				</Toolbar>
			</AppBar>
		);
	}
}

const MaterializedAppBar = withRoot(withStyles(styles)(AppBarComponent));
const AppBarWithRouter = withRouter(MaterializedAppBar);

const mapDispatchToProps = (dispatch) => ({
	...bindActionCreators(
		{ ...AppBarActionCreators },
		dispatch,
	),
});

const mapStateToProps = (state) => ({
	appBarSearchText: state.appBar.searchForm.searchText || '',
	auth: state.firebase.auth,
	profile: state.firebase.profile,
});

export default compose(
	connect(mapStateToProps, mapDispatchToProps),
	withFirebase,
)(AppBarWithRouter);
