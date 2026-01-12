import axiosClient from './axiosClient';
import { ENDPOINTS } from './endpoints';
import axiosClient from './axiosClient';

export type EmailListParams = {
  page?: number;
  page_size?: number;
  sorting?: string;
  search?: string;
  fields?: string[];
};

export const contactApi = {
  getEmails: async (
    params: EmailListParams = {
      page: 1,
      page_size: 30,
      sorting: 'status',
      search: '',
    },
  ) => {
    // Extract fields parameter and handle it separately
    const { fields, ...otherParams } = params;
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    
    // Add standard parameters
    Object.entries({
      page: 1,
      page_size: 30,
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
    
    const url = `${ENDPOINTS.EMAIL.LIST}?${queryParams.toString()}`;
    return axiosClient.get(url);
  },
  getEmailById: async (id: string) => {
    const url = ENDPOINTS.EMAIL.DETAIL(id);
    return axiosClient.get(url);
  },
  deleteMultipleEmails: async (ids: string[]) => {
    const url = ENDPOINTS.EMAIL.MULTIDELETE;
    return axiosClient.post(url, { ids });
  },
  bulkUpdateEmails: async (
    updates: Array<{
      id: string;
      update_data: { status?: 'active' | 'inactive' | string };
    }>,
  ) => {
    const url = ENDPOINTS.EMAIL.BULK_UPDATE;
    return axiosClient.put(url, updates);
  },
  getMetaData: async () => {
    try {
      const response = await axiosClient.get(ENDPOINTS.EMAIL.METADATA);
      return response;
    } catch (error) {
      throw error;
    }
  },
  getFormBuild: async (id: string) => {
    try {
      const url = ENDPOINTS.EMAIL.FORM_BUILDER(id);
      const response = await axiosClient.get(url);
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
  createEmail: async (contactData: Record<string, any>) => {
    try {
      const response = await axiosClient.post(
        ENDPOINTS.EMAIL.LIST,
        contactData,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  updateEmail: async (id: string, contactData: Record<string, any>) => {
    try {
      const url = ENDPOINTS.EMAIL.DETAIL(id);
      const response = await axiosClient.put(url, contactData);
      return response;
    } catch (error) {
      throw error;
    }
  },
  getAddressFilter: async (id?: string) => {
    try {
      const url = ENDPOINTS.EMAIL.FILTER_BY_ADDRESS(id);
      // The backend expects POST with empty body
      const response = await axiosClient.post(url, {});
      return response;
    } catch (error) {
      console.log('🚀 ~ error:', error);
      throw error;
    }
  },
  deleteAddress: async (ids: string[]) => {
    try {
      const url = ENDPOINTS.EMAIL.DELETEADDRESS;
      const response = await axiosClient.post(url, ids);
      return response;
    } catch (error) {
      console.log('🚀 ~ error:', error);
      throw error;
    }
  },
};

export default contactApi;
