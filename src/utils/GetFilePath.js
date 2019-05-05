import firebaseConfig from '../config/firebase';

export const BASE_URL = 'https://firebasestorage.googleapis.com/v0/b';

export default (filename) => {
	const pathFragments = [
		BASE_URL,
		firebaseConfig.storageBucket,
		`o/profile%20pictures%2F${filename}?alt=media`,
	];

	return pathFragments.join('/');
};
