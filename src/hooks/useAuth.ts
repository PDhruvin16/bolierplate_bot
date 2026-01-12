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
import authApi from '../api/authApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '../utils/storage';

// Legacy hook for backward compatibility
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const authState = useAuthState();

  const loginMutation = useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      authApi.login(credentials),
    onSuccess: async (response: any, variables) => {
      try {
        await storage.setString('authToken', response.access);
        await storage.setString('refreshToken', response.refresh);
        const userData = {
          id: 'user-id',
          email: variables.email,
          firstName: '',
          lastName: '',
          role: 'user' as const,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await AsyncStorage.setItem('userData', JSON.stringify(userData));

        dispatch(
          setCredentials({
            user: userData,
            accessToken: response.access,
            refreshToken: response.refresh,
          }),
        );
      } catch (e) {
        // If storage fails, surface error via mutation
        throw e;
      }
    },
  });

  const loginFunction = async (formValues: {
    email: string;
    password: string;
  }) => {
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
    // Placeholders for future
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
