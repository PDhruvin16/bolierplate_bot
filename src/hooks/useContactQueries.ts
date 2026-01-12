import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import contactApi from '../api/contactApi';
import log from '../utils/logger';

const CONTACT_QUERY_KEYS = {
  all: ['contacts'] as const,
  lists: () => [...CONTACT_QUERY_KEYS.all, 'list'] as const,
  list: (params: any) => [...CONTACT_QUERY_KEYS.lists(), params] as const,
  details: () => [...CONTACT_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...CONTACT_QUERY_KEYS.details(), id] as const,
  search: (searchTerm: string) =>
    [...CONTACT_QUERY_KEYS.all, 'search', searchTerm] as const,
};

export const useContactQueries = () => {
  const queryClient = useQueryClient();

  // Get contact list query
  const useContactList = (
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
      queryFn: () => contactApi.getContacts(params),
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 2,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 5000),
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
    });
  };

  // Get contact by ID query
  const useContactDetail = (id: string, enabled: boolean = true) => {
    return useQuery({
      queryKey: CONTACT_QUERY_KEYS.detail(id),
      queryFn: () => contactApi.getContactById(id),
      enabled: enabled && !!id,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 2,
    });
  };

  // Mutations for create/update/delete operations
  const createContactMutation = useMutation({
    mutationFn: (contactData: Record<string, any>) =>
      contactApi.createContact(contactData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTACT_QUERY_KEYS.lists() });
    },
    onError: error => {
      log.error('Error creating contact:', error);
    },
  });

  const updateContactMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, any> }) =>
      contactApi.updateContact(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: CONTACT_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: CONTACT_QUERY_KEYS.detail(variables.id),
      });
    },
    onError: error => {
      log.error('Error updating contact:', error);
    },
  });

  const deleteContactMutation = useMutation({
    mutationFn: (id: string[]) => contactApi.deleteMultipleContacts(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTACT_QUERY_KEYS.lists() });
    },
    onError: error => {
      log.error('Error deleting contact:', error);
    },
  });

  const useMetaData = () => {
    return useQuery({
      queryKey: [...CONTACT_QUERY_KEYS.all, 'metadata'],
      queryFn: contactApi.getMetaData,
      select: response => response?.data,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 2,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 5000),
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
    });
  };

  const useFormBuild = (id?: string | number, enabled: boolean = true) => {
    const idIsPresent = id !== undefined && id !== null && `${id}`.length > 0;
    const idAsString = idIsPresent ? String(id) : undefined;
    return useQuery({
      queryKey: [...CONTACT_QUERY_KEYS.all, 'formBuild', idAsString],
      queryFn: () => contactApi.getFormBuild(idAsString as string),
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
      queryFn: () => contactApi.getSearchFilter(contentTypeId),
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
      queryFn: () => contactApi.getAddressFilter(id),
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
    mutationFn: (id: string[]) => contactApi.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTACT_QUERY_KEYS.lists() });
    },
    onError: error => {
      console.error('Error deleting contact:', error);
    },
  });

  return {
    useContactList,
    useContactDetail,
    useMetaData,
    useFormBuild,
    useSearchFilter,
    useAddressFilter,

    createContact: createContactMutation.mutateAsync,
    useCreateContact: () => createContactMutation,
    isCreatingContact: createContactMutation.isPending,
    createContactError: createContactMutation.error,

    updateContact: updateContactMutation.mutateAsync,
    useUpdateContact: () => updateContactMutation,
    isUpdatingContact: updateContactMutation.isPending,
    updateContactError: updateContactMutation.error,

    deleteContact: deleteContactMutation.mutateAsync,
    isDeletingContact: deleteContactMutation.isPending,
    deleteContactError: deleteContactMutation.error,

    deleteAddress: deleteAddressMutation.mutateAsync,
    isDeletingAddress: deleteAddressMutation.isPending,
    deleteAddressError: deleteAddressMutation.error,

    resetCreateContact: createContactMutation.reset,
    resetUpdateContact: updateContactMutation.reset,
    resetDeleteContact: deleteContactMutation.reset,

    invalidateContactList: () =>
      queryClient.invalidateQueries({ queryKey: CONTACT_QUERY_KEYS.lists() }),
    invalidateContactDetail: (id: string) =>
      queryClient.invalidateQueries({
        queryKey: CONTACT_QUERY_KEYS.detail(id),
      }),
  };
};

export default useContactQueries;
