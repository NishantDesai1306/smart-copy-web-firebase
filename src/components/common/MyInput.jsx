import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

const MyInput = (props) => {
	const {
		type,
		form: {
			errors,
			touched,
			// valid,
			// touched
		},
		field: {
			name,
			value,
			onChange,
			onBlur,
			onFocus,
		},
		icon,
		label,
		containerClasses,
		multiline,
		disabled,
	} = props;
	// console.log(name, props);

	const isFieldTouched = touched[name];
	const error = errors[name];
	const isInvalid = !!(isFieldTouched && error);
	const color = isInvalid ? 'error' : 'primary';

	if (type === 'checkbox') {
		return (
			<div className={containerClasses}>
				<FormControlLabel
					control={(
						<Switch
							color="primary"
							checked={!!value}
							onChange={() => onChange(!value)}
						/>
					)}
					label={label}
				/>
			</div>
		);
	}

	return (
		<div className={containerClasses}>
			<div className="d-flex align-items-center">
				{
					!!icon && (
						<Icon
							color={color}
							className="mr-2"
						>
							{icon}
						</Icon>
					)
				}

				<TextField
					type={type}
					label={label}
					variant="outlined"
					className="flex-grow-1"
					error={isInvalid}
					value={value}
					onChange={onChange}
					onBlur={onBlur}
					onFocus={onFocus}
					name={name}
					multiline={multiline}
					disabled={!!disabled}
				/>
			</div>

			{
				isInvalid && (
					<Typography
						className="text-right my-1 px-2"
						color={color}
						variant="body2"
						gutterBottom
					>
						{error}
					</Typography>
				)
			}
		</div>
	);
};

MyInput.defaultProps = {
	icon: '',
	containerClasses: '',
	multiline: false,
	disabled: false,
};

MyInput.propTypes = {
	type: PropTypes.string.isRequired,
	field: PropTypes.object.isRequired,
	form: PropTypes.object.isRequired,
	icon: PropTypes.string,
	label: PropTypes.string.isRequired,
	containerClasses: PropTypes.string,
	multiline: PropTypes.bool,
	disabled: PropTypes.bool,
};

export default MyInput;
