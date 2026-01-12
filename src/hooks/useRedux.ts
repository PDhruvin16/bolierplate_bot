import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../store';

// Typed useSelector hook
export const useAppSelector = useSelector;

// Typed useDispatch hook
export const useAppDispatch: () => AppDispatch = () =>
  useDispatch<AppDispatch>();

// Custom hook for auth state
export const useAuthState = () => {
  return useAppSelector((state: any) => state.auth);
};

// Custom hook for customer state
export const useCustomerState = () => {
  return useAppSelector((state: any) => state.customers);
};

// Custom hook for lead state
export const useLeadState = () => {
  return useAppSelector((state: any) => state.leads);
};

// Custom hook for notification state
export const useNotificationState = () => {
  return useAppSelector((state: any) => state.notifications);
};

// Custom hook for network state
export const useNetworkState = () => {
  return useAppSelector((state: any) => state.network);
};

// Custom hook for user data
export const useUser = () => {
  return useAppSelector((state: any) => state.auth.user);
};

// Custom hook for authentication status
export const useIsAuthenticated = () => {
  return useAppSelector((state: any) => state.auth.isAuthenticated);
};

// Custom hook for loading state
export const useIsLoading = () => {
  return useAppSelector((state: any) => state.auth.isLoading);
};

// Custom hook for error state
export const useError = () => {
  return useAppSelector((state: any) => state.auth.error);
};
