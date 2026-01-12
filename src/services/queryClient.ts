import {
  QueryClient,
  useMutation,
  useQuery,
  type QueryKey,
  type UseMutationOptions,
  type UseQueryOptions,
} from '@tanstack/react-query';

type ActivitiesListParams = {
  page?: number;
  page_size?: number;
  sorting?: string;
  search?: string;
  fields?: string[];
};

// small helper to safely read numeric `status` from unknown error objects
const getStatus = (error: unknown): number | undefined => {
  if (error && typeof error === 'object') {
    if ('status' in (error as Record<string, unknown>)) {
      const s = (error as Record<string, unknown>).status;
      if (typeof s === 'number') {
        return s;
      }
    }
  }
  return undefined;
};

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount: number, error: unknown) => {
        const status = getStatus(error);
        if (status !== undefined && status >= 400 && status < 500) {
          return false;
        }
        return failureCount < 2;
      },
      retryDelay: (attemptIndex: number) =>
        Math.min(1000 * 2 ** attemptIndex, 5000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
    mutations: {
      retry: (failureCount: number, error: unknown) => {
        const status = getStatus(error);
        if (status !== undefined && status >= 400 && status < 500) {
          return false;
        }
        return failureCount < 1;
      },
      retryDelay: 1000,
    },
  },
});

/**
 * Shared defaults (staleTime/gcTime intentionally omitted so callers control them)
 */
const defaultQueryOptions = {
  retry: (failureCount: number, error: unknown) => {
    const status = getStatus(error);
    if (status !== undefined && status >= 400 && status < 500) {
      return false;
    }
    return failureCount < 2;
  },
  retryDelay: (attemptIndex: number) =>
    Math.min(1000 * 2 ** attemptIndex, 5000),
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
  refetchOnMount: true,
} as const;

const defaultMutationOptions = {
  retry: (failureCount: number, error: unknown) => {
    const status = getStatus(error);
    if (status !== undefined && status >= 400 && status < 500) {
      return false;
    }
    return failureCount < 1;
  },
  retryDelay: 1000,
} as const;

/** Centralized query helper that merges shared defaults with per-call overrides */
export const useAppQuery = <
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
>(
  options: UseQueryOptions<TQueryFnData, TError, TData> & {
    queryKey: QueryKey;
    queryFn: () => Promise<TQueryFnData>;
  },
) => {
  const finalOptions: UseQueryOptions<TQueryFnData, TError, TData> = {
    retry: options.retry ?? defaultQueryOptions.retry,
    retryDelay: options.retryDelay ?? defaultQueryOptions.retryDelay,
    refetchOnWindowFocus:
      options.refetchOnWindowFocus ?? defaultQueryOptions.refetchOnWindowFocus,
    refetchOnReconnect:
      options.refetchOnReconnect ?? defaultQueryOptions.refetchOnReconnect,
    refetchOnMount:
      options.refetchOnMount ?? defaultQueryOptions.refetchOnMount,
    ...options,
  };

  if (Object.prototype.hasOwnProperty.call(options, 'staleTime')) {
    finalOptions.staleTime = options.staleTime;
  }
  if (Object.prototype.hasOwnProperty.call(options, 'gcTime')) {
    (finalOptions as any).gcTime = (options as any).gcTime;
  }

  return useQuery(finalOptions);
};

/** Centralized mutation helper that merges shared defaults with per-call overrides */
export const useAppMutation = <
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>,
) =>
  useMutation({
    ...defaultMutationOptions,
    ...options,
    retry: options.retry ?? defaultMutationOptions.retry,
    retryDelay: options.retryDelay ?? defaultMutationOptions.retryDelay,
  });

/* ==========================
   queryKeys (full object)
   ========================== */

export const queryKeys = {
  // Auth queries
  auth: {
    user: ['auth', 'user'] as const,
    profile: ['auth', 'profile'] as const,
  },

  // Customer queries
  customers: {
    all: ['customers'] as const,
    lists: () => [...queryKeys.customers.all, 'list'] as const,
    list: (filters: unknown) =>
      [...queryKeys.customers.lists(), { filters }] as const,
    details: () => [...queryKeys.customers.all, 'detail'] as const,
    detail: (id: unknown) => [...queryKeys.customers.details(), id] as const,
  },

  // Lead queries
  leads: {
    all: ['leads'] as const,
    lists: () => [...queryKeys.leads.all, 'list'] as const,
    list: (filters: unknown) =>
      [...queryKeys.leads.lists(), { filters }] as const,
    details: () => [...queryKeys.leads.all, 'detail'] as const,
    detail: (id: unknown) => [...queryKeys.leads.details(), id] as const,
  },

  // Dashboard queries
  dashboard: {
    stats: ['dashboard', 'stats'] as const,
    recentActivities: ['dashboard', 'recent-activities'] as const,
    charts: ['dashboard', 'charts'] as const,
  },

  // Notification queries
  notifications: {
    all: ['notifications'] as const,
    list: (filters: unknown) =>
      [...queryKeys.notifications.all, 'list', { filters }] as const,
    unreadCount: ['notifications', 'unread-count'] as const,
  },

  // Activities queries
  activities: {
    all: ['activities'] as const,
    lists: () => [...queryKeys.activities.all, 'list'] as const,
    list: (params: ActivitiesListParams) =>
      [...queryKeys.activities.lists(), params] as const,
    details: () => [...queryKeys.activities.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.activities.details(), id] as const,
    search: (searchTerm: string) =>
      [...queryKeys.activities.all, 'search', searchTerm] as const,
    metadata: ['activities', 'metadata'] as const,
    formBuild: (navigationModuleId: string | undefined) =>
      [...queryKeys.activities.all, 'formBuild', navigationModuleId] as const,
    searchFilter: (contentTypeId: string) =>
      [...queryKeys.activities.all, 'searchFilter', contentTypeId] as const,
    bulkUpdate: (ids: string[]) =>
      [...queryKeys.activities.all, 'bulk_update', ids] as const,
    bulk_update: (ids: string[]) =>
      [...queryKeys.activities.all, 'bulk_update', ids] as const,
  },

  // Account queries
  accounts: {
    all: ['accounts'] as const,
    lists: () => [...queryKeys.accounts.all, 'list'] as const,
    list: (params: unknown) => [...queryKeys.accounts.lists(), params] as const,
    details: () => [...queryKeys.accounts.all, 'detail'] as const,
    detail: (id: unknown) => [...queryKeys.accounts.details(), id] as const,
    metadata: ['accounts', 'metadata'] as const,
    searchFilter: (contentTypeId: unknown) =>
      [...queryKeys.accounts.all, 'searchFilter', contentTypeId] as const,
    formBuild: (navigationModuleId: unknown) =>
      [...queryKeys.accounts.all, 'formBuild', navigationModuleId] as const,
    addressFilter: (id: unknown) =>
      [...queryKeys.accounts.all, 'addressFilter', id] as const,
    bulkUpdate: (ids: unknown) =>
      [...queryKeys.accounts.all, 'bulk_update', ids] as const,
    search: (searchTerm: unknown) =>
      [...queryKeys.accounts.all, 'search', searchTerm] as const,
  },

  // Contact queries
  contacts: {
    all: ['contacts'] as const,
    lists: () => [...queryKeys.contacts.all, 'list'] as const,
    list: (params: unknown) => [...queryKeys.contacts.lists(), params] as const,
    details: () => [...queryKeys.contacts.all, 'detail'] as const,
    detail: (id: unknown) => [...queryKeys.contacts.details(), id] as const,
    metadata: ['contacts', 'metadata'] as const,
    formBuild: (id: unknown) =>
      [...queryKeys.contacts.all, 'formBuild', id] as const,
    searchFilter: (contentTypeId: unknown) =>
      [...queryKeys.contacts.all, 'searchFilter', contentTypeId] as const,
    addressFilter: (id: unknown) =>
      [...queryKeys.contacts.all, 'addressFilter', id] as const,
    search: (searchTerm: unknown) =>
      [...queryKeys.contacts.all, 'search', searchTerm] as const,
  },

  // Email queries
  emails: {
    all: ['emails'] as const,
    lists: () => [...queryKeys.emails.all, 'list'] as const,
    list: (params: unknown) => [...queryKeys.emails.lists(), params] as const,
    details: () => [...queryKeys.emails.all, 'detail'] as const,
    detail: (id: unknown) => [...queryKeys.emails.details(), id] as const,
    metadata: ['emails', 'metadata'] as const,
    formBuild: (id: unknown) =>
      [...queryKeys.emails.all, 'formBuild', id] as const,
    searchFilter: (contentTypeId: unknown) =>
      [...queryKeys.emails.all, 'searchFilter', contentTypeId] as const,
    addressFilter: (id: unknown) =>
      [...queryKeys.emails.all, 'addressFilter', id] as const,
    search: (searchTerm: unknown) =>
      [...queryKeys.emails.all, 'search', searchTerm] as const,
    attachments: (attachmentsId: unknown) =>
      [...queryKeys.emails.all, 'attachments', attachmentsId] as const,
  },

  // Task queries
  tasks: {
    all: ['tasks'] as const,
    lists: () => [...queryKeys.tasks.all, 'list'] as const,
    list: (params: unknown) => [...queryKeys.tasks.lists(), params] as const,
    details: () => [...queryKeys.tasks.all, 'detail'] as const,
    detail: (id: unknown) => [...queryKeys.tasks.details(), id] as const,
    metadata: ['tasks', 'metadata'] as const,
    formBuild: (id: unknown) =>
      [...queryKeys.tasks.all, 'formBuild', id] as const,
    searchFilter: (contentTypeId: unknown) =>
      [...queryKeys.tasks.all, 'searchFilter', contentTypeId] as const,
    addressFilter: (id: unknown) =>
      [...queryKeys.tasks.all, 'addressFilter', id] as const,
    search: (searchTerm: unknown) =>
      [...queryKeys.tasks.all, 'search', searchTerm] as const,
  },

  // Phone call queries
  phonecalls: {
    all: ['phonecall'] as const,
    lists: () => [...queryKeys.phonecalls.all, 'list'] as const,
    list: (params: unknown) =>
      [...queryKeys.phonecalls.lists(), params] as const,
    details: () => [...queryKeys.phonecalls.all, 'detail'] as const,
    detail: (id: unknown) => [...queryKeys.phonecalls.details(), id] as const,
    metadata: ['phonecall', 'metadata'] as const,
    formBuild: (id: unknown) =>
      [...queryKeys.phonecalls.all, 'formBuild', id] as const,
    searchFilter: (contentTypeId: unknown) =>
      [...queryKeys.phonecalls.all, 'searchFilter', contentTypeId] as const,
    addressFilter: (id: unknown) =>
      [...queryKeys.phonecalls.all, 'addressFilter', id] as const,
    search: (searchTerm: unknown) =>
      [...queryKeys.phonecalls.all, 'search', searchTerm] as const,
  },

  // Chat queries
  chats: {
    all: ['chats'] as const,
    lists: () => [...queryKeys.chats.all, 'list'] as const,
    list: (params: unknown) => [...queryKeys.chats.lists(), params] as const,
    details: () => [...queryKeys.chats.all, 'detail'] as const,
    detail: (id: unknown) => [...queryKeys.chats.details(), id] as const,
    metadata: ['chats', 'metadata'] as const,
    formBuild: (id: unknown) =>
      [...queryKeys.chats.all, 'formBuild', id] as const,
    searchFilter: (contentTypeId: unknown) =>
      [...queryKeys.chats.all, 'searchFilter', contentTypeId] as const,
    addressFilter: (id: unknown) =>
      [...queryKeys.chats.all, 'addressFilter', id] as const,
    search: (searchTerm: unknown) =>
      [...queryKeys.chats.all, 'search', searchTerm] as const,
  },

  // Product queries
  products: {
    all: ['product'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (params: unknown) => [...queryKeys.products.lists(), params] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: unknown) => [...queryKeys.products.details(), id] as const,
    metadata: ['product', 'metadata'] as const,
    formBuild: (id: unknown) =>
      [...queryKeys.products.all, 'formBuild', id] as const,
    searchFilter: (contentTypeId: unknown) =>
      [...queryKeys.products.all, 'searchFilter', contentTypeId] as const,
    addressFilter: (id: unknown) =>
      [...queryKeys.products.all, 'addressFilter', id] as const,
    search: (searchTerm: unknown) =>
      [...queryKeys.products.all, 'search', searchTerm] as const,
  },

  // Case queries
  cases: {
    all: ['case'] as const,
    lists: () => [...queryKeys.cases.all, 'list'] as const,
    list: (params: unknown) => [...queryKeys.cases.lists(), params] as const,
    details: () => [...queryKeys.cases.all, 'detail'] as const,
    detail: (id: unknown) => [...queryKeys.cases.details(), id] as const,
    metadata: ['case', 'metadata'] as const,
    formBuild: (id: unknown) =>
      [...queryKeys.cases.all, 'formBuild', id] as const,
    searchFilter: (contentTypeId: unknown) =>
      [...queryKeys.cases.all, 'searchFilter', contentTypeId] as const,
    addressFilter: (id: unknown) =>
      [...queryKeys.cases.all, 'addressFilter', id] as const,
    search: (searchTerm: unknown) =>
      [...queryKeys.cases.all, 'search', searchTerm] as const,
  },

  // Price list queries
  priceLists: {
    all: ['priceList'] as const,
    lists: () => [...queryKeys.priceLists.all, 'list'] as const,
    list: (params: unknown) =>
      [...queryKeys.priceLists.lists(), params] as const,
    details: () => [...queryKeys.priceLists.all, 'detail'] as const,
    detail: (id: unknown) => [...queryKeys.priceLists.details(), id] as const,
    metadata: ['priceList', 'metadata'] as const,
    formBuild: (id: unknown) =>
      [...queryKeys.priceLists.all, 'formBuild', id] as const,
    searchFilter: (contentTypeId: unknown) =>
      [...queryKeys.priceLists.all, 'searchFilter', contentTypeId] as const,
    addressFilter: (id: unknown) =>
      [...queryKeys.priceLists.all, 'addressFilter', id] as const,
    search: (searchTerm: unknown) =>
      [...queryKeys.priceLists.all, 'search', searchTerm] as const,
    items: (params: unknown) =>
      [...queryKeys.priceLists.all, 'priceListItems', params] as const,
    itemDetail: (id: unknown) =>
      [...queryKeys.priceLists.all, 'priceListItemDetail', id] as const,
  },

  // Knowledge Article queries
  knowledgeArticles: {
    all: ['knowledgeArticles'] as const,
    lists: () => [...queryKeys.knowledgeArticles.all, 'list'] as const,
    list: (params: unknown) =>
      [...queryKeys.knowledgeArticles.lists(), params] as const,
    details: () => [...queryKeys.knowledgeArticles.all, 'detail'] as const,
    detail: (id: unknown) =>
      [...queryKeys.knowledgeArticles.details(), id] as const,
    metadata: ['knowledgeArticles', 'metadata'] as const,
    formBuild: (id: unknown) =>
      [...queryKeys.knowledgeArticles.all, 'formBuild', id] as const,
    searchFilter: (contentTypeId: unknown) =>
      [
        ...queryKeys.knowledgeArticles.all,
        'searchFilter',
        contentTypeId,
      ] as const,
    addressFilter: (id: unknown) =>
      [...queryKeys.knowledgeArticles.all, 'addressFilter', id] as const,
    attachments: (attachmentsId: unknown) =>
      [...queryKeys.knowledgeArticles.all, 'attachments', attachmentsId] as const,
  },

  // Queue queries
  queues: {
    all: ['queue'] as const,
    lists: () => [...queryKeys.queues.all, 'list'] as const,
    list: (params: unknown) => [...queryKeys.queues.lists(), params] as const,
    details: () => [...queryKeys.queues.all, 'detail'] as const,
    detail: (id: unknown) => [...queryKeys.queues.details(), id] as const,
    metadata: ['queue', 'metadata'] as const,
    formBuild: (id: unknown) =>
      [...queryKeys.queues.all, 'formBuild', id] as const,
    searchFilter: (contentTypeId: unknown) =>
      [...queryKeys.queues.all, 'searchFilter', contentTypeId] as const,
    addressFilter: (id: unknown) =>
      [...queryKeys.queues.all, 'addressFilter', id] as const,
    search: (searchTerm: unknown) =>
      [...queryKeys.queues.all, 'search', searchTerm] as const,
  },
};

export default queryClient;
