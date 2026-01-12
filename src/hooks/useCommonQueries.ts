import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import commonApi from '../api/commonApi';
import log from '../utils/logger';

// Query keys for consistent caching
const COMMON_QUERY_KEYS = {
  all: ['COMMONs'] as const,
  lists: () => [...COMMON_QUERY_KEYS.all, 'list'] as const,
  list: (params: any) => [...COMMON_QUERY_KEYS.lists(), params] as const,
  details: () => [...COMMON_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...COMMON_QUERY_KEYS.details(), id] as const,
  search: (searchTerm: string) =>
    [...COMMON_QUERY_KEYS.all, 'search', searchTerm] as const,
  bulk_update: (Ids: string[]) =>
    [...COMMON_QUERY_KEYS.all, 'bulk_update', Ids] as const,
};

export const useCommonQueries = () => {
  const queryClient = useQueryClient();

  // Get COMMON list query - this is the main data fetching
  const useAssignList = () => {
    return useQuery({
      queryKey: COMMON_QUERY_KEYS.lists(),
      queryFn: () => commonApi.getAssignList(),
      staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh for 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes - cache stays for 10 minutes
      retry: 2, // Only retry 2 times on failure
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 5000), // Max 5 second delay
      refetchOnWindowFocus: false, // Don't refetch when window gains focus
      refetchOnMount: true, // Refetch when component mounts
      refetchOnReconnect: true, // Refetch when network reconnects
    });
  };

  // Create account mutation
  const assignRecordMutation = useMutation({
    mutationFn: (accountData: Record<string, any>) =>
      commonApi.assignRecord(accountData.data, accountData.route),
    onSuccess: () => {
      // Invalidate and refetch account list
      queryClient.invalidateQueries({ queryKey: ['common'] });
    },
    onError: error => {
      log.error('Error assigning record:', error);
    },
  });

  // Create share mutation
  const shareModuleMutation = useMutation({
    mutationFn: (shareData: Record<string, any>) =>
      commonApi.shareRecord(shareData.data, shareData.route, shareData.id),
    onSuccess: () => {
      // Invalidate and refetch account list
      queryClient.invalidateQueries({ queryKey: ['common'] });
    },
    onError: error => {
      log.error('Error assigning record:', error);
    },
  });

  const useRecentCasesList =  (Id: string,
    enabled: boolean = true,) => {
    return useQuery({
      queryKey: COMMON_QUERY_KEYS.lists(),
      queryFn: () => commonApi.recent_cases(Id),
      enabled: !!Id && enabled,
      staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh for 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes - cache stays for 10 minutes
      retry: 2, // Only retry 2 times on failure
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 5000), // Max 5 second delay
      refetchOnWindowFocus: false, // Don't refetch when window gains focus
      refetchOnMount: true, // Refetch when component mounts
      refetchOnReconnect: true, // Refetch when network reconnects
    });
  };

   const useEntitlementList =  (Id: string,
    enabled: boolean = true,) => {
    return useQuery({
      queryKey: COMMON_QUERY_KEYS.lists(),
      queryFn: () => commonApi.entitlement(Id),
      enabled: !!Id && enabled,
      staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh for 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes - cache stays for 10 minutes
      retry: 2, // Only retry 2 times on failure
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 5000), // Max 5 second delay
      refetchOnWindowFocus: false, // Don't refetch when window gains focus
      refetchOnMount: true, // Refetch when component mounts
      refetchOnReconnect: true, // Refetch when network reconnects
    });
  };

  return {
    useAssignList,
    assignRecordMutation,
    shareModuleMutation,
    useRecentCasesList,
    useEntitlementList
  };
};

export default useCommonQueries;
