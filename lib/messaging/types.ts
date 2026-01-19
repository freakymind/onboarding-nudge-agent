// Channel Types
export type ChannelType = 'email' | 'sms' | 'whatsapp' | 'teams'

export interface Channel {
  id: string
  type: ChannelType
  name: string
  description: string
  isActive: boolean
  config: Record<string, string>
  icon: string
}

// Event Types
export type EventCategory = 'application' | 'document' | 'verification' | 'approval' | 'completion' | 'reminder'
export type EventSeverity = 'low' | 'medium' | 'high' | 'critical'

export interface OnboardingEvent {
  id: string
  code: string
  name: string
  description: string
  category: EventCategory
  severity: EventSeverity
  requiresResponse: boolean
  isActive: boolean
  createdAt: string
}

// Recipient Types
export type RecipientType = 'customer' | 'internal_staff'

// Routing Rules
export interface RoutingCondition {
  field: string
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than'
  value: string
}

export interface RoutingRule {
  id: string
  eventId: string
  channelId: string
  recipientType: RecipientType
  priority: number
  conditions: RoutingCondition[]
  staffRoleIds: string[] // For internal staff
  isActive: boolean
  waitDaysBeforeEscalation: number
  escalationChannelId?: string
}

// Message Templates
export interface MessageTemplate {
  id: string
  eventId: string
  channelId: string
  recipientType: RecipientType
  subject?: string // For email
  body: string
  variables: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Staff & Roles
export interface StaffRole {
  id: string
  name: string
  description: string
  permissions: string[]
  isActive: boolean
}

export interface StaffMember {
  id: string
  name: string
  email: string
  phone?: string
  roleIds: string[]
  contactPreferences: ChannelType[]
  isActive: boolean
}

export interface RoleNotificationConfig {
  id: string
  roleId: string
  eventId: string
  isEnabled: boolean
}

// Applications
export type ApplicationStatus = 
  | 'submitted' 
  | 'documents_pending' 
  | 'documents_received'
  | 'under_review' 
  | 'additional_info_required'
  | 'approved' 
  | 'rejected'
  | 'completed'

export interface Application {
  id: string
  applicantName: string
  applicantEmail: string
  applicantPhone: string
  type: string
  status: ApplicationStatus
  submittedAt: string
  lastUpdatedAt: string
  assignedStaffId?: string
  metadata: Record<string, unknown>
}

// Message Logs
export type MessageStatus = 'queued' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'replied' | 'failed' | 'bounced'

export interface MessageLog {
  id: string
  applicationId: string
  eventId: string
  channelId: string
  recipientType: RecipientType
  recipientId: string
  recipientName: string
  recipientContact: string
  templateId: string
  subject?: string
  body: string
  status: MessageStatus
  sentAt: string
  deliveredAt?: string
  openedAt?: string
  repliedAt?: string
  failureReason?: string
  escalatedFrom?: string
  escalationAttempt: number
}

// Escalation Rules
export interface EscalationRule {
  id: string
  eventId: string
  fromChannelId: string
  toChannelId: string
  waitDays: number
  maxAttempts: number
  isActive: boolean
}

// Analytics
export interface ChannelMetrics {
  channelId: string
  totalSent: number
  delivered: number
  opened: number
  replied: number
  failed: number
  avgResponseTimeHours: number
}

export interface EventMetrics {
  eventId: string
  totalTriggered: number
  successfulDelivery: number
  responseRate: number
  avgTimeToAction: number
}
