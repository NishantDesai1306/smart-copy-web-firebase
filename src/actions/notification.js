export const SHOW_NOTIFICATION = 'SHOW_NOTIFICATION';
export const CLEAR_NOTIFICATIONS = 'CLEAR_NOTIFICATIONS';

export const showNotification = (type) => ({
	type: SHOW_NOTIFICATION,
	payload: type,
});

export const clearNotifications = () => ({
	type: CLEAR_NOTIFICATIONS,
});
