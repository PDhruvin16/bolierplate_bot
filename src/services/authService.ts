import AsyncStorage from '@react-native-async-storage/async-storage';
import authApi from '../api/authApi';
import log from '../utils/logger';

export const authService = {
  // Store authentication data
  storeAuthData: async (token, user) => {
    try {
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      return true;
    } catch (error) {
      log.error('Error storing auth data:', error);
      return false;
    }
  },

  // Get stored authentication data
  getAuthData: async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userData = await AsyncStorage.getItem('userData');

      if (token && userData) {
        return {
          token,
          user: JSON.parse(userData),
        };
      }
      return null;
    } catch (error) {
      log.error('Error getting auth data:', error);
      return null;
    }
  },

  // Clear authentication data
  clearAuthData: async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      return true;
    } catch (error) {
      log.error('Error clearing auth data:', error);
      return false;
    }
  },

  // Check if user is authenticated
  isAuthenticated: async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      return !!token;
    } catch (error) {
      log.error('Error checking authentication:', error);
      return false;
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const currentToken = await AsyncStorage.getItem('authToken');
      if (!currentToken) {
        throw new Error('No token to refresh');
      }

      const response = await authApi.refreshToken(currentToken);

      if (response.token) {
        await AsyncStorage.setItem('authToken', response.token);
        return response.token;
      }

      throw new Error('Failed to refresh token');
    } catch (error) {
      log.error('Error refreshing token:', error);
      throw error;
    }
  },

  // Validate token
  validateToken: async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        return false;
      }

      // You can add additional token validation logic here
      // For example, check if token is expired
      return true;
    } catch (error) {
      log.error('Error validating token:', error);
      return false;
    }
  },
};

export default authService;
