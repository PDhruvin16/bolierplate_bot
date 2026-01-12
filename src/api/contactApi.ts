import axiosClient from './axiosClient';
import { ENDPOINTS } from './endpoints';
import axiosClient from './axiosClient';

export type ContactListParams = {
  page?: number;
  page_size?: number;
  sorting?: string;
  search?: string;
  fields?: string[];
};

export const contactApi = {
  getContacts: async (
    params: ContactListParams = {
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
    
    const url = `${ENDPOINTS.CONTACTS.LIST}?${queryParams.toString()}`;
    return axiosClient.get(url);
  },

  getContactById: async (id: string) => {
    const url = ENDPOINTS.CONTACTS.DETAIL(id);
    return axiosClient.get(url);
  },

  createContact: async (contactData: Record<string, any>) => {
    try {
      const response = await axiosClient.post(
        ENDPOINTS.CONTACTS.LIST,
        contactData,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateContact: async (id: string, contactData: Record<string, any>) => {
    try {
      const url = ENDPOINTS.CONTACTS.DETAIL(id);
      const response = await axiosClient.put(url, contactData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteContact: async (id: string) => {
    try {
      const url = ENDPOINTS.CONTACTS.DETAIL(id);
      const response = await axiosClient.delete(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteMultipleContacts: async (ids: string[]) => {
    const url = ENDPOINTS.CONTACTS.MULTIDELETE;
    return axiosClient.post(url, { ids });
  },

  bulkUpdateContacts: async (
    updates: Array<{
      id: string;
      update_data: { status?: 'active' | 'inactive' | string };
    }>,
  ) => {
    const url = ENDPOINTS.CONTACTS.BULK_UPDATE;
    return axiosClient.put(url, updates);
  },

  getMetaData: async () => {
    try {
      const response = await axiosClient.get(ENDPOINTS.CONTACTS.METADATA);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getFormBuild: async (id: string) => {
    try {
      const url = ENDPOINTS.CONTACTS.FORM_BUILDER(id);
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

  getAddressFilter: async (id?: string) => {
    try {
      const url = ENDPOINTS.CONTACTS.FILTER_BY_ADDRESS(id);
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
      const url = ENDPOINTS.CONTACTS.DELETEADDRESS;
      const response = await axiosClient.post(url, ids);
      return response;
    } catch (error) {
      console.log('🚀 ~ error:', error);
      throw error;
    }
  },

  // Additional methods for contact operations
  getContactStatusOptions: async () => {
    try {
      // Assuming you have an endpoint for contact status options
      const response = await axiosClient.get('/core/contact/status-options/');
      return response;
    } catch (error) {
      throw error;
    }
  },

  getAccountOptions: async () => {
    try {
      // Endpoint to get accounts for dropdown
      const response = await axiosClient.get('/core/account/?page_size=100&fields=id,name');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Search contacts with advanced filtering
  searchContacts: async (searchTerm: string, filters: any = {}) => {
    try {
      const queryParams = new URLSearchParams({
        search: searchTerm,
        ...filters,
      });
      const url = `${ENDPOINTS.CONTACTS.LIST}?${queryParams.toString()}`;
      return axiosClient.get(url);
    } catch (error) {
      throw error;
    }
  },

  // Export contacts to Excel
  exportContacts: async (fields?: string[]) => {
    try {
      const payload = fields && fields.length > 0 ? { fields } : {};
      const response = await axiosClient.post('/core/contact/export_excel/', payload, {
        responseType: 'blob', // Important for file downloads
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get contact template for import
  getContactTemplate: async () => {
    try {
      const response = await axiosClient.get('/core/contact/excel_template/', {
        responseType: 'blob',
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Import contacts from Excel
  importContacts: async (file: FormData) => {
    try {
      const response = await axiosClient.post('/core/contact/import_excel/', file, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get contact activities
  getContactActivities: async (contactId: string) => {
    try {
      const response = await axiosClient.get(`/core/contact/${contactId}/activities/`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get related contacts
  getRelatedContacts: async (contactId: string) => {
    try {
      const response = await axiosClient.get(`/core/contact/${contactId}/related/`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update contact status
  updateContactStatus: async (contactId: string, status: string) => {
    try {
      const url = ENDPOINTS.CONTACTS.DETAIL(contactId);
      const response = await axiosClient.patch(url, { status });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Bulk status update
  bulkStatusUpdate: async (contactIds: string[], status: string) => {
    try {
      const updates = contactIds.map(id => ({
        id,
        update_data: { status },
      }));
      return contactApi.bulkUpdateContacts(updates);
    } catch (error) {
      throw error;
    }
  },

  // Get contact statistics
  getContactStats: async () => {
    try {
      const response = await axiosClient.get('/core/contact/stats/');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Validate contact data before save
  validateContact: async (contactData: Record<string, any>) => {
    try {
      const response = await axiosClient.post('/core/contact/validate/', contactData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Duplicate contact
  duplicateContact: async (contactId: string) => {
    try {
      const response = await axiosClient.post(`/core/contact/${contactId}/duplicate/`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Merge contacts
  mergeContacts: async (primaryContactId: string, duplicateContactIds: string[]) => {
    try {
      const response = await axiosClient.post('/core/contact/merge/', {
        primary_contact: primaryContactId,
        duplicate_contacts: duplicateContactIds,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default contactApi;
