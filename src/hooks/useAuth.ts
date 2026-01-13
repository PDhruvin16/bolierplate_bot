// Re-export Redux auth hooks
// export { useAuthState, useUser, useIsAuthenticated, useIsLoading, useError } from './useRedux';

import { useAuthState, useAppDispatch } from './useRedux';
import {
  checkAuthStatus,
  logoutUser,
  refreshUserProfile,
  setCredentials,
} from '../store/slices/authSlice';
import { useMutation } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '../utils/storage';
import authService from '../services/authService';

// Legacy hook for backward compatibility
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const authState = useAuthState();

  const loginMutation = useMutation({
    mutationFn: async (credentials: { otp?: string }) => {
      if (!credentials.otp) {
        throw new Error('OTP is required');
      }
      return authService.loginWithOTP(credentials.otp);
    },
    onSuccess: async (response: any) => {
      try {
        const token = response.token;
        if (token) {
          await storage.setString('authToken', token);
        }

        const userData = response.user;
        await AsyncStorage.setItem('userData', JSON.stringify(userData));

        dispatch(
          setCredentials({
            user: userData,
            accessToken: token,
            refreshToken: null,
          }),
        );
      } catch (e) {
        throw e;
      }
    },
  });

  const loginFunction = async (formValues: { otp?: string }) => {
    return loginMutation.mutateAsync(formValues);
  };

  return {
    ...authState,
    login: loginFunction,
    checkAuthStatus: () => dispatch(checkAuthStatus()).unwrap(),
    logout: () => dispatch(logoutUser()).unwrap(),
    refreshProfile: () => dispatch(refreshUserProfile()).unwrap(),
    // Merge mutation state for convenience in UI
    isLoading: authState.isLoading || loginMutation.isPending,
    error: (authState as any).error || (loginMutation.error as any) || null,
    register: () => {},
    updateUser: () => {},
    clearError: () => {},
  };
};

// Additional authentication-related hooks
export const useAuthStatus = () => {
  const { isAuthenticated, isLoading } = useAuthState();
  return { isAuthenticated, isLoading };
};
