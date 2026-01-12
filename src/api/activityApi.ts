import log from '../utils/logger';
import axiosClient from './axiosClient';
import { ENDPOINTS } from './endpoints';
import axiosClient from './axiosClient';
export type activitiesListParams = {
  page?: number;
  page_size?: number;
  sorting?: string;
  search?: string;
  fields?: string[];
};

export const activitiesApi = {
  // Get all customers
  getActivities: async (
    params:activitiesListParams ={
      page: 1,
      page_size: 50,
      sorting: 'status',
      search: '',
    } ,
  ) => {
    try {
      const { fields, ...otherParams } = params;

      // Build query parameters
      const queryParams = new URLSearchParams();
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
      const url = `${ENDPOINTS.ACTIVITIES.LIST}?${queryParams.toString()}`;
      return axiosClient.get(url);
    } catch (error) {
      log.error("🚀 ~ error:", error)
      throw error;
    }
  },

  // Get activities filtered by regarding_object_id
  getActivitiesByRegarding: async (
    regardingObjectId: string,
    params: activitiesListParams = { page: 1, page_size: 50 },
  ) => {
    try {
      const query = new URLSearchParams(
        Object.entries({
          // page: 1,
          // page_size: 50,
          regarding_object_id: regardingObjectId,
          // ...(params || {}),
        }) as any,
      ).toString();
      const url = `${ENDPOINTS.ACTIVITIES.LIST}?${query}`;
      console.log('🚀 ~ url:', url);
      return axiosClient.get(url);
    } catch (error) {
      throw error;
    }
  },

  // Get customer by ID
  getActivitiesById: async (id: string) => {
    try {
      const response = await axiosClient.get(ENDPOINTS.ACTIVITIES.DETAIL(id));
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create new customer
  createActivities: async (customerData: Record<string, any>) => {
    try {
      const response = await axiosClient.post(
        ENDPOINTS.ACTIVITIES.CREATE,
        customerData,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update customer
  updateActivities: async (id: string, customerData: Record<string, any>) => {
    try {
      const response = await axiosClient.put(
        ENDPOINTS.ACTIVITIES.UPDATE(id),
        customerData,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Search customers
  searchCustomers: async (searchTerm: string, params = {}) => {
    try {
      const response = await axiosClient.get(ENDPOINTS.ACTIVITIES.SEARCH, {
        params: { ...params, q: searchTerm },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  getActivitiesLists: async (
    params: activitiesListParams = { page: 1, page_size: 50 },
  ) => {
    try {
      const query = new URLSearchParams(
        Object.entries({ page: 1, page_size: 50, ...(params || {}) }) as any,
      ).toString();
      const url = `${ENDPOINTS.ACTIVITIES.LIST}?${query}`;
      return axiosClient.get(url);
    } catch (error) {
      throw error;
    }
  },
  bulkUpdateActivities: async (
    updates: Array<{
      id: string;
      update_data: { status?: 'active' | 'inactive' | string };
    }>,
  ) => {
    log.debug('🚀 ~ updates:', updates);
    const url = ENDPOINTS.ACTIVITIES.BULK_UPDATE;
    return axiosClient.put(url, updates);
  },

  getMetaData: async () => {
    try {
      const response = await axiosClient.get(ENDPOINTS.ACTIVITIES.METADATA);
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteActivities: async (ids: string[]) => {
    try {
      const url = ENDPOINTS.ACTIVITIES.MULTI_DELETE;
      const response = await axiosClient.post(url, { ids });
      return response;
    } catch (error) {
      throw error;
    }
  },

  getFormBuild: async (id: string) => {
    try {
      const response = await axiosClient.get(
        ENDPOINTS.ACTIVITIES.FORM_BUILDER(id),
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

export default activitiesApi;
