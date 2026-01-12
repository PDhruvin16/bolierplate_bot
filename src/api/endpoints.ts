// API Endpoints configuration
export const ENDPOINTS: Record<string, any> = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/api/token/',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH_TOKEN: '/api/auth/refresh',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
  },

  // User endpoints
  USER: {
    PROFILE: '/api/user/profile',
    UPDATE_PROFILE: '/api/user/profile',
    CHANGE_PASSWORD: '/api/user/change-password',
  },

  ACTIVITIES: {
    LIST: '/core/activity_pointer/',
    CREATE: '/activities',
    DETAIL: (id: string) => `/activity_pointer/${id}`,
    UPDATE: (id: string) => `/activity_pointer/${id}`,
    DELETE: (id: string) => `/activity_pointer/${id}`,
    SEARCH: '/activity_pointer/search',
    BULK_UPDATE: '/core/activity_pointer/bulk_update/',
    METADATA: '/core/activity_pointer/get_metadata/?is_form=true',
    FORM_BUILDER: (id: string) => `/core/task/form_builder/${id}`,
    MULTI_DELETE:'/core/activity_pointer/delete_multiple/',
  },
  // Customer endpoints
  CUSTOMERS: {
    LIST: '/customers',
    CREATE: '/customers',
    DETAIL: (id: string) => `/customers/${id}`,
    UPDATE: (id: string) => `/customers/${id}`,
    DELETE: (id: string) => `/customers/${id}`,
    SEARCH: '/customers/search',
  },
  ACCOUNT: {
    LIST: '/core/account/',
    CREATE: '/customers',
    DETAIL: (id: string) => `/customers/${id}`,
    UPDATE: (id: string) => `/customers/${id}`,
    DELETE: (id: string) => `/customers/${id}`,
    SEARCH: '/customers/search',
    BULK_UPDATE: '/core/account/bulk_update/',
    METADATA: '/core/account/get_metadata/?is_form=true',
    FORM_BUILDER: (id: string) => `/core/form_builder/${id}`,
    MULTI_DELETE: '/core/account/delete_multiple/',
  },

  // Lead endpoints
  LEADS: {
    LIST: '/leads',
    CREATE: '/leads',
    DETAIL: (id: string) => `/leads/${id}`,
    UPDATE: (id: string) => `/leads/${id}`,
    DELETE: (id: string) => `/leads/${id}`,
    CONVERT: (id: string) => `/leads/${id}/convert`,
  },

  // Dashboard endpoints
  DASHBOARD: {
    STATS: '/dashboard/stats',
    RECENT_ACTIVITIES: '/dashboard/recent-activities',
    CHARTS: '/dashboard/charts',
    KPI_CARDS: '/customer_service/dashboard/admin/kpi_card_tab/',
    CASE_MANAGEMENT: '/customer_service/dashboard/admin/case_management/',
  },
  EMAIL: {
    LIST: '/core/email/',
    DETAIL: (id: string) => `/core/contact/${id}`,
    MULTIDELETE: '/core/contact/delete_multiple/',
    BULK_UPDATE: '/core/contact/bulk_update/',
    METADATA: '/core/email/get_metadata/?is_form=true',
    FORM_BUILDER: (id: string) => `/core/form_builder/${id}`,
    FILTER_BY_ADDRESS: (id: string) => `/core/contact/${id}/filter_by_address/`,
    DELETEADDRESS: '/core/contact/delete_multiple/',
  },

  // Contacts endpoints
  CONTACTS: {
    LIST: '/core/contact/',
    DETAIL: (id: string) => `/core/contact/${id}`,
    MULTIDELETE: '/core/contact/delete_multiple/',
    BULK_UPDATE: '/core/contact/bulk_update/',
    METADATA: '/core/contact/get_metadata/?is_form=true',
    FORM_BUILDER: (id: string) => `/core/form_builder/${id}`,
    FILTER_BY_ADDRESS: (id: string) => `/core/contact/${id}/filter_by_address/`,
    DELETEADDRESS: '/core/contact/delete_multiple/',
  },

  // Notification endpoints
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/mark-all-read',
  },

  COMMON: {
    ASSIGN_RECORD: '/user/search-user-or-group/',
    // Customer Module
    ASSIGN_RECORD_ACCOUNT: '/core/account/assign/',
    ASSIGN_RECORD_CONTACT: '/core/contact/assign/',
    SHARE_ACCONT: (id: string) => `/core/account/${id}/`,
    SHARE_CONTACT: (id: string) => `/core/contact/${id}/`,
    RECENT_CASES:'/customer_service/case/search_filter/',
    ENTITLEMENT:'/customer_service/entitlement/search_filter/',
    // My Work Module
    ASSIGN_RECORD_ACTIVITY: '/core/activity_pointer/assign/',
    ASSIGN_RECORD_EMAIL: '/core/email/assign/',
    ASSIGN_RECORD_TASK: '/core/task/assign/',
    ASSIGN_RECORD_PHONECALL: '/core/phone_call/assign/',
    ASSIGN_RECORD_WACALL: '/core/whatsapp_call/assign/',
    SHARE_ACTIVITY: (id: string) => `/core/activity_pointer/${id}/`,
    SHARE_EMAIL: (id: string) => `/core/email/${id}/`,
    SHARE_TASK: (id: string) => `/core/task/${id}/`,
    SHARE_PHONECALL: (id: string) => `/core/phone_call/${id}/`,
    SHARE_WACALL: (id: string) => `/core/whatsapp_call/${id}/`,
  },
};

export default ENDPOINTS;
