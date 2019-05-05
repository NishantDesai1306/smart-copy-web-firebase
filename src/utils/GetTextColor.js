/* eslint-disable no-mixed-operators */
/* eslint-disable no-bitwise */
import { grey } from '@material-ui/core/colors';

export const LIGHT_TEXT_COLOR = grey[50];
export const DARK_TEXT_COLOR = grey[900];

export default (backgroundHex) => {
	// Variables for red, green, blue values
	let r;
	let g;
	let b;

	// Check the format of the backgroundHex, HEX or RGB?
	if (backgroundHex.match(/^rgb/)) {
		// If HEX --> store the red, green, blue values in separate variables
		backgroundHex = backgroundHex.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);

		[r, g, b] = backgroundHex;
	}
	else {
		// If RGB --> Convert it to HEX: http://gist.github.com/983661
		const hexString = backgroundHex
			.slice(1)
			.replace(backgroundHex.length < 5 && /./g, '$&$&');

		backgroundHex = +(`0x${hexString}`);

		r = backgroundHex >> 16;
		g = backgroundHex >> 8 & 255;
		b = backgroundHex & 255;
	}

	// HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
	const hsp = Math.sqrt(
		0.299 * (r * r) +
		0.587 * (g * g) +
		0.114 * (b * b),
	);

	// Using the HSP value, determine whether the backgroundHex is light or dark
	return hsp > 127.5 ? LIGHT_TEXT_COLOR : DARK_TEXT_COLOR;
};
