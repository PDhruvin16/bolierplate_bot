import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import accountApi, {
  Account,
  AccountCreatePayload,
  AccountUpdatePayload,
  AccountListParams,
} from '../api/accountApi';
import log from '../utils/logger';

// Query keys for consistent caching
const ACCOUNT_QUERY_KEYS = {
  all: ['accounts'] as const,
  lists: () => [...ACCOUNT_QUERY_KEYS.all, 'list'] as const,
  list: (params: any) => [...ACCOUNT_QUERY_KEYS.lists(), params] as const,
  details: () => [...ACCOUNT_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...ACCOUNT_QUERY_KEYS.details(), id] as const,
  search: (searchTerm: string) =>
    [...ACCOUNT_QUERY_KEYS.all, 'search', searchTerm] as const,
  bulk_update: (Ids: string[]) =>
    [...ACCOUNT_QUERY_KEYS.all, 'bulk_update', Ids] as const,
};

// Minimal data transformation - ONLY include fields that are being updated
const transformAccountDataForUpdate = (data: any, originalData: any = {}) => {
  log.info('🔄 Transforming account data for UPDATE (minimal approach)...');
  log.info('📥 Input data:', data);
  log.info('📋 Original data:', originalData);

  const transformed: any = {};

  // List of fields that can be updated
  const updateableFields = [
    'name',
    'description',
    'account_number',
    'email1',
    'email2',
    'phone_number1',
    'phone_number2',
    'website',
    'number_of_employees',
    'industry',
    'ownership',
    'sic_code',
    'revenue',
    'credit_limit',
  ];

  // Only include fields that are different from original AND have values
  updateableFields.forEach(field => {
    const newValue = data[field];
    const originalValue = originalData[field];

    // Only include if the value has changed AND is not empty (unless it's explicitly set to null/empty)
    if (newValue !== undefined && newValue !== originalValue) {
      if (field === 'number_of_employees' && newValue) {
        transformed[field] = parseInt(newValue) || 0;
      } else {
        transformed[field] = newValue;
      }
    }
  });

  // Special handling for status fields - only include if they're being updated
  if (data.status && data.status !== originalData.status) {
    // Send only the value, not the object
    transformed.status = data.status.value || data.status;
  }

  if (data.status_reason && data.status_reason !== originalData.status_reason) {
    // Send only the value, not the object
    transformed.status_reason = data.status_reason.value || data.status_reason;
  }

  log.info('📤 Minimal update data (only changed fields):', transformed);
  return transformed;
};

export const useAccountQueries = () => {
  const queryClient = useQueryClient();

  // Query keys
  const QUERY_KEYS = {
    ACCOUNTS: 'accounts',
    ACCOUNT_DETAIL: 'accountDetail',
    METADATA: 'accountMetadata',
    SEARCH_FILTER: 'accountSearchFilter',
    FORM_BUILD: 'accountFormBuild',
  };

  // Get accounts list
  const useAccountList = (params: AccountListParams = {}) => {
    return useQuery({
      queryKey: [QUERY_KEYS.ACCOUNTS, params],
      queryFn: () => accountApi.getAccounts(params),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Get single account
  const useAccountDetail = (accountId: string, enabled: boolean = true) => {
    return useQuery({
      queryKey: [QUERY_KEYS.ACCOUNT_DETAIL, accountId],
      queryFn: async () => {
        log.debug('Fetching account details for ID:', accountId);
        const response = await accountApi.getAccountDetail(accountId);
        log.debug('Account details response:', response);
        return response;
      },
      enabled: !!accountId && enabled,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
  };

  // Update account mutation - MINIMAL APPROACH
  const useUpdateAccount = () => {
    return useMutation({
      mutationFn: async ({
        id,
        data,
        originalData = {},
      }: {
        id: string;
        data: AccountUpdatePayload;
        originalData?: any;
      }) => {
        log.debug('=== UPDATE ACCOUNT DEBUG ===');
        log.debug('Account ID:', id);
        log.debug('Raw update data:', JSON.stringify(data, null, 2));
        log.debug('Original data:', JSON.stringify(originalData, null, 2));

        // Transform data - ONLY include changed fields
        const transformedData = transformAccountDataForUpdate(
          data,
          originalData,
        );

        // If no fields to update, throw error
        if (Object.keys(transformedData).length === 0) {
          throw new Error('No fields to update');
        }

        log.debug(
          'Minimal update data:',
          JSON.stringify(transformedData, null, 2),
        );
        log.debug('Endpoint: PUT /core/account/' + id + '/');

        try {
          const response = await accountApi.updateAccount(id, transformedData);
          log.info('🚀 Update successful:', response);
          return response;
        } catch (error: any) {
          log.error('Update failed:', error);
          log.error('Error response data:', error.response?.data);
          log.error('Error status:', error.response?.status);

          // Enhanced error logging for validation errors
          if (error.response?.data?.data) {
            log.error('=== VALIDATION ERRORS ===');
            error.response.data.data.forEach((err: any, index: number) => {
              log.error(`Error ${index + 1}:`, err);
            });
          }

          const detailedError = new Error(
            `Update failed: ${error.response?.data?.message || error.message}`,
          );
          (detailedError as any).response = error.response;
          throw detailedError;
        }
      },
      onSuccess: (data, variables) => {
        // Invalidate accounts list and specific account detail
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNTS] });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.ACCOUNT_DETAIL, variables.id],
        });
        log.debug('Account updated successfully in cache');
        Alert.alert('Success', 'Account updated successfully');
      },
      onError: (error: any) => {
        log.error('Failed to update account:', error);

        let errorMessage = 'Update failed';

        // Show specific validation errors if available
        if (
          error.response?.data?.data &&
          Array.isArray(error.response.data.data)
        ) {
          const validationErrors = error.response.data.data
            .map((err: any) => {
              if (typeof err === 'object') {
                const field = Object.keys(err)[0];
                return `${field}: ${err[field]}`;
              }
              return String(err);
            })
            .join('\n');

          errorMessage = `Validation Errors:\n${validationErrors}`;
        } else {
          errorMessage = error.message || 'Update failed';
        }

        Alert.alert('Update Failed', errorMessage);
      },
    });
  };

  // Get metadata
  const useMetaData = () => {
    return useQuery({
      queryKey: [ACCOUNT_QUERY_KEYS.all, 'metadata'],
      queryFn: () => accountApi.getMetaData(),
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  // Get search filter data
  const useSearchFilter = (contentTypeId: string, enabled: boolean = true) => {
    return useQuery({
      queryKey: [QUERY_KEYS.SEARCH_FILTER, contentTypeId],
      queryFn: () => accountApi.getSearchFilter(contentTypeId),
      enabled: !!contentTypeId && enabled,
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  // Get form builder data
  const useFormBuild = (
    navigationModuleId: string,
    enabled: boolean = true,
  ) => {
    return useQuery({
      queryKey: [QUERY_KEYS.FORM_BUILD, navigationModuleId],
      queryFn: async () => {
        log.debug(
          'Fetching form builder data for navigationModuleId:',
          navigationModuleId,
        );
        const response = await accountApi.getFormBuilder(navigationModuleId);
        log.debug('Form builder response:', response);
        return response;
      },
      enabled: !!navigationModuleId && enabled,
      staleTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
    });
  };

  // Create account mutation - uses different approach with all required fields
  const useCreateAccount = () => {
    return useMutation({
      mutationFn: (accountData: AccountCreatePayload) => {
        log.debug('Creating account with data:', accountData);
        // For creation, we need to send all required fields
        const createData = {
          name: accountData.name || '',
          version_number: 2147483647,
          status: 'active', // Send string value, not object
          status_reason: 'active', // Send string value, not object
          ...accountData,
        };
        return accountApi.createAccount(createData);
      },
      onSuccess: data => {
        // Invalidate and refetch accounts list
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNTS] });
        log.debug('Account created successfully:', data);
        Alert.alert('Success', 'Account created successfully');
      },
      onError: (error: any) => {
        log.error('Failed to create account:', error);
        const errorMessage =
          error.response?.data?.message || error.message || 'Creation failed';
        Alert.alert('Creation Failed', errorMessage);
      },
    });
  };

  // Delete account mutation
  const useDeleteAccount = () => {
    return useMutation({
      mutationFn: (accountId: string) => accountApi.deleteAccount(accountId),
      onSuccess: () => {
        // Invalidate accounts list
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNTS] });
        log.debug('Account deleted successfully');
        Alert.alert('Success', 'Account deleted successfully');
      },
      onError: (error: any) => {
        log.error('Failed to delete account:', error);
        const errorMessage =
          error.response?.data?.message || error.message || 'Deletion failed';
        Alert.alert('Deletion Failed', errorMessage);
      },
    });
  };

  // Delete multiple accounts mutation
  const useDeleteMultipleAccounts = () => {
    return useMutation({
      mutationFn: (accountIds: string[]) =>
        accountApi.deleteMultipleAccounts(accountIds),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNTS] });
        log.debug('Multiple accounts deleted successfully');
        Alert.alert('Success', 'Accounts deleted successfully');
      },
      onError: (error: any) => {
        log.error('Failed to delete multiple accounts:', error);
        const errorMessage =
          error.response?.data?.message || error.message || 'Deletion failed';
        Alert.alert('Deletion Failed', errorMessage);
      },
    });
  };

  // Bulk update accounts mutation
  const useBulkUpdateAccounts = () => {
    return useMutation({
      mutationFn: (updates: Array<{ id: string; update_data: any }>) =>
        accountApi.bulkUpdateAccounts(updates),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNTS] });
        log.debug('Bulk update successful');
        Alert.alert('Success', 'Accounts updated successfully');
      },
      onError: (error: any) => {
        log.error('Bulk update failed:', error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          'Bulk update failed';
        Alert.alert('Update Failed', errorMessage);
      },
    });
  };

  // Legacy functions for backward compatibility
  const deleteAccount = async (accountIds: string | string[]) => {
    try {
      if (Array.isArray(accountIds)) {
        const response = await accountApi.deleteMultipleAccounts(accountIds);
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNTS] });
        return response;
      } else {
        const response = await accountApi.deleteAccount(accountIds);
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNTS] });
        return response;
      }
    } catch (error) {
      log.error('Error deleting account(s):', error);
      throw error;
    }
  };

  const statusUpdate = async (
    updates: Array<{ id: string; update_data: any }>,
  ) => {
    try {
      const response = await accountApi.bulkUpdateAccounts(updates);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNTS] });
      return response;
    } catch (error) {
      log.error('Error updating account status:', error);
      throw error;
    }
  };

  // Loading states from mutations
  const isCreatingAccount = useCreateAccount().isPending;
  const isUpdatingAccount = useUpdateAccount().isPending;
  const isDeletingAccount = useDeleteAccount().isPending;
  const isBulkUpdating = useBulkUpdateAccounts().isPending;

  return {
    // Query hooks
    useAccountList,
    useAccountDetail,
    useMetaData,
    useSearchFilter,
    useFormBuild,

    // Mutation hooks
    useCreateAccount,
    useUpdateAccount,
    useDeleteAccount,
    useDeleteMultipleAccounts,
    useBulkUpdateAccounts,

    // Legacy functions (for backward compatibility)
    deleteAccount,
    statusUpdate,

    // Loading states
    isCreatingAccount,
    isUpdatingAccount,
    isDeletingAccount,
    isBulkUpdating,

    // Export transformation function for testing
    transformAccountDataForUpdate,
  };
};

export default useAccountQueries;
