import { useMutation, useQueryClient } from '@tanstack/react-query';
import customerApi from '../api/customerApi';
import { AccountItem } from '../constants/accountData';
import log from '../utils/logger';

export const useAccountMutations = () => {
  const queryClient = useQueryClient();

  // Get account list mutation
  const getAccountListMutation = useMutation({
    mutationFn: (
      params: {
        page?: number;
        page_size?: number;
        sorting?: string;
        search?: string;
        fields?: string[];
      } = {},
    ) => customerApi.getAccountLists(params),
    onSuccess: response => {
      log.debug('Account list fetched successfully:', response.data);
    },
    onError: error => {
      log.error('Error fetching account list:', error);
    },
  });

  // Create account mutation
  const createAccountMutation = useMutation({
    mutationFn: (accountData: Record<string, any>) =>
      customerApi.createCustomer(accountData),
    onSuccess: () => {
      // Invalidate and refetch account list
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
    onError: error => {
      log.error('Error creating account:', error);
    },
  });

  // Update account mutation
  const updateAccountMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, any> }) =>
      customerApi.updateCustomer(id, data),
    onSuccess: () => {
      // Invalidate and refetch account list
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
    onError: error => {
      log.error('Error updating account:', error);
    },
  });

  // Delete account mutation
  const deleteAccountMutation = useMutation({
    mutationFn: (id: string) => customerApi.deleteCustomer(id),
    onSuccess: () => {
      // Invalidate and refetch account list
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
    onError: error => {
      log.error('Error deleting account:', error);
    },
  });

  // Search accounts mutation
  const searchAccountsMutation = useMutation({
    mutationFn: ({
      searchTerm,
      params,
    }: {
      searchTerm: string;
      params?: any;
    }) => customerApi.searchCustomers(searchTerm, params),
    onSuccess: response => {
      log.debug('Search results:', response.data);
    },
    onError: error => {
      log.error('Error searching accounts:', error);
    },
  });

  return {
    // Account list
    getAccountList: getAccountListMutation.mutateAsync,
    isGettingAccountList: getAccountListMutation.isPending,
    accountListError: getAccountListMutation.error,
    accountListData: getAccountListMutation.data,

    // Create account
    createAccount: createAccountMutation.mutateAsync,
    isCreatingAccount: createAccountMutation.isPending,
    createAccountError: createAccountMutation.error,

    // Update account
    updateAccount: updateAccountMutation.mutateAsync,
    isUpdatingAccount: updateAccountMutation.isPending,
    updateAccountError: updateAccountMutation.error,

    // Delete account
    deleteAccount: deleteAccountMutation.mutateAsync,
    isDeletingAccount: deleteAccountMutation.isPending,
    deleteAccountError: deleteAccountMutation.error,

    // Search accounts
    searchAccounts: searchAccountsMutation.mutateAsync,
    isSearchingAccounts: searchAccountsMutation.isPending,
    searchAccountsError: searchAccountsMutation.error,
    searchResults: searchAccountsMutation.data,

    // Reset functions
    resetAccountList: getAccountListMutation.reset,
    resetCreateAccount: createAccountMutation.reset,
    resetUpdateAccount: updateAccountMutation.reset,
    resetDeleteAccount: deleteAccountMutation.reset,
    resetSearchAccounts: searchAccountsMutation.reset,
  };
};

export default useAccountMutations;
