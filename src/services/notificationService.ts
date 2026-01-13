import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import { navigationRef } from '../navigation/navigationRef';

import { addNotification } from '../store/slices/notificationSlice';
import log from '../utils/logger';

// Navigation service for notification handling
let _navigator: any = null;
let _pendingNavigation: any = null;

export const setNavigationRef = (navigatorRef: any) => {
  _navigator = navigatorRef;
  log.debug('Navigation reference set:', !!navigatorRef);

  // Execute pending navigation if exists
  if (_pendingNavigation && typeof _pendingNavigation === 'object') {
    log.debug('Executing pending navigation:', _pendingNavigation);
    setTimeout(() => {
      try {
        if (_pendingNavigation?.screen) {
          navigate(_pendingNavigation.screen, _pendingNavigation.params || {});
        } else {
          log.warn('Invalid pending navigation data:', _pendingNavigation);
        }
      } catch (error) {
        log.error('Navigation error:', error);
      } finally {
        _pendingNavigation = null;
      }
    }, 1000);
  }
};

export const navigate = (name: string, params: any = {}) => {
  if (!name) {
    log.warn('Navigation attempted without screen name');
    return;
  }

  if (_navigator || navigationRef.isReady()) {
    log.debug('Navigating to:', name, params);
    try {
      if (name === 'ProfileTab' || name === 'Profile') {
        const nav = _navigator || navigationRef;
        nav.navigate('MainTabs', {
          screen: 'Profile',
          ...params,
        });
      } else {
        const nav = _navigator || navigationRef;
        nav.navigate(name, params);
      }
    } catch (error) {
      log.error('Navigation error:', error);
    }
  } else {
    log.debug('Navigation attempted before navigator was ready, storing for later');
    _pendingNavigation = { screen: name, params: params || {} };
  }
};

class NotificationService {
  private dispatch: any = null;

  constructor() {
    this.configure();
  }

  // Set Redux dispatch for notification actions
  setDispatch = (dispatch: any) => {
    this.dispatch = dispatch;
  };

  // Configure notification service
  configure = async () => {
    try {
      // Get FCM token
      const token = await this.getFCMToken();

      // Listen to foreground messages
      this.foregroundListener();

      // Listen to background/quit state messages
      this.backgroundListener();

      // Handle notification open app
      this.notificationOpenedApp();

      // Handle app opened from quit state
      this.getInitialNotification();

      // Check for pending notifications on app start
      this.checkPendingNotification();
    } catch (error) {
      log.error('Notification configure error:', error);
    }
  };

  // Get FCM Token
  getFCMToken = async () => {
    try {
      const token = await messaging().getToken();
      if (token) {
        await AsyncStorage.setItem('fcmToken', token);
        log.debug('FCM Token saved to AsyncStorage:', token);
        return token;
      }
    } catch (error) {
      log.error('Get FCM token error:', error);
      return null;
    }
  };

  // Listen to foreground messages
  foregroundListener = () => {
    messaging().onMessage(async remoteMessage => {
      log.debug('Foreground notification received:', remoteMessage);

      // Add to Redux store if dispatch is available
      if (this.dispatch) {
        this.dispatch(
          addNotification({
            title: remoteMessage.notification?.title || 'Notification',
            body: remoteMessage.notification?.body || '',
            data: remoteMessage.data,
            read: false,
          }),
        );
      }

      // Show custom alert or in-app notification
      this.showForegroundNotification(remoteMessage);
    });
  };

  // Listen to background messages
  backgroundListener = () => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      log.debug('Background notification received:', remoteMessage);
      this.handleBackgroundNotification(remoteMessage);
    });
  };

  // Handle notification when app opened from background
  notificationOpenedApp = () => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      log.debug('Notification opened app from background:', remoteMessage);
      this.storeNavigationData(remoteMessage);
      this.handleNotificationNavigation(remoteMessage);
    });
  };

  // Handle notification when app opened from quit state
  getInitialNotification = () => {
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          this.storeNavigationData(remoteMessage);
          this.handleNotificationNavigation(remoteMessage);
        }
      });
  };

  // Store navigation data in AsyncStorage
  storeNavigationData = async (remoteMessage: any) => {
    try {
      const navigationData = {
        screen: remoteMessage.data?.screen,
        params: remoteMessage.data?.params
          ? JSON.parse(remoteMessage.data.params)
          : {},
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(
        'pendingNotificationNavigation',
        JSON.stringify(navigationData),
      );
      log.debug('Navigation data stored:', navigationData);
    } catch (error) {
      log.error('Error storing navigation data:', error);
    }
  };

  // Check for pending notifications on app start
  checkPendingNotification = async () => {
    try {
      const pendingData = await AsyncStorage.getItem(
        'pendingNotificationNavigation',
      );
      if (pendingData) {
        const navigationData = JSON.parse(pendingData);

        if (navigationData && navigationData.screen) {
          setTimeout(() => {
            try {
              navigate(navigationData.screen, navigationData.params);
            } catch (error) {
              log.error('Pending navigation error:', error);
            }
          }, 2000);
        }

        await AsyncStorage.removeItem('pendingNotificationNavigation');
      }
    } catch (error) {
      log.error('Error checking pending notification:', error);
    }
  };

  // Show notification in foreground
  showForegroundNotification = (remoteMessage: any) => {
    const { notification, data } = remoteMessage;

    Alert.alert(
      notification?.title || 'Notification',
      notification?.body || 'You have a new message',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Open',
          onPress: () => this.handleNotificationNavigation(remoteMessage),
        },
      ],
    );
  };

  // Handle background notification
  handleBackgroundNotification = (remoteMessage: any) => {
    log.debug('Processing background notification:', remoteMessage);
    AsyncStorage.setItem('pendingNotification', JSON.stringify(remoteMessage));
  };

  // Handle notification navigation
  handleNotificationNavigation = (remoteMessage: any) => {
    const { data, notification } = remoteMessage;
    log.debug('Handling notification navigation:', data);

    if (data?.screen) {
      this.storeNavigationData(remoteMessage);

      const tryNavigate = (attempt = 1) => {
        if (_navigator || navigationRef.isReady()) {
          const nav = _navigator || navigationRef;
          if (data.screen === 'ProfileTab' || data.screen === 'Profile') {
            nav.navigate('MainTabs', {
              screen: 'Profile',
            });
          } else {
            nav.navigate(data.screen, data.params);
          }
        } else if (attempt < 5) {
          setTimeout(() => tryNavigate(attempt + 1), 1000 * attempt);
        } else {
          log.warn('Failed to navigate after 5 attempts');
          _pendingNavigation = { screen: data.screen, params: data.params };
        }
      };

      tryNavigate();
    }
  };

  // Subscribe to topic
  subscribeToTopic = async (topic: string) => {
    try {
      await messaging().subscribeToTopic(topic);
      log.debug(`Subscribed to topic: ${topic}`);
    } catch (error) {
      log.error('Subscribe to topic error:', error);
    }
  };

  // Unsubscribe from topic
  unsubscribeFromTopic = async (topic: string) => {
    try {
      await messaging().unsubscribeFromTopic(topic);
      log.debug(`Unsubscribed from topic: ${topic}`);
    } catch (error) {
      log.error('Unsubscribe from topic error:', error);
    }
  };

  // Delete FCM token
  deleteToken = async () => {
    try {
      await messaging().deleteToken();
      log.debug('FCM token deleted');
    } catch (error) {
      log.error('Delete token error:', error);
    }
  };

  // Check if app has notification permission
  hasPermission = async () => {
    try {
      const authStatus = await messaging().hasPermission();
      return (
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
      );
    } catch (error) {
      log.error('Check permission error:', error);
      return false;
    }
  };

  // Get notification settings
  getNotificationSettings = async () => {
    try {
      const settings = await messaging().requestPermission();
      return settings;
    } catch (error) {
      log.error('Get settings error:', error);
    }
  };
}

// Export singleton instance
export default new NotificationService();
