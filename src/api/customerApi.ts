import log from '../utils/logger';
import axiosClient from './axiosClient';
import { ENDPOINTS } from './endpoints';
// import axiosClient from './axiosClient';
export type AccountListParams = {
  page?: number;
  page_size?: number;
  sorting?: string;
  search?: string;
  fields?: string[];
};

export const customerApi = {
  // Get all customers
  getCustomers: async (params = {}) => {
    try {
      const response = await axiosClient.get(ENDPOINTS.CUSTOMERS.LIST, {
        params,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get customer by ID
  getCustomerById: async (id: string) => {
    try {
      const response = await axiosClient.get(ENDPOINTS.CUSTOMERS.DETAIL(id));
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create new customer
  createCustomer: async (customerData: Record<string, any>) => {
    try {
      const response = await axiosClient.post(
        ENDPOINTS.CUSTOMERS.CREATE,
        customerData,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update customer
  updateCustomer: async (id: string, customerData: Record<string, any>) => {
    try {
      const response = await axiosClient.put(
        ENDPOINTS.CUSTOMERS.UPDATE(id),
        customerData,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete customer
  deleteCustomer: async (id: string[]) => {
    try {
      const response = await axiosClient.post(ENDPOINTS.CUSTOMERS.DELETE(id));
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Search customers
  searchCustomers: async (searchTerm: string, params = {}) => {
    try {
      const response = await axiosClient.get(ENDPOINTS.CUSTOMERS.SEARCH, {
        params: { ...params, q: searchTerm },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Dashboard KPI Cards
  getDashboardKpiCards: async () => {
    try {
      const response = await axiosClient.get(ENDPOINTS.DASHBOARD.KPI_CARDS);
      log.debug('📊 Dashboard KPI Cards response:', response);

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Dashboard Case Management Charts
  getDashboardCaseManagement: async () => {
    try {
      const response = await axiosClient.get(
        ENDPOINTS.DASHBOARD.CASE_MANAGEMENT,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  getAccountLists: async (
    params: AccountListParams = {
      page: 1,
      page_size: 50,
      sorting: 'status',
      search: '',
    },
  ) => {
    try {
      // Extract fields parameter and handle it separately
      const { fields, ...otherParams } = params;

      // Build query parameters
      const queryParams = new URLSearchParams();

      // Add standard parameters
      Object.entries({
        page: 1,
        page_size: 50,
        sorting: 'status',
        ...otherParams,
      }).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });

      // Add fields parameter if provided
      if (fields && Array.isArray(fields) && fields.length > 0) {
        queryParams.append('fields', fields.join(','));
      }

      const url = `${ENDPOINTS.ACCOUNT.LIST}?${queryParams.toString()}`;
      const response :any = await axiosClient.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },
  bulkUpdateAccounts: async (
    updates: Array<{
      id: string;
      update_data: { status?: 'active' | 'inactive' | string };
    }>,
  ) => {
    log.debug('🚀 ~ updates:', updates);
    const url = ENDPOINTS.ACCOUNT.BULK_UPDATE;
    return axiosClient.put(url, updates);
  },

  getMetaData: async () => {
    try {
      const response = await axiosClient.get(ENDPOINTS.ACCOUNT.METADATA);
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteAccount: async (ids: string[]) => {
    try {
      const url = ENDPOINTS.ACCOUNT.MULTI_DELETE;
      const response = await axiosClient.post(url, { ids });
      return response;
    } catch (error) {
      throw error;
    }
  },

  getFormBuild: async (id: string) => {
    try {
      const response = await axiosClient.get(
        ENDPOINTS.ACCOUNT.FORM_BUILDER(id),
      );
      return response;
    } catch (error) {
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

export default customerApi;
