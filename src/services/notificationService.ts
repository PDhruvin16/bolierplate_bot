import log from '../utils/logger';
import { useNotification } from '../hooks/useNotification';

export const notificationService = {
  // Initialize push notifications
  initialize: async () => {
    try {
      // Request permission for push notifications
      const { status } = await useNotification.requestPermissionsAsync();

      if (status !== 'granted') {
        return false;
      }

      // Get push token
      const token = await useNotification.getExpoPushTokenAsync();

      return token;
    } catch (error) {
      log.error('Error initializing notifications:', error);
      return false;
    }
  },

  // Schedule local notification
  scheduleLocalNotification: async (title, body, data = {}, trigger = null) => {
    try {
      await useNotification.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
        },
        trigger: trigger || null, // null means immediate
      });
    } catch (error) {
      log.error('Error scheduling notification:', error);
    }
  },

  // Cancel all scheduled notifications
  cancelAllNotifications: async () => {
    try {
      await useNotification.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      log.error('Error canceling notifications:', error);
    }
  },

  // Cancel specific notification
  cancelNotification: async notificationId => {
    try {
      await useNotification.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      log.error('Error canceling notification:', error);
    }
  },

  // Get all scheduled notifications
  getScheduledNotifications: async () => {
    try {
      const notifications =
        await useNotification.getAllScheduledNotificationsAsync();
      return notifications;
    } catch (error) {
      log.error('Error getting scheduled notifications:', error);
      return [];
    }
  },
};

export default notificationService;
