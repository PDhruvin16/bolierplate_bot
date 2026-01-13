import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from '../store';

// Typed useSelector hook
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Typed useDispatch hook
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Custom hook for auth state
export const useAuthState = () => {
  return useAppSelector((state: RootState) => state.auth);
};

// Custom hook for customer state
export const useCustomerState = () => {
  return useAppSelector((state: RootState) => state.customers);
};

// Custom hook for lead state
export const useLeadState = () => {
  return useAppSelector((state: RootState) => state.leads);
};

// Custom hook for notification state
export const useNotificationState = () => {
  return useAppSelector((state: RootState) => state.notifications);
};

// Custom hook for network state
export const useNetworkState = () => {
  return useAppSelector((state: RootState) => state.network);
};

// Custom hook for user data
export const useUser = () => {
  return useAppSelector((state: RootState) => state.auth.user);
};

// Custom hook for authentication status
export const useIsAuthenticated = () => {
  return useAppSelector((state: RootState) => state.auth.isAuthenticated);
};

// Custom hook for loading state
export const useIsLoading = () => {
  return useAppSelector((state: RootState) => state.auth.isLoading);
};

// Custom hook for error state
export const useError = () => {
  return useAppSelector((state: RootState) => state.auth.error);
};
