import log from '../utils/logger';
import activitiesApi from '../api/activityApi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Query keys for consistent caching
const ACTIVITY_QUERY_KEYS = {
  all: ['activities'] as const,
  lists: () => [...ACTIVITY_QUERY_KEYS.all, 'list'] as const,
  list: (params: any) => [...ACTIVITY_QUERY_KEYS.lists(), params] as const,
  details: () => [...ACTIVITY_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...ACTIVITY_QUERY_KEYS.details(), id] as const,
  search: (searchTerm: string) =>
    [...ACTIVITY_QUERY_KEYS.all, 'search', searchTerm] as const,
  bulk_update: (Ids: string[]) =>
    [...ACTIVITY_QUERY_KEYS.all, 'bulk_update', Ids] as const,
};

export const useActivitiesQueries = () => {
  const queryClient = useQueryClient();

  // Get activitie list query - this is the main data fetching
  const useActivitiesList = (
    params: {
      page?: number;
      page_size?: number;
      sorting?: string;
      search?: string;
      fields?: string[];
    } = {},
  ) => {
    try {
      return useQuery({
        queryKey: ACTIVITY_QUERY_KEYS.list(params),
        queryFn: () => activitiesApi.getActivities(params),
        staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh for 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes - cache stays for 10 minutes
        retry: 2, // Only retry 2 times on failure
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 5000), // Max 5 second delay
        refetchOnWindowFocus: false, // Don't refetch when window gains focus
        refetchOnMount: true, // Refetch when component mounts
        refetchOnReconnect: true, // Refetch when network reconnects
      });
    } catch (error) {
      throw error;
    }
  };

  // Get activities by ID query
  const useActivitiesDetail = (id: string, enabled: boolean = true) => {
    return useQuery({
      queryKey: ACTIVITY_QUERY_KEYS.detail(id),
      queryFn: () => activitiesApi.getActivitiesById(id),
      enabled: enabled && !!id, // Only run if enabled and ID exists
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 2,
    });
  };

  // Search activities query
  const useActivitiesSearch = (
    searchTerm: string,
    enabled: boolean = false,
  ) => {
    return useQuery({
      queryKey: ACTIVITY_QUERY_KEYS.search(searchTerm),
      queryFn: () => activitiesApi.searchCustomers(searchTerm),
      enabled: enabled && searchTerm.length > 2, // Only search if enabled and term is long enough
      staleTime: 2 * 60 * 1000, // 2 minutes for search results
      gcTime: 5 * 60 * 1000,
      retry: 1, // Only retry once for search
    });
  };

  // Mutations for create/update/delete operations
  const createActivitiesMutation = useMutation({
    mutationFn: (activitiesData: Record<string, any>) =>
      activitiesApi.createActivities(activitiesData),
    onSuccess: () => {
      // Invalidate and refetch activitie list
      queryClient.invalidateQueries({ queryKey: ACTIVITY_QUERY_KEYS.lists() });
    },
    onError: error => {
      log.error('Error creating activities:', error);
    },
  });

  const updateActivitiesMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, any> }) =>
      activitiesApi.updateActivities(id, data),
    onSuccess: (_, variables) => {
      // Invalidate both list and detail queries
      queryClient.invalidateQueries({ queryKey: ACTIVITY_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: ACTIVITY_QUERY_KEYS.detail(variables.id),
      });
    },
    onError: error => {
      log.error('Error updating activities:', error);
    },
  });

  const deleteActivitiesMutation = useMutation({
    mutationFn: (id: string[]) => activitiesApi.deleteActivities(id),
    onSuccess: () => {
      // Invalidate activities list
      queryClient.invalidateQueries({ queryKey: ACTIVITY_QUERY_KEYS.lists() });
    },
    onError: error => {
      log.error('Error deleting activities:', error);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: (payload: any) => activitiesApi.bulkUpdateActivities(payload),
    onSuccess: () => {
      // Invalidate and refetch activities list
      queryClient.invalidateQueries({ queryKey: ACTIVITY_QUERY_KEYS.lists() });
    },
    onError: error => {
      log.error('Error creating activities:', error);
    },
  });

  const useMetaData = () => {
    return useQuery({
      queryKey: [...ACTIVITY_QUERY_KEYS.all, 'metadata'],
      queryFn: activitiesApi.getMetaData,
      select: response => response?.data,
      staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh for 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes - cache stays for 10 minutes
      retry: 2, // Only retry 2 times on failure
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 5000), // Max 5 second delay
      refetchOnWindowFocus: false, // Don't refetch when window gains focus
      refetchOnMount: true, // Refetch when component mounts
      refetchOnReconnect: true, // Refetch when network reconnects
    });
  };

  const useFormBuild = (id?: string | number, enabled: boolean = true) => {
    const idIsPresent = id !== undefined && id !== null && `${id}`.length > 0;
    const idAsString = idIsPresent ? String(id) : undefined;
    return useQuery({
      queryKey: [...ACTIVITY_QUERY_KEYS.all, 'formBuild', idAsString],
      queryFn: () => activitiesApi.getFormBuild(idAsString as string),
      enabled: enabled && idIsPresent,
      select: response => response?.data,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 2,
      refetchOnMount: true,
      refetchOnReconnect: true,
    });
  };

  const useSearchFilter = (contentTypeId: string, enabled: boolean = true) => {
    return useQuery({
      queryKey: [...ACTIVITY_QUERY_KEYS.all, 'searchFilter', contentTypeId],
      queryFn: () => activitiesApi.getSearchFilter(contentTypeId),
      enabled: enabled && !!contentTypeId,
      select: response => response?.data,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 2,
      refetchOnMount: true,
      refetchOnReconnect: true,
    });
  };
  return {
    // Query hooks
    useActivitiesList,
    useActivitiesDetail,
    useActivitiesSearch,
    useMetaData,
    useFormBuild,
    useSearchFilter,

    // Mutation functions
    createActivities: createActivitiesMutation.mutateAsync,
    isCreatingActivities: createActivitiesMutation.isPending,
    createActivitiesError: createActivitiesMutation.error,

    updateActivities: updateActivitiesMutation.mutateAsync,
    isUpdatingActivities: updateActivitiesMutation.isPending,
    updateActivitiesError: updateActivitiesMutation.error,

    deleteActivities: deleteActivitiesMutation.mutateAsync,
    isDeletingActivities: deleteActivitiesMutation.isPending,
    deleteActivitiesError: deleteActivitiesMutation.error,

    // Reset functions
    resetCreateActivities: createActivitiesMutation.reset,
    resetUpdateActivities: updateActivitiesMutation.reset,
    resetDeleteActivities: deleteActivitiesMutation.reset,

    // Query invalidation helpers
    invalidateActivitiesList: () =>
      queryClient.invalidateQueries({ queryKey: ACTIVITY_QUERY_KEYS.lists() }),
    invalidateActivitiesDetail: (id: string) =>
      queryClient.invalidateQueries({
        queryKey: ACTIVITY_QUERY_KEYS.detail(id),
      }),

    statusUpdate: updateStatusMutation.mutateAsync,
    isstatusUpdate: updateStatusMutation.isPending,
    statusUpdateError: updateStatusMutation.error,
  };
};

export default useActivitiesQueries;
