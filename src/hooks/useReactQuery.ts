import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../services/queryClient';
import customerApi from '../api/customerApi';
import authApi from '../api/authApi';
import log from '../utils/logger';

// Customer queries
export const useCustomers = (filters = {}) => {
  return useQuery({
    queryKey: queryKeys.customers.list(filters),
    queryFn: () => customerApi.getCustomers(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCustomer = (id: string) => {
  return useQuery({
    queryKey: queryKeys.customers.detail(id),
    queryFn: () => customerApi.getCustomerById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Customer mutations
export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (customerData: Record<string, any>) =>
      customerApi.createCustomer(customerData),
    onSuccess: newCustomer => {
      // Invalidate and refetch customers list
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.lists() });

      // Add new customer to cache
      queryClient.setQueryData(
        queryKeys.customers.detail(newCustomer.data.id),
        newCustomer,
      );
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, customerData }: { id: string; customerData: any }) =>
      customerApi.updateCustomer(id, customerData),
    onSuccess: updatedCustomer => {
      // Invalidate and refetch customers list
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.lists() });

      // Update customer in cache
      queryClient.setQueryData(
        queryKeys.customers.detail(updatedCustomer.data.id),
        updatedCustomer,
      );
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => customerApi.deleteCustomer(id),
    onSuccess: deletedId => {
      // Invalidate and refetch customers list
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.lists() });

      // Remove customer from cache
      queryClient.removeQueries({
        queryKey: queryKeys.customers.detail(deletedId),
      });
    },
  });
};

// Auth queries
export const useUserProfile = () => {
  return useQuery({
    queryKey: queryKeys.auth.profile,
    queryFn: () => authApi.getProfile(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Dashboard queries
export const useDashboardStats = () => {
  return useQuery({
    queryKey: queryKeys.dashboard.stats,
    queryFn: () => {
      // Mock API call - replace with actual API
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            totalCustomers: 150,
            totalLeads: 25,
            totalRevenue: 50000,
            growthRate: 12.5,
          });
        }, 1000);
      });
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useRecentActivities = () => {
  return useQuery({
    queryKey: queryKeys.dashboard.recentActivities,
    queryFn: () => {
      // Mock API call - replace with actual API
      return new Promise(resolve => {
        setTimeout(() => {
          resolve([
            {
              id: '1',
              type: 'customer_created',
              message: 'New customer John Doe added',
              timestamp: new Date().toISOString(),
            },
            {
              id: '2',
              type: 'lead_converted',
              message: 'Lead Alice Johnson converted to customer',
              timestamp: new Date(Date.now() - 3600000).toISOString(),
            },
          ]);
        }, 1000);
      });
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Custom hook for optimistic updates
export const useOptimisticUpdate = (queryKey: any, updateFn: any) => {
  const queryClient = useQueryClient();

  return (variables: any) => {
    // Cancel any outgoing refetches
    queryClient.cancelQueries({ queryKey });

    // Snapshot the previous value
    const previousData = queryClient.getQueryData(queryKey);

    // Optimistically update to the new value
    queryClient.setQueryData(queryKey, (old: any) => updateFn(old, variables));

    // Return a context object with the snapshotted value
    return { previousData };
  };
};

// Custom hook for error handling
export const useQueryErrorHandler = () => {
  return (error: unknown) => {
    log.error('Query error:', error);
    // You can add global error handling here
    // For example, show a toast notification
  };
};
