import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import withRoot from '../withRoot';

const styles = () => createStyles({
	root: {
		textAlign: 'center',
	},
	menuButton: {
		marginLeft: -12,
		marginRight: 20,
	},
	grow: {
		flexGrow: 1,
	},
});

class Index extends React.Component {
	static propTypes = {
		classes: PropTypes.object.isRequired,
	};

	state = {
		open: false,
	};

	handleClose = () => {
		this.setState({
			open: false,
		});
	};

	handleClick = () => {
		this.setState({
			open: true,
		});
	};

	render() {
		const {
			classes,
		} = this.props;
		const {
			open,
		} = this.state;

		return (
			<div className={classes.root}>
				<AppBar position="static">
					<Toolbar>
						<IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
							<MenuIcon />
						</IconButton>
						<Typography variant="h6" color="inherit" className={classes.grow}>
							News
						</Typography>
						<Button color="inherit">Login</Button>
					</Toolbar>
				</AppBar>
				<Dialog open={open} onClose={this.handleClose}>
					<DialogTitle>Super Secret Password</DialogTitle>
					<DialogContent>
						<DialogContentText>1-2-3-4-5</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button color="primary" onClick={this.handleClose}>
							OK
						</Button>
					</DialogActions>
				</Dialog>

				<div style={{ marginTop: 50 }}>
					<Typography variant="h4" gutterBottom>
						Material-UI
					</Typography>
					<Typography variant="subtitle1" gutterBottom>
						example project
					</Typography>
					<Button variant="contained" color="secondary" onClick={this.handleClick}>
						Super Secret Password
					</Button>
				</div>
			</div>
		);
	}
}

export default withRoot(withStyles(styles)(Index));
