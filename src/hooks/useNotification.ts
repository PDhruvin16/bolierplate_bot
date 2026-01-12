import { useNotificationState } from './useRedux';

// Re-export Redux notification hooks
// export { useNotificationState } from './useRedux';

// Legacy hook for backward compatibility
export const useNotification = () => {
  const notificationState = useNotificationState();
  return {
    ...notificationState,
    addNotification: () => {}, // These will be handled by Redux actions
    markAsRead: () => {},
    markAllAsRead: () => {},
    deleteNotification: () => {},
    clearError: () => {},
  };
};

// Additional notification-related hooks
export const useNotificationCount = () => {
  const { unreadCount } = useNotificationState();
  return unreadCount;
};

export const useNotifications = () => {
  const { notifications } = useNotificationState();
  return notifications;
};
