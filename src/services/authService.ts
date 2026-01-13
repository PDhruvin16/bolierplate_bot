import AsyncStorage from '@react-native-async-storage/async-storage';
import authApi from '../api/authApi';
import log from '../utils/logger';

export const authService = {
  // OTP Login (fixed OTP: 123456)
  loginWithOTP: async (otp: string) => {
    try {
      // Fixed OTP for now
      if (otp !== '123456') {
        throw new Error('Invalid OTP. Please enter 123456');
      }

      // Mock user data for successful login
      const mockUser = {
        id: 1,
        name: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        location: 'Mumbai West',
        role: 'field_agent',
      };

      const mockToken = 'mock-jwt-token-' + Date.now();

      await AsyncStorage.setItem('authToken', mockToken);
      await AsyncStorage.setItem('userData', JSON.stringify(mockUser));

      return {
        token: mockToken,
        user: mockUser,
      };
    } catch (error) {
      log.error('Error in OTP login:', error);
      throw error;
    }
  },

  // Store authentication data
  storeAuthData: async (token: string, user: any) => {
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
      const responseData = response.data || response;

      if (responseData.token) {
        await AsyncStorage.setItem('authToken', responseData.token);
        return responseData.token;
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
