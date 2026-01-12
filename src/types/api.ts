import { ApiResponse, PaginatedResponse } from './index';

// API Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'admin' | 'manager' | 'sales' | 'support';

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  position?: string;
  status: CustomerStatus;
  source: CustomerSource;
  assignedTo?: string;
  tags: string[];
  notes?: string;
  lastContact?: string;
  totalRevenue?: number;
  avatar?: string;
  address?: Address;
  socialMedia?: SocialMedia;
  createdAt: string;
  updatedAt: string;
}

export type CustomerStatus =
  | 'active'
  | 'inactive'
  | 'prospect'
  | 'lead'
  | 'customer';
export type CustomerSource =
  | 'website'
  | 'referral'
  | 'social'
  | 'email'
  | 'phone'
  | 'other';

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  status: LeadStatus;
  source: LeadSource;
  assignedTo?: string;
  priority: LeadPriority;
  expectedRevenue?: number;
  notes?: string;
  lastContact?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'proposal'
  | 'negotiation'
  | 'won'
  | 'lost';
export type LeadSource =
  | 'website'
  | 'referral'
  | 'social'
  | 'email'
  | 'phone'
  | 'event'
  | 'other';
export type LeadPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface SocialMedia {
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  data?: any;
  createdAt: string;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface DashboardStats {
  totalCustomers: number;
  totalLeads: number;
  totalRevenue: number;
  growthRate: number;
  monthlyRevenue: number[];
  topCustomers: Customer[];
  recentActivities: Activity[];
}

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  relatedId?: string;
  relatedType?: string;
  createdAt: string;
}

export type ActivityType =
  | 'customer_created'
  | 'customer_updated'
  | 'lead_created'
  | 'lead_converted'
  | 'deal_won'
  | 'deal_lost'
  | 'note_added'
  | 'task_completed';

// API Request types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface CustomerFilters {
  search?: string;
  status?: CustomerStatus;
  source?: CustomerSource;
  assignedTo?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface LeadFilters {
  search?: string;
  status?: LeadStatus;
  source?: LeadSource;
  priority?: LeadPriority;
  assignedTo?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// API Response types
export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface RefreshTokenResponse {
  access: string;
  refresh: string;
}

export interface CustomerResponse extends ApiResponse<Customer> {}
export interface CustomersResponse extends PaginatedResponse<Customer> {}
export interface LeadResponse extends ApiResponse<Lead> {}
export interface LeadsResponse extends PaginatedResponse<Lead> {}
export interface DashboardStatsResponse extends ApiResponse<DashboardStats> {}
export interface NotificationsResponse
  extends PaginatedResponse<Notification> {}
