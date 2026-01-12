import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import log from '../utils/logger';

// Initial state
const initialState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

// Action types
const NOTIFICATION_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  MARK_AS_READ: 'MARK_AS_READ',
  MARK_ALL_AS_READ: 'MARK_ALL_AS_READ',
  DELETE_NOTIFICATION: 'DELETE_NOTIFICATION',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer
const notificationReducer = (state, action) => {
  switch (action.type) {
    case NOTIFICATION_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case NOTIFICATION_ACTIONS.SET_NOTIFICATIONS:
      const unreadCount = action.payload.filter(n => !n.read).length;
      return {
        ...state,
        notifications: action.payload,
        unreadCount,
        isLoading: false,
      };
    case NOTIFICATION_ACTIONS.ADD_NOTIFICATION:
      const newNotifications = [action.payload, ...state.notifications];
      const newUnreadCount = newNotifications.filter(n => !n.read).length;
      return {
        ...state,
        notifications: newNotifications,
        unreadCount: newUnreadCount,
      };
    case NOTIFICATION_ACTIONS.MARK_AS_READ:
      const updatedNotifications = state.notifications.map(notification =>
        notification.id === action.payload
          ? { ...notification, read: true }
          : notification
      );
      const updatedUnreadCount = updatedNotifications.filter(n => !n.read).length;
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: updatedUnreadCount,
      };
    case NOTIFICATION_ACTIONS.MARK_ALL_AS_READ:
      const allReadNotifications = state.notifications.map(notification => ({
        ...notification,
        read: true,
      }));
      return {
        ...state,
        notifications: allReadNotifications,
        unreadCount: 0,
      };
    case NOTIFICATION_ACTIONS.DELETE_NOTIFICATION:
      const filteredNotifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
      const filteredUnreadCount = filteredNotifications.filter(n => !n.read).length;
      return {
        ...state,
        notifications: filteredNotifications,
        unreadCount: filteredUnreadCount,
      };
    case NOTIFICATION_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case NOTIFICATION_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Create context
const NotificationContext = createContext();

// Provider component
export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Load notifications from storage on mount
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      dispatch({ type: NOTIFICATION_ACTIONS.SET_LOADING, payload: true });
      
      const storedNotifications = await AsyncStorage.getItem('notifications');
      if (storedNotifications) {
        const notifications = JSON.parse(storedNotifications);
        dispatch({ type: NOTIFICATION_ACTIONS.SET_NOTIFICATIONS, payload: notifications });
      }
    } catch (error) {
      log.error('Error loading notifications:', error);
      dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: 'Failed to load notifications' });
    }
  };

  const saveNotifications = async (notifications) => {
    try {
      await AsyncStorage.setItem('notifications', JSON.stringify(notifications));
    } catch (error) {
      log.error('Error saving notifications:', error);
    }
  };

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification,
    };
    
    dispatch({ type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION, payload: newNotification });
    
    // Save to storage
    const updatedNotifications = [newNotification, ...state.notifications];
    saveNotifications(updatedNotifications);
  };

  const markAsRead = (notificationId) => {
    dispatch({ type: NOTIFICATION_ACTIONS.MARK_AS_READ, payload: notificationId });
    
    // Save to storage
    const updatedNotifications = state.notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    );
    saveNotifications(updatedNotifications);
  };

  const markAllAsRead = () => {
    dispatch({ type: NOTIFICATION_ACTIONS.MARK_ALL_AS_READ });
    
    // Save to storage
    const updatedNotifications = state.notifications.map(notification => ({
      ...notification,
      read: true,
    }));
    saveNotifications(updatedNotifications);
  };

  const deleteNotification = (notificationId) => {
    dispatch({ type: NOTIFICATION_ACTIONS.DELETE_NOTIFICATION, payload: notificationId });
    
    // Save to storage
    const updatedNotifications = state.notifications.filter(
      notification => notification.id !== notificationId
    );
    saveNotifications(updatedNotifications);
  };

  const clearError = () => {
    dispatch({ type: NOTIFICATION_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    ...state,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearError,
    loadNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use notification context
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext; 