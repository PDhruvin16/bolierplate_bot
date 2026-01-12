import { User, Customer, Lead } from './api';

// ========================================
// CUSTOMER SERVICE HUB MODULE TYPES
// ========================================

export interface CustomerServiceHub {
  // Customer Support
  tickets: SupportTicket[];
  conversations: Conversation[];
  knowledgeBase: KnowledgeArticle[];

  // Customer Management
  customerProfiles: CustomerProfile[];
  customerHistory: CustomerHistory[];
  customerPreferences: CustomerPreferences[];

  // Service Metrics
  serviceMetrics: ServiceMetrics;
  agentPerformance: AgentPerformance[];
}

// Support Ticket Types
export interface SupportTicket {
  id: string;
  customerId: string;
  customer: Customer;
  agentId?: string;
  agent?: User;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  category: TicketCategory;
  subcategory?: string;
  tags: string[];
  attachments: TicketAttachment[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  slaDueDate?: string;
  escalationLevel: number;
  internalNotes?: string;
  customerRating?: number;
  customerFeedback?: string;
}

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent' | 'critical';
export type TicketStatus =
  | 'open'
  | 'in_progress'
  | 'waiting_customer'
  | 'waiting_third_party'
  | 'resolved'
  | 'closed';
export type TicketCategory =
  | 'technical'
  | 'billing'
  | 'account'
  | 'product'
  | 'general'
  | 'feature_request'
  | 'bug_report';

export interface TicketAttachment {
  id: string;
  filename: string;
  size: number;
  type: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

// Conversation Types
export interface Conversation {
  id: string;
  ticketId: string;
  messages: Message[];
  participants: ConversationParticipant[];
  startedAt: string;
  lastActivity: string;
  isActive: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: 'customer' | 'agent' | 'system';
  content: string;
  contentType: 'text' | 'image' | 'file' | 'system';
  attachments?: MessageAttachment[];
  timestamp: string;
  isRead: boolean;
  isEdited: boolean;
  editedAt?: string;
}

export interface MessageAttachment {
  id: string;
  filename: string;
  size: number;
  type: string;
  url: string;
}

export interface ConversationParticipant {
  id: string;
  type: 'customer' | 'agent';
  name: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: string;
}

// Knowledge Base Types
export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  authorId: string;
  author: User;
  status: 'draft' | 'published' | 'archived';
  views: number;
  helpful: number;
  notHelpful: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
}

// Customer Profile Types
export interface CustomerProfile extends Customer {
  serviceHistory: ServiceHistory[];
  preferences: CustomerPreferences;
  loyaltyPoints: number;
  membershipTier: MembershipTier;
  lastServiceContact?: string;
  preferredContactMethod: ContactMethod;
  preferredLanguage: string;
  timezone: string;
  notes: CustomerNote[];
}

export interface ServiceHistory {
  id: string;
  type: 'ticket' | 'conversation' | 'purchase' | 'refund';
  title: string;
  description: string;
  status: string;
  date: string;
  agentId?: string;
  agentName?: string;
}

export interface CustomerPreferences {
  communicationPreferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
    phone: boolean;
  };
  marketingPreferences: {
    newsletter: boolean;
    promotions: boolean;
    productUpdates: boolean;
  };
  privacySettings: {
    dataSharing: boolean;
    analytics: boolean;
    personalization: boolean;
  };
}

export type MembershipTier =
  | 'bronze'
  | 'silver'
  | 'gold'
  | 'platinum'
  | 'diamond';
export type ContactMethod = 'email' | 'phone' | 'sms' | 'chat' | 'video_call';

export interface CustomerNote {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

// Service Metrics Types
export interface ServiceMetrics {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  averageResolutionTime: number;
  customerSatisfaction: number;
  firstResponseTime: number;
  escalationRate: number;
  agentUtilization: number;
  slaCompliance: number;
  dailyStats: DailyServiceStats[];
}

export interface DailyServiceStats {
  date: string;
  ticketsCreated: number;
  ticketsResolved: number;
  averageResponseTime: number;
  customerSatisfaction: number;
}

export interface AgentPerformance {
  agentId: string;
  agent: User;
  ticketsHandled: number;
  ticketsResolved: number;
  averageResolutionTime: number;
  customerSatisfaction: number;
  responseTime: number;
  utilization: number;
  qualityScore: number;
  period: 'daily' | 'weekly' | 'monthly';
}

// ========================================
// ADMIN CONSOLE MODULE TYPES
// ========================================

export interface AdminConsole {
  // User Management
  users: AdminUser[];
  roles: Role[];
  permissions: Permission[];

  // System Management
  systemSettings: SystemSettings;
  integrations: Integration[];
  auditLogs: AuditLog[];

  // Analytics & Reports
  analytics: AnalyticsData;
  reports: Report[];

  // Workflow Management
  workflows: Workflow[];
  automations: Automation[];
}

// User Management Types
export interface AdminUser extends User {
  roleId: string;
  role: Role;
  permissions: string[];
  isActive: boolean;
  lastLogin?: string;
  loginAttempts: number;
  lockedUntil?: string;
  twoFactorEnabled: boolean;
  apiKeys: ApiKey[];
  sessions: UserSession[];
  department?: string;
  managerId?: string;
  manager?: AdminUser;
  subordinates: AdminUser[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
  userCount: number;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
  module: 'customer_service' | 'admin_console' | 'settings_crm';
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  isActive: boolean;
  lastUsed?: string;
  expiresAt?: string;
  createdAt: string;
}

export interface UserSession {
  id: string;
  deviceInfo: DeviceInfo;
  ipAddress: string;
  userAgent: string;
  location?: string;
  isActive: boolean;
  lastActivity: string;
  createdAt: string;
}

export interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop';
  os: string;
  browser: string;
  deviceId: string;
}

// System Management Types
export interface SystemSettings {
  general: GeneralSettings;
  security: SecuritySettings;
  notifications: NotificationSettings;
  integrations: IntegrationSettings;
  performance: PerformanceSettings;
  backup: BackupSettings;
}

export interface GeneralSettings {
  companyName: string;
  companyLogo?: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  language: string;
  currency: string;
  maintenanceMode: boolean;
  maintenanceMessage?: string;
}

export interface SecuritySettings {
  passwordPolicy: PasswordPolicy;
  sessionTimeout: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
  twoFactorRequired: boolean;
  ipWhitelist: string[];
  sslRequired: boolean;
  dataEncryption: boolean;
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  maxAge: number;
  preventReuse: number;
}

export interface NotificationSettings {
  email: EmailNotificationSettings;
  sms: SmsNotificationSettings;
  push: PushNotificationSettings;
  inApp: InAppNotificationSettings;
}

export interface EmailNotificationSettings {
  enabled: boolean;
  smtpServer: string;
  smtpPort: number;
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
  templates: EmailTemplate[];
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  isActive: boolean;
}

export interface SmsNotificationSettings {
  enabled: boolean;
  provider: string;
  apiKey: string;
  apiSecret: string;
  fromNumber: string;
}

export interface PushNotificationSettings {
  enabled: boolean;
  provider: 'firebase' | 'onesignal' | 'custom';
  config: Record<string, any>;
}

export interface InAppNotificationSettings {
  enabled: boolean;
  retentionDays: number;
  maxNotifications: number;
}

export interface IntegrationSettings {
  slack: SlackIntegration;
  teams: TeamsIntegration;
  zapier: ZapierIntegration;
  webhooks: WebhookIntegration[];
}

export interface SlackIntegration {
  enabled: boolean;
  webhookUrl: string;
  channel: string;
  events: string[];
}

export interface TeamsIntegration {
  enabled: boolean;
  webhookUrl: string;
  events: string[];
}

export interface ZapierIntegration {
  enabled: boolean;
  apiKey: string;
  triggers: ZapierTrigger[];
}

export interface ZapierTrigger {
  id: string;
  name: string;
  event: string;
  isActive: boolean;
}

export interface WebhookIntegration {
  id: string;
  name: string;
  url: string;
  events: string[];
  headers: Record<string, string>;
  isActive: boolean;
  retryCount: number;
  lastTriggered?: string;
}

export interface PerformanceSettings {
  cacheEnabled: boolean;
  cacheTtl: number;
  compressionEnabled: boolean;
  cdnEnabled: boolean;
  cdnUrl?: string;
  rateLimiting: RateLimitSettings;
}

export interface RateLimitSettings {
  enabled: boolean;
  requestsPerMinute: number;
  burstLimit: number;
  whitelist: string[];
}

export interface BackupSettings {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  retention: number;
  storage: 'local' | 's3' | 'gcs';
  storageConfig: Record<string, any>;
  lastBackup?: string;
  nextBackup?: string;
}

// Integration Types
export interface Integration {
  id: string;
  name: string;
  type: IntegrationType;
  status: 'active' | 'inactive' | 'error';
  config: Record<string, any>;
  lastSync?: string;
  syncStatus: 'success' | 'failed' | 'in_progress';
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export type IntegrationType =
  | 'crm'
  | 'email'
  | 'calendar'
  | 'payment'
  | 'analytics'
  | 'communication'
  | 'file_storage'
  | 'marketing';

// Audit Log Types
export interface AuditLog {
  id: string;
  userId: string;
  user: User;
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// Analytics Types
export interface AnalyticsData {
  overview: AnalyticsOverview;
  trends: AnalyticsTrend[];
  userActivity: UserActivityData;
  systemHealth: SystemHealthData;
  customMetrics: CustomMetric[];
}

export interface AnalyticsOverview {
  totalUsers: number;
  activeUsers: number;
  totalCustomers: number;
  totalTickets: number;
  systemUptime: number;
  averageResponseTime: number;
  customerSatisfaction: number;
}

export interface AnalyticsTrend {
  metric: string;
  period: string;
  values: TrendValue[];
  change: number;
  changeType: 'increase' | 'decrease' | 'stable';
}

export interface TrendValue {
  date: string;
  value: number;
}

export interface UserActivityData {
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  userSessions: UserSessionData[];
  popularFeatures: PopularFeature[];
}

export interface UserSessionData {
  date: string;
  sessions: number;
  uniqueUsers: number;
  averageDuration: number;
}

export interface PopularFeature {
  feature: string;
  usageCount: number;
  uniqueUsers: number;
  satisfaction: number;
}

export interface SystemHealthData {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkLatency: number;
  errorRate: number;
  uptime: number;
  lastCheck: string;
}

export interface CustomMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: number;
  threshold: number;
  status: 'normal' | 'warning' | 'critical';
}

// Report Types
export interface Report {
  id: string;
  name: string;
  description: string;
  type: ReportType;
  schedule?: ReportSchedule;
  recipients: string[];
  format: 'pdf' | 'excel' | 'csv' | 'json';
  filters: ReportFilter[];
  columns: ReportColumn[];
  isActive: boolean;
  lastGenerated?: string;
  nextGeneration?: string;
  createdAt: string;
  updatedAt: string;
}

export type ReportType =
  | 'user_activity'
  | 'customer_service'
  | 'system_performance'
  | 'financial'
  | 'custom';

export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
  timezone: string;
}

export interface ReportFilter {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between';
  value: any;
  value2?: any;
}

export interface ReportColumn {
  field: string;
  displayName: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  sortable: boolean;
  filterable: boolean;
  width?: number;
}

// Workflow Types
export interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: WorkflowTrigger;
  steps: WorkflowStep[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  executionCount: number;
  lastExecuted?: string;
}

export interface WorkflowTrigger {
  type: 'event' | 'schedule' | 'manual';
  event?: string;
  schedule?: string;
  conditions: WorkflowCondition[];
}

export interface WorkflowCondition {
  field: string;
  operator: string;
  value: any;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: WorkflowStepType;
  config: Record<string, any>;
  order: number;
  isActive: boolean;
  onSuccess?: string;
  onFailure?: string;
}

export type WorkflowStepType =
  | 'send_email'
  | 'send_sms'
  | 'create_ticket'
  | 'update_record'
  | 'webhook'
  | 'delay'
  | 'condition'
  | 'assignment';

// Automation Types
export interface Automation {
  id: string;
  name: string;
  description: string;
  type: AutomationType;
  trigger: AutomationTrigger;
  actions: AutomationAction[];
  conditions: AutomationCondition[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  executionCount: number;
  lastExecuted?: string;
}

export type AutomationType =
  | 'lead_assignment'
  | 'follow_up'
  | 'escalation'
  | 'notification'
  | 'data_sync'
  | 'custom';

export interface AutomationTrigger {
  event: string;
  filters: Record<string, any>;
}

export interface AutomationAction {
  type: string;
  config: Record<string, any>;
  order: number;
}

export interface AutomationCondition {
  field: string;
  operator: string;
  value: any;
  logic: 'and' | 'or';
}

// ========================================
// SETTINGS CRM MODULE TYPES
// ========================================

export interface SettingsCRM {
  // CRM Configuration
  crmSettings: CRMSettings;
  customFields: CustomField[];
  pipelines: Pipeline[];
  stages: Stage[];

  // Business Rules
  businessRules: BusinessRule[];
  validationRules: ValidationRule[];
  workflows: CRMWorkflow[];

  // Data Management
  dataSettings: DataSettings;
  importExport: ImportExportSettings;
  dataQuality: DataQualitySettings;

  // Integration Settings
  crmIntegrations: CRMIntegration[];
  apiSettings: APISettings;
}

// CRM Settings Types
export interface CRMSettings {
  general: CRMGeneralSettings;
  leadManagement: LeadManagementSettings;
  customerManagement: CustomerManagementSettings;
  dealManagement: DealManagementSettings;
  activityManagement: ActivityManagementSettings;
  reporting: ReportingSettings;
}

export interface CRMGeneralSettings {
  companyName: string;
  industry: string;
  timezone: string;
  currency: string;
  dateFormat: string;
  timeFormat: string;
  language: string;
  fiscalYearStart: string;
  businessHours: BusinessHours;
  holidays: Holiday[];
}

export interface BusinessHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  isOpen: boolean;
  startTime: string;
  endTime: string;
  breaks: Break[];
}

export interface Break {
  startTime: string;
  endTime: string;
  description: string;
}

export interface Holiday {
  date: string;
  name: string;
  description?: string;
}

export interface LeadManagementSettings {
  autoAssignment: boolean;
  assignmentRules: AssignmentRule[];
  leadScoring: LeadScoringSettings;
  leadNurturing: LeadNurturingSettings;
  duplicateDetection: DuplicateDetectionSettings;
}

export interface AssignmentRule {
  id: string;
  name: string;
  conditions: AssignmentCondition[];
  assignTo: string;
  priority: number;
  isActive: boolean;
}

export interface AssignmentCondition {
  field: string;
  operator: string;
  value: any;
}

export interface LeadScoringSettings {
  enabled: boolean;
  scoringRules: ScoringRule[];
  threshold: number;
  autoQualification: boolean;
}

export interface ScoringRule {
  id: string;
  field: string;
  condition: string;
  value: any;
  points: number;
  isActive: boolean;
}

export interface LeadNurturingSettings {
  enabled: boolean;
  campaigns: NurturingCampaign[];
  emailTemplates: EmailTemplate[];
  followUpSchedule: FollowUpSchedule[];
}

export interface NurturingCampaign {
  id: string;
  name: string;
  description: string;
  steps: NurturingStep[];
  isActive: boolean;
}

export interface NurturingStep {
  id: string;
  name: string;
  type: 'email' | 'task' | 'call' | 'sms';
  delay: number;
  template?: string;
  isActive: boolean;
}

export interface FollowUpSchedule {
  id: string;
  name: string;
  intervals: FollowUpInterval[];
  isActive: boolean;
}

export interface FollowUpInterval {
  delay: number;
  type: 'email' | 'call' | 'task';
  template?: string;
}

export interface DuplicateDetectionSettings {
  enabled: boolean;
  fields: string[];
  threshold: number;
  autoMerge: boolean;
  notificationEmail?: string;
}

export interface CustomerManagementSettings {
  customerSegmentation: CustomerSegmentationSettings;
  customerLifecycle: CustomerLifecycleSettings;
  customerScoring: CustomerScoringSettings;
  relationshipMapping: RelationshipMappingSettings;
}

export interface CustomerSegmentationSettings {
  enabled: boolean;
  segments: CustomerSegment[];
  autoAssignment: boolean;
}

export interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  criteria: SegmentCriteria[];
  customerCount: number;
  isActive: boolean;
}

export interface SegmentCriteria {
  field: string;
  operator: string;
  value: any;
  logic: 'and' | 'or';
}

export interface CustomerLifecycleSettings {
  stages: LifecycleStage[];
  transitions: LifecycleTransition[];
  automation: LifecycleAutomation[];
}

export interface LifecycleStage {
  id: string;
  name: string;
  description: string;
  color: string;
  order: number;
  criteria: string[];
}

export interface LifecycleTransition {
  fromStage: string;
  toStage: string;
  conditions: string[];
  automation?: string;
}

export interface LifecycleAutomation {
  id: string;
  name: string;
  trigger: string;
  actions: string[];
  isActive: boolean;
}

export interface CustomerScoringSettings {
  enabled: boolean;
  scoringModel: ScoringModel;
  refreshFrequency: 'daily' | 'weekly' | 'monthly';
}

export interface ScoringModel {
  factors: ScoringFactor[];
  weights: Record<string, number>;
  algorithm: 'weighted' | 'machine_learning';
}

export interface ScoringFactor {
  field: string;
  weight: number;
  calculation: string;
}

export interface RelationshipMappingSettings {
  enabled: boolean;
  relationshipTypes: RelationshipType[];
  hierarchyRules: HierarchyRule[];
}

export interface RelationshipType {
  id: string;
  name: string;
  description: string;
  bidirectional: boolean;
  isActive: boolean;
}

export interface HierarchyRule {
  id: string;
  name: string;
  parentType: string;
  childType: string;
  conditions: string[];
}

export interface DealManagementSettings {
  dealStages: DealStage[];
  dealTypes: DealType[];
  probabilitySettings: ProbabilitySettings;
  revenueTracking: RevenueTrackingSettings;
}

export interface DealStage {
  id: string;
  name: string;
  description: string;
  probability: number;
  color: string;
  order: number;
  isActive: boolean;
}

export interface DealType {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface ProbabilitySettings {
  defaultProbabilities: Record<string, number>;
  customCalculation: string;
  autoUpdate: boolean;
}

export interface RevenueTrackingSettings {
  enabled: boolean;
  currencies: string[];
  exchangeRates: ExchangeRate[];
  forecasting: ForecastingSettings;
}

export interface ExchangeRate {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  lastUpdated: string;
}

export interface ForecastingSettings {
  enabled: boolean;
  method: 'linear' | 'exponential' | 'seasonal';
  period: number;
  confidence: number;
}

export interface ActivityManagementSettings {
  activityTypes: ActivityType[];
  activityTemplates: ActivityTemplate[];
  scheduling: SchedulingSettings;
  reminders: ReminderSettings;
}

export interface ActivityType {
  id: string;
  name: string;
  description: string;
  color: string;
  duration: number;
  isActive: boolean;
}

export interface ActivityTemplate {
  id: string;
  name: string;
  type: string;
  subject: string;
  description: string;
  duration: number;
  isActive: boolean;
}

export interface SchedulingSettings {
  timeSlots: TimeSlot[];
  bufferTime: number;
  maxBookingsPerDay: number;
  autoScheduling: boolean;
}

export interface TimeSlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface ReminderSettings {
  enabled: boolean;
  reminderTypes: ReminderType[];
  defaultReminders: DefaultReminder[];
}

export interface ReminderType {
  id: string;
  name: string;
  method: 'email' | 'sms' | 'push' | 'in_app';
  template: string;
  isActive: boolean;
}

export interface DefaultReminder {
  activityType: string;
  reminderType: string;
  timeBefore: number;
  unit: 'minutes' | 'hours' | 'days';
}

export interface ReportingSettings {
  dashboards: Dashboard[];
  reports: CRMReport[];
  kpis: KPI[];
  exports: ExportSettings;
}

export interface Dashboard {
  id: string;
  name: string;
  description: string;
  widgets: DashboardWidget[];
  layout: WidgetLayout[];
  isDefault: boolean;
  isActive: boolean;
}

export interface DashboardWidget {
  id: string;
  type: string;
  title: string;
  config: Record<string, any>;
  size: WidgetSize;
  position: WidgetPosition;
}

export interface WidgetSize {
  width: number;
  height: number;
}

export interface WidgetPosition {
  x: number;
  y: number;
}

export interface WidgetLayout {
  widgetId: string;
  position: WidgetPosition;
  size: WidgetSize;
}

export interface CRMReport {
  id: string;
  name: string;
  description: string;
  type: string;
  query: string;
  parameters: ReportParameter[];
  schedule?: ReportSchedule;
  isActive: boolean;
}

export interface ReportParameter {
  name: string;
  type: string;
  defaultValue?: any;
  required: boolean;
}

export interface KPI {
  id: string;
  name: string;
  description: string;
  calculation: string;
  target: number;
  unit: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  isActive: boolean;
}

export interface ExportSettings {
  formats: string[];
  scheduling: boolean;
  compression: boolean;
  encryption: boolean;
  retention: number;
}

// Custom Fields Types
export interface CustomField {
  id: string;
  name: string;
  label: string;
  type: CustomFieldType;
  entity: 'lead' | 'customer' | 'deal' | 'activity';
  required: boolean;
  defaultValue?: any;
  options?: CustomFieldOption[];
  validation?: CustomFieldValidation;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type CustomFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'phone'
  | 'date'
  | 'datetime'
  | 'boolean'
  | 'select'
  | 'multiselect'
  | 'url'
  | 'currency'
  | 'percentage'
  | 'file'
  | 'lookup';

export interface CustomFieldOption {
  value: string;
  label: string;
  color?: string;
  isActive: boolean;
}

export interface CustomFieldValidation {
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  pattern?: string;
  custom?: string;
}

// Pipeline Types
export interface Pipeline {
  id: string;
  name: string;
  description: string;
  entity: 'lead' | 'deal';
  stages: Stage[];
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Stage {
  id: string;
  name: string;
  description: string;
  pipelineId: string;
  order: number;
  probability: number;
  color: string;
  isActive: boolean;
  automation?: StageAutomation;
}

export interface StageAutomation {
  onEntry: AutomationAction[];
  onExit: AutomationAction[];
  conditions: AutomationCondition[];
}

// Business Rules Types
export interface BusinessRule {
  id: string;
  name: string;
  description: string;
  entity: string;
  trigger: RuleTrigger;
  conditions: RuleCondition[];
  actions: RuleAction[];
  priority: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RuleTrigger {
  event: string;
  timing: 'before' | 'after' | 'instead';
}

export interface RuleCondition {
  field: string;
  operator: string;
  value: any;
  logic: 'and' | 'or';
}

export interface RuleAction {
  type: string;
  config: Record<string, any>;
  order: number;
}

// Data Management Types
export interface DataSettings {
  dataRetention: DataRetentionSettings;
  dataArchiving: DataArchivingSettings;
  dataBackup: DataBackupSettings;
  dataPrivacy: DataPrivacySettings;
}

export interface DataRetentionSettings {
  enabled: boolean;
  policies: RetentionPolicy[];
  autoDelete: boolean;
  notificationDays: number;
}

export interface RetentionPolicy {
  entity: string;
  retentionPeriod: number;
  unit: 'days' | 'months' | 'years';
  conditions: string[];
}

export interface DataArchivingSettings {
  enabled: boolean;
  archiveAfter: number;
  archiveLocation: string;
  compression: boolean;
  encryption: boolean;
}

export interface DataBackupSettings {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  retention: number;
  location: string;
  encryption: boolean;
  verification: boolean;
}

export interface DataPrivacySettings {
  gdprCompliance: boolean;
  dataEncryption: boolean;
  accessLogging: boolean;
  dataMasking: boolean;
  consentManagement: boolean;
}

export interface ImportExportSettings {
  import: ImportSettings;
  export: ExportSettings;
  templates: ImportExportTemplate[];
}

export interface ImportSettings {
  maxFileSize: number;
  allowedFormats: string[];
  autoMapping: boolean;
  validation: boolean;
  duplicateHandling: 'skip' | 'update' | 'create';
}

export interface ImportExportTemplate {
  id: string;
  name: string;
  type: 'import' | 'export';
  entity: string;
  fields: TemplateField[];
  isActive: boolean;
}

export interface TemplateField {
  sourceField: string;
  targetField: string;
  transformation?: string;
  required: boolean;
}

export interface DataQualitySettings {
  enabled: boolean;
  rules: DataQualityRule[];
  scoring: DataQualityScoring;
  monitoring: DataQualityMonitoring;
}

export interface DataQualityRule {
  id: string;
  name: string;
  field: string;
  rule: string;
  severity: 'low' | 'medium' | 'high';
  isActive: boolean;
}

export interface DataQualityScoring {
  enabled: boolean;
  threshold: number;
  factors: QualityFactor[];
}

export interface QualityFactor {
  field: string;
  weight: number;
  criteria: string[];
}

export interface DataQualityMonitoring {
  enabled: boolean;
  alerts: QualityAlert[];
  reports: QualityReport[];
}

export interface QualityAlert {
  id: string;
  name: string;
  condition: string;
  recipients: string[];
  isActive: boolean;
}

export interface QualityReport {
  id: string;
  name: string;
  frequency: string;
  metrics: string[];
  isActive: boolean;
}

// Integration Types
export interface CRMIntegration {
  id: string;
  name: string;
  type: CRMIntegrationType;
  status: 'active' | 'inactive' | 'error';
  config: Record<string, any>;
  syncSettings: SyncSettings;
  lastSync?: string;
  errorMessage?: string;
}

export type CRMIntegrationType =
  | 'email'
  | 'calendar'
  | 'social_media'
  | 'payment'
  | 'accounting'
  | 'marketing'
  | 'communication'
  | 'file_storage';

export interface SyncSettings {
  enabled: boolean;
  direction: 'inbound' | 'outbound' | 'bidirectional';
  frequency: number;
  fields: SyncField[];
  filters: SyncFilter[];
}

export interface SyncField {
  sourceField: string;
  targetField: string;
  mapping: string;
  isActive: boolean;
}

export interface SyncFilter {
  field: string;
  operator: string;
  value: any;
}

export interface APISettings {
  enabled: boolean;
  rateLimiting: APIRateLimit;
  authentication: APIAuthentication;
  endpoints: APIEndpoint[];
  documentation: APIDocumentation;
}

export interface APIRateLimit {
  enabled: boolean;
  requestsPerMinute: number;
  burstLimit: number;
  perUser: boolean;
}

export interface APIAuthentication {
  methods: AuthMethod[];
  apiKeys: boolean;
  oauth: boolean;
  jwt: boolean;
}

export type AuthMethod = 'api_key' | 'oauth2' | 'jwt' | 'basic';

export interface APIEndpoint {
  path: string;
  method: string;
  description: string;
  parameters: APIParameter[];
  responses: APIResponse[];
  isActive: boolean;
}

export interface APIParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface APIResponse {
  code: number;
  description: string;
  schema: string;
}

export interface APIDocumentation {
  enabled: boolean;
  swaggerUrl: string;
  apiKey: string;
  version: string;
}
