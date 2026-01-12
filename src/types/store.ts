import { Customer, Lead, User, Notification, DashboardStats } from './api';

// Root State Type
export interface RootState {
  auth: AuthState;
  customers: CustomerState;
  leads: LeadState;
  notifications: NotificationState;
  network: NetworkState;
}

// Auth State Types
export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Customer State Types
export interface CustomerState {
  customers: Customer[];
  currentCustomer: Customer | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  hasMore: boolean;
  filters: CustomerFilters;
}

export interface CustomerFilters {
  search: string;
  status: string;
  source: string;
  assignedTo: string;
  tags: string[];
  dateFrom: string;
  dateTo: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

// Lead State Types
export interface LeadState {
  leads: Lead[];
  currentLead: Lead | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  hasMore: boolean;
  filters: LeadFilters;
}

export interface LeadFilters {
  search: string;
  status: string;
  source: string;
  priority: string;
  assignedTo: string;
  dateFrom: string;
  dateTo: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

// Notification State Types
export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

// Network State Types
export interface NetworkState {
  isConnected: boolean;
  connectionType: string | null;
  isInternetReachable: boolean;
  lastUpdated: string | null;
}

// Action Types
export interface AuthAction {
  type: string;
  payload?: any;
}

export interface CustomerAction {
  type: string;
  payload?: any;
}

export interface LeadAction {
  type: string;
  payload?: any;
}

export interface NotificationAction {
  type: string;
  payload?: any;
}

export interface NetworkAction {
  type: string;
  payload?: any;
}

// Async Thunk Types
export interface AsyncThunkConfig {
  state: RootState;
  dispatch: any;
  rejectValue: string;
  extra?: any;
}

// Selector Types
export type AuthSelector = (state: RootState) => AuthState;
export type CustomerSelector = (state: RootState) => CustomerState;
export type LeadSelector = (state: RootState) => LeadState;
export type NotificationSelector = (state: RootState) => NotificationState;
export type NetworkSelector = (state: RootState) => NetworkState;

// Dispatch Types
export type AppDispatch = any;
export type AppThunk<ReturnType = void> = any;

// Store Configuration Types
export interface StoreConfig {
  reducer: any;
  middleware: any[];
  devTools: boolean;
  preloadedState?: Partial<RootState>;
}

// Persist Configuration Types
export interface PersistConfig {
  key: string;
  storage: any;
  whitelist: string[];
  blacklist: string[];
  transforms?: any[];
  serialize?: boolean;
  deserialize?: boolean;
  timeout?: number;
  debug?: boolean;
}

// Redux Toolkit Types
export interface CreateSliceOptions<State> {
  name: string;
  initialState: State;
  reducers: any;
  extraReducers?: any;
}

export interface SliceCaseReducers<State> {
  [K: string]: (state: State, action: any) => void;
}

// Query Types for React Query
export interface QueryConfig {
  queryKey: string[];
  queryFn: () => Promise<any>;
  staleTime?: number;
  gcTime?: number;
  retry?: number;
  retryDelay?: number;
  refetchOnWindowFocus?: boolean;
  refetchOnReconnect?: boolean;
  refetchOnMount?: boolean;
  enabled?: boolean;
}

export interface MutationConfig {
  mutationFn: (variables: any) => Promise<any>;
  onSuccess?: (data: any, variables: any, context: any) => void;
  onError?: (error: any, variables: any, context: any) => void;
  onSettled?: (data: any, error: any, variables: any, context: any) => void;
  retry?: number;
  retryDelay?: number;
}

// Cache Types
export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
}

export interface CacheConfig {
  maxSize: number;
  ttl: number;
  cleanupInterval: number;
}
