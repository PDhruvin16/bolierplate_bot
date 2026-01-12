// Common utility types and interfaces

// React Native specific types
export interface Dimensions {
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

// Event types
export interface TouchEvent {
  nativeEvent: {
    locationX: number;
    locationY: number;
    pageX: number;
    pageY: number;
    target: number;
    timestamp: number;
  };
}

export interface GestureEvent {
  nativeEvent: {
    absoluteX: number;
    absoluteY: number;
    translationX: number;
    translationY: number;
    velocityX: number;
    velocityY: number;
    x: number;
    y: number;
    state: number;
  };
}

// Permission types
export type PermissionStatus =
  | 'granted'
  | 'denied'
  | 'restricted'
  | 'unavailable';

export interface Permission {
  name: string;
  status: PermissionStatus;
  canAskAgain: boolean;
}

// File types
export interface FileInfo {
  name: string;
  size: number;
  type: string;
  uri: string;
  lastModified?: number;
}

export interface ImageInfo {
  uri: string;
  width: number;
  height: number;
  type?: string;
  size?: number;
}

// Network types
export interface NetworkInfo {
  isConnected: boolean;
  isInternetReachable: boolean;
  type: string;
  isWifi: boolean;
  isCellular: boolean;
  details?: {
    isConnectionExpensive?: boolean;
    cellularGeneration?: string;
    carrier?: string;
  };
}

// Device types
export interface DeviceInfo {
  brand: string;
  manufacturer: string;
  model: string;
  systemName: string;
  systemVersion: string;
  uniqueId: string;
  deviceId: string;
  appVersion: string;
  buildNumber: string;
  bundleId: string;
  userAgent: string;
  deviceName: string;
  deviceType: 'Handset' | 'Tablet' | 'Tv' | 'Desktop' | 'Unknown';
  isTablet: boolean;
  isLocationEnabled: boolean;
  isCameraEnabled: boolean;
  isMicrophoneEnabled: boolean;
}

// Storage types
export interface StorageItem {
  key: string;
  value: string;
  size?: number;
  timestamp?: number;
}

// Validation types
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Form types
export interface FormField {
  name: string;
  value: any;
  error?: string;
  touched: boolean;
  dirty: boolean;
}

export interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  dirty: Record<string, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
  submitCount: number;
}

// Date and time types
export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface TimeRange {
  startTime: string;
  endTime: string;
}

export interface DateTimeRange {
  startDateTime: Date;
  endDateTime: Date;
}

// Color types
export interface Color {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  error: string;
  warning: string;
  success: string;
  info: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  border: string;
  divider: string;
}

// Animation types
export interface AnimationConfig {
  duration: number;
  delay?: number;
  easing?: string;
  useNativeDriver?: boolean;
}

export interface SpringConfig {
  tension: number;
  friction: number;
  useNativeDriver?: boolean;
}

// Gesture types
export interface GestureConfig {
  enabled: boolean;
  simultaneousHandlers?: any[];
  shouldCancelWhenOutside?: boolean;
  hitSlop?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
}

// Modal types
export interface ModalConfig {
  visible: boolean;
  animationType?: 'none' | 'slide' | 'fade';
  transparent?: boolean;
  presentationStyle?:
    | 'fullScreen'
    | 'pageSheet'
    | 'formSheet'
    | 'overFullScreen';
  hardwareAccelerated?: boolean;
  onRequestClose?: () => void;
}

// Alert types
export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

export interface AlertConfig {
  title?: string;
  message?: string;
  buttons?: AlertButton[];
  cancelable?: boolean;
  onDismiss?: () => void;
}

// Toast types
export interface ToastConfig {
  message: string;
  duration?: number;
  position?: 'top' | 'bottom' | 'center';
  type?: 'success' | 'error' | 'warning' | 'info';
  onPress?: () => void;
  onDismiss?: () => void;
}

// Loading types
export interface LoadingConfig {
  visible: boolean;
  text?: string;
  size?: 'small' | 'large';
  color?: string;
  overlay?: boolean;
  transparent?: boolean;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: number;
  stack?: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
}

// Analytics types
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: number;
  userId?: string;
  sessionId?: string;
}

export interface AnalyticsUser {
  id: string;
  properties?: Record<string, any>;
}

// Push notification types
export interface PushNotification {
  id: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  sound?: string;
  badge?: number;
  category?: string;
  threadId?: string;
  timestamp: number;
}

export interface PushNotificationPermission {
  alert: boolean;
  badge: boolean;
  sound: boolean;
  criticalAlert?: boolean;
  announcement?: boolean;
  carPlay?: boolean;
  provisional?: boolean;
  providesAppNotificationSettings?: boolean;
}

// Deep linking types
export interface DeepLink {
  url: string;
  scheme: string;
  host?: string;
  path?: string;
  queryParams?: Record<string, string>;
}

// Biometric types
export interface BiometricType {
  available: boolean;
  type: 'TouchID' | 'FaceID' | 'Biometrics' | null;
  error?: string;
}

export interface BiometricResult {
  success: boolean;
  error?: string;
}

// Crypto types
export interface CryptoKey {
  id: string;
  algorithm: string;
  extractable: boolean;
  type: 'secret' | 'public' | 'private';
  usages: string[];
}

// Cache types
export interface CacheEntry<T = any> {
  key: string;
  value: T;
  timestamp: number;
  ttl: number;
  size?: number;
}

export interface CacheConfig {
  maxSize: number;
  maxAge: number;
  cleanupInterval: number;
  persist?: boolean;
}

// Queue types
export interface QueueItem<T = any> {
  id: string;
  data: T;
  priority: number;
  timestamp: number;
  retries: number;
  maxRetries: number;
}

export interface QueueConfig {
  maxSize: number;
  retryDelay: number;
  maxRetries: number;
  processInterval: number;
}
