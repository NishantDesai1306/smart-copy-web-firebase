import * as React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import queryString from 'query-string';
import SwipeableViews from 'react-swipeable-views';

import createStyles from '@material-ui/core/styles/createStyles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Icon from '@material-ui/core/Icon';
import withStyles from '@material-ui/core/styles/withStyles';
import MaterialAppBar from '@material-ui/core/AppBar';

import withRoot from '../../withRoot';
import AccountPage from './Account';
import ChangePasswordPage from './ChangePassword';
import AppBar from '../../components/common/AppBar/AppBar';

const styles = () => createStyles({});

class ProfilePage extends React.Component {
	static propTypes = {
		theme: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,
		history: PropTypes.object.isRequired,
	};

	tabs = [
		{
			id: 'account',
			label: 'Account',
			icon: 'person',
			component: <AccountPage />,
		},
		{
			id: 'change-password',
			label: 'Change Password',
			icon: 'vpn_key',
			component: <ChangePasswordPage />,
		},
	];

	constructor(props) {
		super(props);

		const {
			location,
		} = props;
		const qs = location.search;
		const queryParams = queryString.parse(qs);
		let tabIndex = 0;

		if (queryParams && 	queryParams.tab) {
			const index = this.tabs.findIndex(({ id }) => id === queryParams.tab);

			if (index > -1) {
				tabIndex = index;
			}
		}

		this.state = {
			value: tabIndex,
		};
	}

	handleTabChange = (event, value) => {
		const selectedTab = this.tabs[value];
		const {
			history,
		} = this.props;

		if (selectedTab) {
			history.push(`/dashboard/profile/?tab=${selectedTab.id}`);
		}

		this.setState({ value });
	};

	render() {
		const {
			value,
		} = this.state;
		const {
			theme,
		} = this.props;

		return (
			<React.Fragment>
				<AppBar hideSearchBar />

				<div className="d-flex flex-column flex-grow-1">
					<MaterialAppBar position="static" style={{ zIndex: 99 }}>
						<Tabs
							value={value}
							onChange={this.handleTabChange}
							variant="fullWidth"
						>
							{
								this.tabs.map(({ label, icon, id }) => (
									<Tab
										key={id}
										label={label}
										icon={<Icon>{icon}</Icon>}
									/>
								))
							}
						</Tabs>
					</MaterialAppBar>
					<SwipeableViews
						containerStyle={{ flexGrow: 1, alignItems: 'center' }}
						className="flex-grow-1 d-flex flex-column"
						axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
						index={value}
					>
						{
							this.tabs.map(({ component, id }) => (
								<div key={id}>
									{component}
								</div>
							))
						}
					</SwipeableViews>
				</div>
			</React.Fragment>
		);
	}
}

const ProfilePageWithRouter = withRouter(ProfilePage);
const MaterializedProfilePage = withRoot(
	withStyles(styles, { withTheme: true })(ProfilePageWithRouter),
);

export default MaterializedProfilePage;
