import { SEARCH_TEXT } from '../actions/appBar';

const initialState = {
	searchForm: {
		searchText: '',
	},
};

export default function appBarReducer(state = initialState, action) {
	switch (action.type) {
		case SEARCH_TEXT:
			return Object.assign({}, state, {
				searchForm: {
					searchText: action.payload,
				},
			});
		default:
			return state;
	}
}
