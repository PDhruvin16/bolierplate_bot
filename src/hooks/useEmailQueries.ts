import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import log from '../utils/logger';
import emailApi from '../api/emailApi';

const CONTACT_QUERY_KEYS = {
  all: ['emails'] as const,
  lists: () => [...CONTACT_QUERY_KEYS.all, 'list'] as const,
  list: (params: any) => [...CONTACT_QUERY_KEYS.lists(), params] as const,
  details: () => [...CONTACT_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...CONTACT_QUERY_KEYS.details(), id] as const,
  search: (searchTerm: string) =>
    [...CONTACT_QUERY_KEYS.all, 'search', searchTerm] as const,
};

export const useEmailQueries = () => {
  const queryClient = useQueryClient();

  // Get email list query
  const useEmailList = (
    params: {
      page?: number;
      page_size?: number;
      sorting?: string;
      search?: string;
      fields?: string[];
    } = {},
  ) => {
    return useQuery({
      queryKey: CONTACT_QUERY_KEYS.list(params),
      queryFn: () => emailApi.getEmails(params),
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 2,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 5000),
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
    });
  };

  // Get email by ID query
  const useEmailDetail = (id: string, enabled: boolean = true) => {
    return useQuery({
      queryKey: CONTACT_QUERY_KEYS.detail(id),
      queryFn: () => emailApi.getEmailById(id),
      enabled: enabled && !!id,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 2,
    });
  };

  // Search emails query
  // const useEmailSearch = (searchTerm: string, enabled: boolean = false) => {
  //   return useQuery({
  //     queryKey: CONTACT_QUERY_KEYS.search(searchTerm),
  //     queryFn: () => emailApi.searchEmails(searchTerm),
  //     enabled: enabled && searchTerm.length > 2,
  //     staleTime: 2 * 60 * 1000,
  //     gcTime: 5 * 60 * 1000,
  //     retry: 1,
  //   });
  // };

  // Mutations for create/update/delete operations
  const createEmailMutation = useMutation({
    mutationFn: (emailData: Record<string, any>) =>
      emailApi.createEmail(emailData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTACT_QUERY_KEYS.lists() });
    },
    onError: error => {
      log.error('Error creating email:', error);
    },
  });

  const updateEmailMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, any> }) =>
      emailApi.updateEmail(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: CONTACT_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: CONTACT_QUERY_KEYS.detail(variables.id),
      });
    },
    onError: error => {
      log.error('Error updating email:', error);
    },
  });

  const deleteEmailMutation = useMutation({
    mutationFn: (id: string[]) => emailApi.deleteMultipleEmails(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTACT_QUERY_KEYS.lists() });
    },
    onError: error => {
      log.error('Error deleting email:', error);
    },
  });

  const useMetaData = () => {
    return useQuery({
      queryKey: [...CONTACT_QUERY_KEYS.all, 'metadata'],
      queryFn: emailApi.getMetaData,
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
      queryKey: [...CONTACT_QUERY_KEYS.all, 'formBuild', idAsString],
      queryFn: () => emailApi.getFormBuild(idAsString as string),
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
      queryKey: [...CONTACT_QUERY_KEYS.all, 'searchFilter', contentTypeId],
      queryFn: () => emailApi.getSearchFilter(contentTypeId),
      enabled: enabled && !!contentTypeId,
      select: response => response?.data,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 2,
      refetchOnMount: true,
      refetchOnReconnect: true,
    });
  };

  const useAddressFilter = (id?: string) => {
    return useQuery({
      queryKey: [...CONTACT_QUERY_KEYS.all, 'searchFilter', id],
      queryFn: () => emailApi.getAddressFilter(id),
      enabled: true,
      select: response => response?.data,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 2,
      refetchOnMount: true,
      refetchOnReconnect: true,
    });
  };

  const deleteAddressMutation = useMutation({
    mutationFn: (id: string[]) => emailApi.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTACT_QUERY_KEYS.lists() });
    },
    onError: error => {
      console.error('Error deleting email:', error);
    },
  });

  return {
    useEmailList,
    useEmailDetail,
    // useEmailSearch,
    useMetaData,
    useFormBuild,
    useSearchFilter,
    useAddressFilter,

    createEmail: createEmailMutation.mutateAsync,
    isCreatingEmail: createEmailMutation.isPending,
    createEmailError: createEmailMutation.error,

    updateEmail: updateEmailMutation.mutateAsync,
    isUpdatingEmail: updateEmailMutation.isPending,
    updateEmailError: updateEmailMutation.error,

    deleteEmail: deleteEmailMutation.mutateAsync,
    isDeletingEmail: deleteEmailMutation.isPending,
    deleteEmailError: deleteEmailMutation.error,

    deleteAddress: deleteAddressMutation.mutateAsync,
    isDeletingAddress: deleteAddressMutation.isPending,
    deleteAddressError: deleteAddressMutation.error,

    resetCreateEmail: createEmailMutation.reset,
    resetUpdateEmail: updateEmailMutation.reset,
    resetDeleteEmail: deleteEmailMutation.reset,

    invalidateEmailList: () =>
      queryClient.invalidateQueries({ queryKey: CONTACT_QUERY_KEYS.lists() }),
    invalidateEmailDetail: (id: string) =>
      queryClient.invalidateQueries({
        queryKey: CONTACT_QUERY_KEYS.detail(id),
      }),
  };
};

export default useEmailQueries;
