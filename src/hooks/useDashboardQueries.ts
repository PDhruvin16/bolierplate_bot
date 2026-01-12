import { useQuery } from '@tanstack/react-query';
import customerApi from '../api/customerApi';

// Query keys for consistent caching
const DASHBOARD_QUERY_KEYS = {
  all: ['dashboard'] as const,
  kpiCards: () => [...DASHBOARD_QUERY_KEYS.all, 'kpi-cards'] as const,
  caseManagement: () =>
    [...DASHBOARD_QUERY_KEYS.all, 'case-management'] as const,
};

// Types for Dashboard KPI API response
interface DashboardKpiResponse {
  total_customer?: {
    total_customers?: number;
    last_year_percentage?: number;
    is_permission?: boolean;
  };
  cases_counts?: {
    open_case?: { count?: number; change?: number };
    escalated_cases?: { count?: number; change?: number };
    cancelled_cases?: { count?: number; change?: number };
    resolved_case?: { count?: number; change?: number };
    is_permission?: boolean;
  };
  star_feedback?: {
    total_feedback?: number;
    five_star_feedback?: number;
    percentage_change?: number;
    is_permission?: boolean;
  };
}

export const useDashboardQueries = () => {
  // WARNING: Only use these hooks ONCE per screen/component tree!
  // If you use useDashboardKpiCards or useDashboardCaseManagement in multiple components
  // with the same queryKey, React Query will refetch on each mount.
  // Instead, call the hook in the parent and pass data to children.

  // Get dashboard KPI cards query
  const useDashboardKpiCards = (enabled: boolean = true) => {
    return useQuery({
      queryKey: DASHBOARD_QUERY_KEYS.kpiCards(),
      queryFn: () => customerApi.getDashboardKpiCards(),
      enabled, // Allow enabling/disabling the query
      staleTime: 10 * 60 * 1000, // 10 minutes - dashboard data can be stale longer
      gcTime: 15 * 60 * 1000, // 15 minutes - keep in cache longer
      retry: 2, // Only retry 2 times
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 5000),
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnMount: true, // Don't refetch when component mounts (prevents repeated calls)
      refetchOnReconnect: true, // Refetch when network reconnects
    });
  };

  // Get dashboard case management query
  const useDashboardCaseManagement = (enabled: boolean = true) => {
    return useQuery({
      queryKey: DASHBOARD_QUERY_KEYS.caseManagement(),
      queryFn: () => customerApi.getDashboardCaseManagement(),
      enabled, // Allow enabling/disabling the query
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 15 * 60 * 1000, // 15 minutes
      retry: 2,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 5000),
      refetchOnWindowFocus: false,
      refetchOnMount: true, // Don't refetch when component mounts
      refetchOnReconnect: true,
    });
  };

  return {
    // Query hooks
    useDashboardKpiCards,
    useDashboardCaseManagement,
  };
};

export default useDashboardQueries;
