import { SHOW_NOTIFICATION, CLEAR_NOTIFICATIONS } from '../actions/notification';

const initialState = {
	messages: [],
};

export default function notificationReducer(state = initialState, action) {
	switch (action.type) {
		case SHOW_NOTIFICATION:
			return Object.assign({}, state, {
				messages: [
					action.payload,
					...state.messages,
				],
			});
		case CLEAR_NOTIFICATIONS:
			return Object.assign({}, state, {
				messages: [],
			});
		default:
			return state;
	}
}
