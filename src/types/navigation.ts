import { NavigatorScreenParams } from '@react-navigation/native';
import { Customer, Lead, User } from './api';

// Root Navigator Types
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppTabParamList>;
};

// Auth Navigator Types
export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
  Verification: undefined;
  OtpSuccess: undefined;
};

// Main App Tab Navigator Types
export type AppTabParamList = {
  Dashboard: undefined;
  Customers: NavigatorScreenParams<CustomerStackParamList>;
  Leads: NavigatorScreenParams<LeadStackParamList>;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
};

// Customer Stack Navigator Types
export type CustomerStackParamList = {
  CustomerList: CustomerListParams;
  CustomerDetail: { customerId: string };
  CustomerCreate: undefined;
  CustomerEdit: { customer: Customer };
  CustomerNotes: { customerId: string };
  CustomerActivities: { customerId: string };
};

export interface CustomerListParams {
  filters?: {
    search?: string;
    status?: string;
    source?: string;
    assignedTo?: string;
  };
}

// Lead Stack Navigator Types
export type LeadStackParamList = {
  LeadList: LeadListParams;
  LeadDetail: { leadId: string };
  LeadCreate: undefined;
  LeadEdit: { lead: Lead };
  LeadNotes: { leadId: string };
  LeadActivities: { leadId: string };
};

export interface LeadListParams {
  filters?: {
    search?: string;
    status?: string;
    source?: string;
    priority?: string;
    assignedTo?: string;
  };
}

// Profile Stack Navigator Types
export type ProfileStackParamList = {
  Profile: undefined;
  ProfileEdit: { user: User };
  Settings: undefined;
  Notifications: undefined;
  ChangePassword: undefined;
  About: undefined;
  Help: undefined;
};

// Modal Navigator Types
export type ModalStackParamList = {
  ImagePicker: ImagePickerParams;
  DocumentPicker: DocumentPickerParams;
  Confirmation: ConfirmationParams;
  Filter: FilterParams;
  Sort: SortParams;
};

export interface ImagePickerParams {
  onImageSelected: (image: string) => void;
  maxImages?: number;
  allowsEditing?: boolean;
}

export interface DocumentPickerParams {
  onDocumentSelected: (document: any) => void;
  type?: string[];
  multiple?: boolean;
}

export interface ConfirmationParams {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  type?: 'danger' | 'warning' | 'info';
}

export interface FilterParams {
  filters: any;
  onApply: (filters: any) => void;
  onReset: () => void;
}

export interface SortParams {
  currentSort: string;
  sortOptions: Array<{ label: string; value: string }>;
  onSort: (sortBy: string) => void;
}

// Navigation Props Types
export type NavigationProps<T extends keyof any> = {
  navigation: any;
  route: {
    params: T;
  };
};

// Screen Props Types
export type ScreenProps<T = any> = {
  navigation: any;
  route: {
    params: T;
  };
};

// Navigation Hook Types
export type UseNavigationType = {
  navigate: (screen: string, params?: any) => void;
  goBack: () => void;
  push: (screen: string, params?: any) => void;
  pop: (count?: number) => void;
  popToTop: () => void;
  replace: (screen: string, params?: any) => void;
  reset: (state: any) => void;
  setOptions: (options: any) => void;
  canGoBack: () => boolean;
  isFocused: () => boolean;
  addListener: (event: string, callback: any) => void;
  removeListener: (event: string, callback: any) => void;
};

export type UseRouteType<T = any> = {
  params: T;
  key: string;
  name: string;
};
