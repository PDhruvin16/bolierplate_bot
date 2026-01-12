import log from '../utils/logger';
import axiosClient from './axiosClient';
import { ENDPOINTS } from './endpoints';

export type AccountListParams = {
  page?: number;
  page_size?: number;
  sorting?: string;
  search?: string;
  fields?: string[];
};

export type AccountCreatePayload = {
  name: string;
  version_number?: number;
  category?: number;
  customer_type?: number;
  industry?: number;
  ownership?: number;
  payment_terms?: number;
  preferred_contact_method?: number;
  credit_limit?: string;
  market_cap?: string;
  open_revenue?: string;
  revenue?: string;
  exchange_rate?: string;
  created_on_behalf_by?: string;
  default_price_level?: string;
  master?: string;
  updated_on_behalf_by?: string;
  parent_account?: string;
  preferred_service?: string;
  preferred_system_user?: string;
  sla?: string;
  sla_invoked?: string;
  territory?: string;
  transaction_currency?: string;
  description?: string;
  account_number?: string;
  email1?: string;
  email2?: string;
  phone_number1?: string;
  phone_number2?: string;
  website?: string;
  is_credit_on_hold?: boolean;
  is_allowed_email?: boolean;
  is_allowed_phone?: boolean;
  is_allowed_whatsapp?: boolean;
  is_private?: boolean;
  merged?: boolean;
  process?: string;
  stage?: string;
  primary_timezone?: string;
  number_of_employees?: number;
  on_hold_time?: number;
  open_deals?: number;
  shares_out_standing?: number;
  teams_followed?: number;
  timezone_rule_version_number?: number;
  utc_conversion_timezone?: number;
  status_reason?: any;
  account_number_prefix?: string;
  share_to?: string[];
  contact?: string;
  sic_code?: string;
  share_permissions?: Array<{
    user_id: string;
    permission_type: string[];
  }>;
  status?: any;
};

export type AccountUpdatePayload = Partial<AccountCreatePayload>;

export type Account = {
  id: string;
  name: string;
  version_number?: number;
  category?: number;
  address?: any[];
  customer_type?: number;
  industry?: number;
  ownership?: number;
  payment_terms?: number;
  preferred_contact_method?: number;
  credit_limit?: string;
  market_cap?: string;
  open_revenue?: string;
  revenue?: string;
  exchange_rate?: string;
  created_on_behalf_by?: string;
  default_price_level?: string;
  master?: string;
  updated_on_behalf_by?: string;
  parent_account?: string;
  preferred_service?: string;
  preferred_system_user?: string;
  sla?: string;
  sla_invoked?: string;
  territory?: string;
  transaction_currency?: string;
  description?: string;
  owner?: string;
  owning_team?: string;
  account_number?: string;
  email1?: string;
  email2?: string;
  phone_number1?: string;
  phone_number2?: string;
  website?: string;
  is_credit_on_hold?: boolean;
  is_allowed_email?: boolean;
  is_allowed_phone?: boolean;
  is_allowed_whatsapp?: boolean;
  is_private?: boolean;
  merged?: boolean;
  process?: string;
  stage?: string;
  primary_timezone?: string;
  number_of_employees?: number;
  on_hold_time?: number;
  open_deals?: number;
  shares_out_standing?: number;
  teams_followed?: number;
  timezone_rule_version_number?: number;
  utc_conversion_timezone?: number;
  status_reason?: any;
  account_number_prefix?: string;
  share_to?: string[];
  sic_code?: string;
  can_change?: boolean;
  can_delete?: boolean;
  can_view?: boolean;
  can_append?: boolean;
  can_append_to?: boolean;
  can_share?: boolean;
  can_assign?: boolean;
  shared_users?: Array<{
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    permission_type: string[];
  }>;
  user_permission?: string[];
  can_add?: boolean;
  status?: {
    value: string;
    label: string;
  };
  contact?: any[];
};

export type AccountApiResponse = {
  status: boolean;
  error: number;
  data: Account;
  message: string;
};

export type AccountListResponse = {
  status: boolean;
  error: number;
  data: Account[];
  message: string;
  count?: number;
  next?: string;
  previous?: string;
};

export const accountApi = {
  // Get all accounts
  getAccounts: async (params: AccountListParams = {}) => {
    try {
      const query = new URLSearchParams(
        Object.entries({
          page: 1,
          page_size: 30,
          sorting: 'name',
          ...(params || {}),
        }) as any,
      ).toString();
      const url = `${ENDPOINTS.ACCOUNT.LIST}?${query}`;
      return axiosClient.get<AccountListResponse>(url);
    } catch (error) {
      throw error;
    }
  },

  // Get account by ID - Fixed to use httpClient and direct URL
  getAccountById: async (id: string) => {
    try {
      log.debug('Fetching account by ID:', id);
      const response = await axiosClient.get<AccountApiResponse>(
        `/core/account/${id}/`,
      );
      log.debug('Account API response:', response);
      return response;
    } catch (error) {
      log.error('Error fetching account by ID:', error);
      throw error;
    }
  },

  // Create new account
  createAccount: async (accountData: AccountCreatePayload) => {
    try {
      const response = await axiosClient.post<AccountApiResponse>(
        ENDPOINTS.ACCOUNT.LIST,
        accountData,
      );
      return response;
    } catch (error) {
      log.error('Error creating account:', error);
      throw error;
    }
  },

  getAccountDetail: (id: string) => {
    return axiosClient.get(`/core/account/${id}/`);
  },

  // Update account
  updateAccount: async (id: string, data: AccountUpdatePayload) => {
    try {
      console.log('🚀 Sending UPDATE to:', `/core/account/${id}/`);
      console.log('📦 Final payload:', JSON.stringify(data, null, 2));

      const response = await axiosClient.put(`/core/account/${id}/`, data);

      console.log('✅ Update response:', response);
      return response;
    } catch (error) {
      console.error('❌ Update error details:', error?.response?.data);
      throw error;
    }
  },

  // Delete account
  deleteAccount: async (id: string) => {
    try {
      const response = await axiosClient.delete(ENDPOINTS.ACCOUNT.DELETE(id));
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Search accounts
  searchAccounts: async (searchTerm: string, params = {}) => {
    try {
      const response = await axiosClient.get(ENDPOINTS.ACCOUNT.SEARCH, {
        params: { ...params, q: searchTerm },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Bulk update accounts
  bulkUpdateAccounts: async (
    updates: Array<{
      id: string;
      update_data: { status?: 'active' | 'inactive' | string };
    }>,
  ) => {
    try {
      log.debug('Bulk updating accounts:', updates);
      const url = ENDPOINTS.ACCOUNT.BULK_UPDATE;
      return axiosClient.put(url, updates);
    } catch (error) {
      throw error;
    }
  },

  // Get metadata for account form
  getMetaData: async () => {
    try {
      const response = await axiosClient.get(ENDPOINTS.ACCOUNT.METADATA);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete multiple accounts
  deleteMultipleAccounts: async (ids: string[]) => {
    try {
      const url = ENDPOINTS.ACCOUNT.MULTI_DELETE;
      const response = await axiosClient.post(url, { ids });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get form builder data
  getFormBuilder: async (id: string) => {
    try {
      log.debug('Fetching form builder for ID:', id);
      const response = await axiosClient.get(
        ENDPOINTS.ACCOUNT.FORM_BUILDER(id),
      );
      log.debug('Form builder response:', response);
      return response;
    } catch (error) {
      log.error('Error fetching form builder:', error);
      throw error;
    }
  },
  getSearchFilter: async (contentTypeId: string) => {
    try {
      const response = await axiosClient.post(
        '/core/dynamic_view/search_filter/',
        [
          {
            field: 'content_type',
            type: 'equal_to',
            value: contentTypeId,
          },
        ],
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default accountApi;
