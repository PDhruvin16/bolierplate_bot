import { ENDPOINTS } from './endpoints';
import axiosClient from './axiosClient';
import log from '../utils/logger';

export type CommonListParams = {
  page?: number;
  page_size?: number;
  sorting?: string;
  search?: string;
};

export const commonApi = {
  getAssignList: async () => {
    const url = `${ENDPOINTS.COMMON.ASSIGN_RECORD}`;
    return axiosClient.get(url);
  },
  assignRecord: async (assignRecord: Record<string, any>[], route: string) => {
    const url = `${ENDPOINTS.COMMON[route]}`;
    return axiosClient.post(url, assignRecord);
  },
  shareRecord: async (
    shareRecord: Record<string, any>[],
    route: string,
    id: string,
  ) => {
    const url = `${ENDPOINTS.COMMON[route](id)}`;
    return axiosClient.patch(url, shareRecord);
  },
  recent_cases: async (Id: string) => {
    const data = [{
      field: 'contact_id',
      type: 'equal_to',
      value: Id,
    }];
    const url = `${ENDPOINTS.COMMON.RECENT_CASES}`;
    return axiosClient.post(url, data);
  },
  entitlement: async (Id: string) => {
    const data = [{
      field: 'contact_id',
      type: 'equal_to',
      value: Id,
    }];
    const url = `${ENDPOINTS.COMMON.ENTITLEMENT}`;
    return axiosClient.post(url, data);
  }
};

export default commonApi;
