import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

export default () => {
	const containerStyle = {
		height: '100vh',
		width: '100wh',
		zIndex: 100,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	};

	return (
		<div style={containerStyle}>
			<CircularProgress size={100} thickness={5} />
		</div>
	);
};
