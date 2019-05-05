export const SEARCH_TEXT = 'SEARCH_TEXT';

// eslint-disable-next-line no-unused-vars
const updateSearchText = (searchText) => (dispatch, getState, getFirebase) => {
	dispatch({
		type: SEARCH_TEXT,
		payload: searchText,
	});
};

export default {
	updateSearchText,
};
