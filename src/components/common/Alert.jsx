import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';

const Alert = (props) => {
	const {
		children,
		backgroundColor,
	} = props;

	return (
		<Card style={{ backgroundColor }} className="p-2 text-light">
			{children}
		</Card>
	);
};

Alert.propTypes = {
	children: PropTypes.array.isRequired,
	backgroundColor: PropTypes.string.isRequired,
};

export default Alert;
