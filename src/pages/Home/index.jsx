import * as React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';

import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import withRoot from '../../withRoot';

const styles = () => createStyles({
	menuButton: {
		marginLeft: -12,
		marginRight: 20,
	},
	grow: {
		flexGrow: 1,
	},
});

const Homepage = (props) => {
	const {
		classes,
	} = props;

	return (
		<div className="homepage-container flex-grow-1 d-flex flex-column">
			<AppBar position="static">
				<Toolbar>
					<Typography variant="h6" color="inherit" className={classes.grow}>
						Smart Copy
					</Typography>

					<Link to="/login">
						<Tooltip title="Login" aria-label="Login">
							<IconButton color="inherit" aria-label="Login" className="text-light">
								<Icon>vpn_key</Icon>
							</IconButton>
						</Tooltip>
					</Link>
				</Toolbar>
			</AppBar>

			<div className="container mt-4 d-flex align-items-center flex-grow-1">
				<div className="row">
					<div className="col-12">
						<div className="p-4 text-center">
							<Typography variant="h2" gutterBottom>
								Welcome to Smart Copy, Login to use this app further
							</Typography>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

Homepage.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Homepage));
