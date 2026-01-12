// Global type declarations for CRM App
// This file serves as the main entry point for all type definitions

// Import all types from our organized type system
export * from './src/types';

// Global module declarations
declare module '*.png' {
  const value: any;
  export default value;
}

declare module '*.jpg' {
  const value: any;
  export default value;
}

declare module '*.jpeg' {
  const value: any;
  export default value;
}

declare module '*.gif' {
  const value: any;
  export default value;
}

declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

declare module '*.json' {
  const value: any;
  export default value;
}

// Environment variables
declare global {
  var __DEV__: boolean;
  var __TEST__: boolean;
  var __PROD__: boolean;
  
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      REACT_APP_API_URL: string;
      REACT_APP_ENVIRONMENT: string;
      REACT_APP_VERSION: string;
      REACT_APP_BUILD_NUMBER: string;
    }
  }
}

// React Native specific global types
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: any;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any;
  }
}

// Third-party library type augmentations
declare module '@react-navigation/native' {
  export interface NavigationState {
    index: number;
    routes: Array<{
      key: string;
      name: string;
      params?: any;
    }>;
  }
}

declare module '@reduxjs/toolkit' {
  export interface SerializedError {
    name?: string;
    message?: string;
    code?: string;
    stack?: string;
  }
}

declare module '@tanstack/react-query' {
  export interface QueryClientConfig {
    defaultOptions?: {
      queries?: {
        retry?: number | boolean | ((failureCount: number, error: any) => boolean);
        retryDelay?: number | ((retryAttempt: number) => number);
        staleTime?: number;
        gcTime?: number;
        refetchOnWindowFocus?: boolean;
        refetchOnReconnect?: boolean;
        refetchOnMount?: boolean;
        enabled?: boolean;
      };
      mutations?: {
        retry?: number | boolean | ((failureCount: number, error: any) => boolean);
        retryDelay?: number | ((retryAttempt: number) => number);
      };
    };
  }
}

// Custom type utilities
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type Required<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type NonNullable<T> = T extends null | undefined ? never : T;

export type ValueOf<T> = T[keyof T];

export type ArrayElement<T> = T extends Array<infer U> ? U : never;

export type PromiseType<T> = T extends Promise<infer U> ? U : never;

export type FunctionReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

export type ComponentProps<T> = T extends React.ComponentType<infer P> ? P : never;

// Utility types for React Native
export type RNImageSource = {
  uri: string;
  width?: number;
  height?: number;
  scale?: number;
};

export type RNImageSourceProp = RNImageSource | number | string;

// Event handler types
export type EventHandler<T = any> = (event: T) => void;

export type TouchEventHandler = EventHandler<{
  nativeEvent: {
    locationX: number;
    locationY: number;
    pageX: number;
    pageY: number;
    target: number;
    timestamp: number;
  };
}>;

// Style types
export type StyleProp<T> = T | T[] | null | undefined;

export type ViewStyle = any;
export type TextStyle = any;
export type ImageStyle = any;

// Navigation types
export type NavigationProp<T> = {
  navigate: (screen: keyof T, params?: any) => void;
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

export type RouteProp<T> = {
  params: T;
  key: string;
  name: string;
};

// Redux types
export type RootState = import('./src/types/store').RootState;
export type AppDispatch = import('./src/types/store').AppDispatch;

// API types
export type ApiResponse<T = any> = import('./src/types').ApiResponse<T>;
export type PaginatedResponse<T = any> = import('./src/types').PaginatedResponse<T>;
export type ApiError = import('./src/types').ApiError;

// Component types
export type ButtonProps = import('./src/types/components').ButtonProps;
export type InputProps = import('./src/types/components').InputProps;
export type CardProps = import('./src/types/components').CardProps;
export type ModalProps = import('./src/types/components').ModalProps;
export type LoadingProps = import('./src/types/components').LoadingProps;

// Navigation types
export type RootStackParamList = import('./src/types/navigation').RootStackParamList;
export type AuthStackParamList = import('./src/types/navigation').AuthStackParamList;
export type AppTabParamList = import('./src/types/navigation').AppTabParamList;
export type CustomerStackParamList = import('./src/types/navigation').CustomerStackParamList;
export type LeadStackParamList = import('./src/types/navigation').LeadStackParamList;
export type ProfileStackParamList = import('./src/types/navigation').ProfileStackParamList;

// API entity types
export type User = import('./src/types/api').User;
export type Customer = import('./src/types/api').Customer;
export type Lead = import('./src/types/api').Lead;
export type Notification = import('./src/types/api').Notification;
export type DashboardStats = import('./src/types/api').DashboardStats;
export type Activity = import('./src/types/api').Activity;
