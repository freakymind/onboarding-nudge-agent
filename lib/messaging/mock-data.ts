import type {
  Channel,
  OnboardingEvent,
  RoutingRule,
  MessageTemplate,
  StaffRole,
  StaffMember,
  RoleNotificationConfig,
  Application,
  MessageLog,
  EscalationRule,
} from './types'

// Channels
export const mockChannels: Channel[] = [
  {
    id: 'ch_email',
    type: 'email',
    name: 'Email',
    description: 'Send emails via SMTP or email service provider',
    isActive: true,
    config: { provider: 'sendgrid', from: 'noreply@company.com' },
    icon: 'Mail',
  },
  {
    id: 'ch_sms',
    type: 'sms',
    name: 'SMS',
    description: 'Send SMS messages via Twilio',
    isActive: true,
    config: { provider: 'twilio', senderId: 'ONBOARD' },
    icon: 'MessageSquare',
  },
  {
    id: 'ch_whatsapp',
    type: 'whatsapp',
    name: 'WhatsApp',
    description: 'Send WhatsApp messages via WhatsApp Business API',
    isActive: true,
    config: { provider: 'whatsapp_business', templateNamespace: 'onboarding' },
    icon: 'Phone',
  },
  {
    id: 'ch_teams',
    type: 'teams',
    name: 'Microsoft Teams',
    description: 'Send messages to internal staff via MS Teams',
    isActive: true,
    config: { webhookUrl: 'https://teams.webhook.url' },
    icon: 'Users',
  },
]

// Onboarding Events
export const mockEvents: OnboardingEvent[] = [
  {
    id: 'evt_app_submitted',
    code: 'APPLICATION_SUBMITTED',
    name: 'Application Submitted',
    description: 'Triggered when a new application is submitted',
    category: 'application',
    severity: 'medium',
    requiresResponse: false,
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'evt_docs_pending',
    code: 'DOCUMENTS_PENDING',
    name: 'Documents Pending',
    description: 'Triggered when documents are required from applicant',
    category: 'document',
    severity: 'high',
    requiresResponse: true,
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'evt_docs_received',
    code: 'DOCUMENTS_RECEIVED',
    name: 'Documents Received',
    description: 'Triggered when all required documents are received',
    category: 'document',
    severity: 'low',
    requiresResponse: false,
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'evt_verification_started',
    code: 'VERIFICATION_STARTED',
    name: 'Verification Started',
    description: 'Triggered when verification process begins',
    category: 'verification',
    severity: 'medium',
    requiresResponse: false,
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'evt_additional_info',
    code: 'ADDITIONAL_INFO_REQUIRED',
    name: 'Additional Information Required',
    description: 'Triggered when more information is needed from applicant',
    category: 'verification',
    severity: 'high',
    requiresResponse: true,
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'evt_approved',
    code: 'APPLICATION_APPROVED',
    name: 'Application Approved',
    description: 'Triggered when application is approved',
    category: 'approval',
    severity: 'low',
    requiresResponse: false,
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'evt_rejected',
    code: 'APPLICATION_REJECTED',
    name: 'Application Rejected',
    description: 'Triggered when application is rejected',
    category: 'approval',
    severity: 'high',
    requiresResponse: false,
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'evt_reminder_3day',
    code: 'REMINDER_3_DAYS',
    name: '3-Day Reminder',
    description: 'Reminder sent after 3 days of inactivity',
    category: 'reminder',
    severity: 'medium',
    requiresResponse: true,
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'evt_reminder_7day',
    code: 'REMINDER_7_DAYS',
    name: '7-Day Reminder',
    description: 'Reminder sent after 7 days of inactivity',
    category: 'reminder',
    severity: 'high',
    requiresResponse: true,
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'evt_staff_escalation',
    code: 'STAFF_ESCALATION',
    name: 'Staff Escalation',
    description: 'Notify supervisor when application stalled',
    category: 'reminder',
    severity: 'critical',
    requiresResponse: true,
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'evt_completed',
    code: 'ONBOARDING_COMPLETED',
    name: 'Onboarding Completed',
    description: 'Triggered when onboarding process is completed',
    category: 'completion',
    severity: 'low',
    requiresResponse: false,
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
  },
]

// Staff Roles
export const mockRoles: StaffRole[] = [
  {
    id: 'role_reviewer',
    name: 'Application Reviewer',
    description: 'Reviews and processes applications',
    permissions: ['view_applications', 'update_status', 'request_documents'],
    isActive: true,
  },
  {
    id: 'role_ops_manager',
    name: 'Operations Manager',
    description: 'Oversees onboarding operations',
    permissions: ['view_applications', 'update_status', 'approve_applications', 'manage_staff'],
    isActive: true,
  },
  {
    id: 'role_compliance',
    name: 'Compliance Officer',
    description: 'Ensures regulatory compliance',
    permissions: ['view_applications', 'compliance_review', 'reject_applications'],
    isActive: true,
  },
  {
    id: 'role_support',
    name: 'Customer Support',
    description: 'Handles customer inquiries',
    permissions: ['view_applications', 'contact_customer'],
    isActive: true,
  },
]

// Staff Members
export const mockStaff: StaffMember[] = [
  {
    id: 'staff_1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    phone: '+1234567890',
    roleIds: ['role_reviewer'],
    contactPreferences: ['email', 'teams'],
    isActive: true,
  },
  {
    id: 'staff_2',
    name: 'Michael Chen',
    email: 'michael.chen@company.com',
    phone: '+1234567891',
    roleIds: ['role_ops_manager'],
    contactPreferences: ['teams', 'email'],
    isActive: true,
  },
  {
    id: 'staff_3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@company.com',
    phone: '+1234567892',
    roleIds: ['role_compliance'],
    contactPreferences: ['email'],
    isActive: true,
  },
  {
    id: 'staff_4',
    name: 'David Kim',
    email: 'david.kim@company.com',
    phone: '+1234567893',
    roleIds: ['role_support', 'role_reviewer'],
    contactPreferences: ['teams', 'sms'],
    isActive: true,
  },
]

// Role Notification Config
export const mockRoleNotificationConfig: RoleNotificationConfig[] = [
  { id: 'rnc_1', roleId: 'role_reviewer', eventId: 'evt_app_submitted', isEnabled: true },
  { id: 'rnc_2', roleId: 'role_reviewer', eventId: 'evt_docs_received', isEnabled: true },
  { id: 'rnc_3', roleId: 'role_ops_manager', eventId: 'evt_staff_escalation', isEnabled: true },
  { id: 'rnc_4', roleId: 'role_compliance', eventId: 'evt_verification_started', isEnabled: true },
  { id: 'rnc_5', roleId: 'role_support', eventId: 'evt_additional_info', isEnabled: true },
]

// Routing Rules
export const mockRoutingRules: RoutingRule[] = [
  {
    id: 'rr_1',
    eventId: 'evt_app_submitted',
    channelId: 'ch_email',
    recipientType: 'customer',
    priority: 1,
    conditions: [],
    staffRoleIds: [],
    isActive: true,
    waitDaysBeforeEscalation: 0,
  },
  {
    id: 'rr_2',
    eventId: 'evt_app_submitted',
    channelId: 'ch_teams',
    recipientType: 'internal_staff',
    priority: 1,
    conditions: [],
    staffRoleIds: ['role_reviewer'],
    isActive: true,
    waitDaysBeforeEscalation: 0,
  },
  {
    id: 'rr_3',
    eventId: 'evt_docs_pending',
    channelId: 'ch_email',
    recipientType: 'customer',
    priority: 1,
    conditions: [],
    staffRoleIds: [],
    isActive: true,
    waitDaysBeforeEscalation: 3,
    escalationChannelId: 'ch_sms',
  },
  {
    id: 'rr_4',
    eventId: 'evt_docs_pending',
    channelId: 'ch_sms',
    recipientType: 'customer',
    priority: 2,
    conditions: [],
    staffRoleIds: [],
    isActive: true,
    waitDaysBeforeEscalation: 2,
    escalationChannelId: 'ch_whatsapp',
  },
  {
    id: 'rr_5',
    eventId: 'evt_reminder_3day',
    channelId: 'ch_email',
    recipientType: 'customer',
    priority: 1,
    conditions: [],
    staffRoleIds: [],
    isActive: true,
    waitDaysBeforeEscalation: 4,
    escalationChannelId: 'ch_whatsapp',
  },
  {
    id: 'rr_6',
    eventId: 'evt_staff_escalation',
    channelId: 'ch_teams',
    recipientType: 'internal_staff',
    priority: 1,
    conditions: [],
    staffRoleIds: ['role_ops_manager'],
    isActive: true,
    waitDaysBeforeEscalation: 0,
  },
  {
    id: 'rr_7',
    eventId: 'evt_approved',
    channelId: 'ch_email',
    recipientType: 'customer',
    priority: 1,
    conditions: [],
    staffRoleIds: [],
    isActive: true,
    waitDaysBeforeEscalation: 0,
  },
  {
    id: 'rr_8',
    eventId: 'evt_approved',
    channelId: 'ch_whatsapp',
    recipientType: 'customer',
    priority: 2,
    conditions: [],
    staffRoleIds: [],
    isActive: true,
    waitDaysBeforeEscalation: 0,
  },
]

// Message Templates
export const mockTemplates: MessageTemplate[] = [
  {
    id: 'tpl_1',
    eventId: 'evt_app_submitted',
    channelId: 'ch_email',
    recipientType: 'customer',
    subject: 'Your Application Has Been Received - {{application_id}}',
    body: `Dear {{applicant_name}},

Thank you for submitting your application. We have received your application (ID: {{application_id}}) and our team will review it shortly.

What happens next:
1. Our team will review your application within 2-3 business days
2. You may be contacted if additional information is needed
3. You will receive a notification once a decision is made

If you have any questions, please don't hesitate to contact us.

Best regards,
The Onboarding Team`,
    variables: ['applicant_name', 'application_id'],
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'tpl_2',
    eventId: 'evt_app_submitted',
    channelId: 'ch_teams',
    recipientType: 'internal_staff',
    body: `🆕 **New Application Received**

**Applicant:** {{applicant_name}}
**Application ID:** {{application_id}}
**Type:** {{application_type}}
**Submitted:** {{submitted_date}}

Please review at your earliest convenience.`,
    variables: ['applicant_name', 'application_id', 'application_type', 'submitted_date'],
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'tpl_3',
    eventId: 'evt_docs_pending',
    channelId: 'ch_email',
    recipientType: 'customer',
    subject: 'Action Required: Documents Needed for Your Application',
    body: `Dear {{applicant_name}},

We are processing your application (ID: {{application_id}}) and require the following documents to proceed:

{{document_list}}

Please submit these documents by {{deadline}} to avoid delays in processing your application.

You can upload your documents through our secure portal or reply to this email with attachments.

Best regards,
The Onboarding Team`,
    variables: ['applicant_name', 'application_id', 'document_list', 'deadline'],
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'tpl_4',
    eventId: 'evt_docs_pending',
    channelId: 'ch_sms',
    recipientType: 'customer',
    body: `Hi {{applicant_name}}, documents needed for application {{application_id}}. Please check your email or upload via our portal. Deadline: {{deadline}}`,
    variables: ['applicant_name', 'application_id', 'deadline'],
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'tpl_5',
    eventId: 'evt_docs_pending',
    channelId: 'ch_whatsapp',
    recipientType: 'customer',
    body: `Hello {{applicant_name}}! 👋

This is a reminder about your application {{application_id}}.

We still need some documents from you. Please check your email for details or upload them through our portal.

⏰ Deadline: {{deadline}}

Reply "HELP" if you need assistance.`,
    variables: ['applicant_name', 'application_id', 'deadline'],
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'tpl_6',
    eventId: 'evt_reminder_3day',
    channelId: 'ch_email',
    recipientType: 'customer',
    subject: 'Reminder: Your Application Needs Attention',
    body: `Dear {{applicant_name}},

We noticed that your application (ID: {{application_id}}) has been pending for a few days. 

Current Status: {{current_status}}
Days Since Last Activity: {{days_inactive}}

To continue with your application, please {{required_action}}.

Need help? Our support team is here for you.

Best regards,
The Onboarding Team`,
    variables: ['applicant_name', 'application_id', 'current_status', 'days_inactive', 'required_action'],
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'tpl_7',
    eventId: 'evt_approved',
    channelId: 'ch_email',
    recipientType: 'customer',
    subject: 'Congratulations! Your Application Has Been Approved',
    body: `Dear {{applicant_name}},

Great news! Your application (ID: {{application_id}}) has been approved.

{{approval_details}}

Next steps:
{{next_steps}}

Welcome aboard! We're excited to have you with us.

Best regards,
The Onboarding Team`,
    variables: ['applicant_name', 'application_id', 'approval_details', 'next_steps'],
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'tpl_8',
    eventId: 'evt_staff_escalation',
    channelId: 'ch_teams',
    recipientType: 'internal_staff',
    body: `⚠️ **ESCALATION: Application Stalled**

**Application ID:** {{application_id}}
**Applicant:** {{applicant_name}}
**Current Status:** {{current_status}}
**Days Stalled:** {{days_stalled}}
**Assigned To:** {{assigned_staff}}

This application requires immediate attention. Customer has not responded to {{escalation_attempt}} contact attempts.

Please review and take action.`,
    variables: ['application_id', 'applicant_name', 'current_status', 'days_stalled', 'assigned_staff', 'escalation_attempt'],
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
]

// Applications
export const mockApplications: Application[] = [
  {
    id: 'app_001',
    applicantName: 'John Smith',
    applicantEmail: 'john.smith@email.com',
    applicantPhone: '+1987654321',
    type: 'Standard Account',
    status: 'documents_pending',
    submittedAt: '2024-01-10T09:00:00Z',
    lastUpdatedAt: '2024-01-12T14:30:00Z',
    assignedStaffId: 'staff_1',
    metadata: { source: 'website', referralCode: 'REF123' },
  },
  {
    id: 'app_002',
    applicantName: 'Emma Wilson',
    applicantEmail: 'emma.wilson@email.com',
    applicantPhone: '+1987654322',
    type: 'Premium Account',
    status: 'under_review',
    submittedAt: '2024-01-08T11:00:00Z',
    lastUpdatedAt: '2024-01-14T10:00:00Z',
    assignedStaffId: 'staff_1',
    metadata: { source: 'referral' },
  },
  {
    id: 'app_003',
    applicantName: 'Robert Brown',
    applicantEmail: 'robert.brown@email.com',
    applicantPhone: '+1987654323',
    type: 'Business Account',
    status: 'additional_info_required',
    submittedAt: '2024-01-05T15:00:00Z',
    lastUpdatedAt: '2024-01-11T09:00:00Z',
    assignedStaffId: 'staff_4',
    metadata: { source: 'partner', businessType: 'LLC' },
  },
  {
    id: 'app_004',
    applicantName: 'Lisa Anderson',
    applicantEmail: 'lisa.anderson@email.com',
    applicantPhone: '+1987654324',
    type: 'Standard Account',
    status: 'approved',
    submittedAt: '2024-01-03T08:00:00Z',
    lastUpdatedAt: '2024-01-13T16:00:00Z',
    assignedStaffId: 'staff_1',
    metadata: { source: 'website' },
  },
  {
    id: 'app_005',
    applicantName: 'James Taylor',
    applicantEmail: 'james.taylor@email.com',
    applicantPhone: '+1987654325',
    type: 'Premium Account',
    status: 'submitted',
    submittedAt: '2024-01-14T10:00:00Z',
    lastUpdatedAt: '2024-01-14T10:00:00Z',
    metadata: { source: 'mobile_app' },
  },
  {
    id: 'app_006',
    applicantName: 'Maria Garcia',
    applicantEmail: 'maria.garcia@email.com',
    applicantPhone: '+1987654326',
    type: 'Business Account',
    status: 'completed',
    submittedAt: '2024-01-01T12:00:00Z',
    lastUpdatedAt: '2024-01-10T14:00:00Z',
    assignedStaffId: 'staff_3',
    metadata: { source: 'website', businessType: 'Corporation' },
  },
]

// Message Logs
export const mockMessageLogs: MessageLog[] = [
  {
    id: 'msg_001',
    applicationId: 'app_001',
    eventId: 'evt_app_submitted',
    channelId: 'ch_email',
    recipientType: 'customer',
    recipientId: 'app_001',
    recipientName: 'John Smith',
    recipientContact: 'john.smith@email.com',
    templateId: 'tpl_1',
    subject: 'Your Application Has Been Received - app_001',
    body: 'Dear John Smith, Thank you for submitting your application...',
    status: 'opened',
    sentAt: '2024-01-10T09:05:00Z',
    deliveredAt: '2024-01-10T09:05:30Z',
    openedAt: '2024-01-10T10:15:00Z',
    escalationAttempt: 0,
  },
  {
    id: 'msg_002',
    applicationId: 'app_001',
    eventId: 'evt_docs_pending',
    channelId: 'ch_email',
    recipientType: 'customer',
    recipientId: 'app_001',
    recipientName: 'John Smith',
    recipientContact: 'john.smith@email.com',
    templateId: 'tpl_3',
    subject: 'Action Required: Documents Needed for Your Application',
    body: 'Dear John Smith, We are processing your application...',
    status: 'delivered',
    sentAt: '2024-01-11T10:00:00Z',
    deliveredAt: '2024-01-11T10:00:30Z',
    escalationAttempt: 0,
  },
  {
    id: 'msg_003',
    applicationId: 'app_001',
    eventId: 'evt_docs_pending',
    channelId: 'ch_sms',
    recipientType: 'customer',
    recipientId: 'app_001',
    recipientName: 'John Smith',
    recipientContact: '+1987654321',
    templateId: 'tpl_4',
    body: 'Hi John Smith, documents needed for application app_001...',
    status: 'delivered',
    sentAt: '2024-01-14T10:00:00Z',
    deliveredAt: '2024-01-14T10:00:15Z',
    escalatedFrom: 'msg_002',
    escalationAttempt: 1,
  },
  {
    id: 'msg_004',
    applicationId: 'app_001',
    eventId: 'evt_app_submitted',
    channelId: 'ch_teams',
    recipientType: 'internal_staff',
    recipientId: 'staff_1',
    recipientName: 'Sarah Johnson',
    recipientContact: 'sarah.johnson@company.com',
    templateId: 'tpl_2',
    body: '🆕 **New Application Received** Applicant: John Smith...',
    status: 'delivered',
    sentAt: '2024-01-10T09:05:00Z',
    deliveredAt: '2024-01-10T09:05:05Z',
    escalationAttempt: 0,
  },
  {
    id: 'msg_005',
    applicationId: 'app_002',
    eventId: 'evt_app_submitted',
    channelId: 'ch_email',
    recipientType: 'customer',
    recipientId: 'app_002',
    recipientName: 'Emma Wilson',
    recipientContact: 'emma.wilson@email.com',
    templateId: 'tpl_1',
    subject: 'Your Application Has Been Received - app_002',
    body: 'Dear Emma Wilson, Thank you for submitting your application...',
    status: 'replied',
    sentAt: '2024-01-08T11:05:00Z',
    deliveredAt: '2024-01-08T11:05:30Z',
    openedAt: '2024-01-08T12:00:00Z',
    repliedAt: '2024-01-08T14:30:00Z',
    escalationAttempt: 0,
  },
  {
    id: 'msg_006',
    applicationId: 'app_003',
    eventId: 'evt_additional_info',
    channelId: 'ch_email',
    recipientType: 'customer',
    recipientId: 'app_003',
    recipientName: 'Robert Brown',
    recipientContact: 'robert.brown@email.com',
    templateId: 'tpl_3',
    subject: 'Additional Information Required',
    body: 'Dear Robert Brown, We need additional information...',
    status: 'delivered',
    sentAt: '2024-01-11T09:00:00Z',
    deliveredAt: '2024-01-11T09:00:30Z',
    escalationAttempt: 0,
  },
  {
    id: 'msg_007',
    applicationId: 'app_003',
    eventId: 'evt_reminder_7day',
    channelId: 'ch_whatsapp',
    recipientType: 'customer',
    recipientId: 'app_003',
    recipientName: 'Robert Brown',
    recipientContact: '+1987654323',
    templateId: 'tpl_5',
    body: 'Hello Robert Brown! 👋 This is a reminder...',
    status: 'sent',
    sentAt: '2024-01-15T09:00:00Z',
    escalatedFrom: 'msg_006',
    escalationAttempt: 2,
  },
  {
    id: 'msg_008',
    applicationId: 'app_003',
    eventId: 'evt_staff_escalation',
    channelId: 'ch_teams',
    recipientType: 'internal_staff',
    recipientId: 'staff_2',
    recipientName: 'Michael Chen',
    recipientContact: 'michael.chen@company.com',
    templateId: 'tpl_8',
    body: '⚠️ **ESCALATION: Application Stalled**...',
    status: 'delivered',
    sentAt: '2024-01-15T09:05:00Z',
    deliveredAt: '2024-01-15T09:05:05Z',
    escalationAttempt: 0,
  },
  {
    id: 'msg_009',
    applicationId: 'app_004',
    eventId: 'evt_approved',
    channelId: 'ch_email',
    recipientType: 'customer',
    recipientId: 'app_004',
    recipientName: 'Lisa Anderson',
    recipientContact: 'lisa.anderson@email.com',
    templateId: 'tpl_7',
    subject: 'Congratulations! Your Application Has Been Approved',
    body: 'Dear Lisa Anderson, Great news! Your application has been approved...',
    status: 'opened',
    sentAt: '2024-01-13T16:00:00Z',
    deliveredAt: '2024-01-13T16:00:30Z',
    openedAt: '2024-01-13T17:00:00Z',
    escalationAttempt: 0,
  },
  {
    id: 'msg_010',
    applicationId: 'app_005',
    eventId: 'evt_app_submitted',
    channelId: 'ch_email',
    recipientType: 'customer',
    recipientId: 'app_005',
    recipientName: 'James Taylor',
    recipientContact: 'james.taylor@email.com',
    templateId: 'tpl_1',
    subject: 'Your Application Has Been Received - app_005',
    body: 'Dear James Taylor, Thank you for submitting your application...',
    status: 'sent',
    sentAt: '2024-01-14T10:05:00Z',
    escalationAttempt: 0,
  },
]

// Escalation Rules
export const mockEscalationRules: EscalationRule[] = [
  {
    id: 'esc_1',
    eventId: 'evt_docs_pending',
    fromChannelId: 'ch_email',
    toChannelId: 'ch_sms',
    waitDays: 3,
    maxAttempts: 2,
    isActive: true,
  },
  {
    id: 'esc_2',
    eventId: 'evt_docs_pending',
    fromChannelId: 'ch_sms',
    toChannelId: 'ch_whatsapp',
    waitDays: 2,
    maxAttempts: 2,
    isActive: true,
  },
  {
    id: 'esc_3',
    eventId: 'evt_docs_pending',
    fromChannelId: 'ch_whatsapp',
    toChannelId: 'ch_teams',
    waitDays: 2,
    maxAttempts: 1,
    isActive: true,
  },
  {
    id: 'esc_4',
    eventId: 'evt_reminder_3day',
    fromChannelId: 'ch_email',
    toChannelId: 'ch_whatsapp',
    waitDays: 4,
    maxAttempts: 2,
    isActive: true,
  },
  {
    id: 'esc_5',
    eventId: 'evt_additional_info',
    fromChannelId: 'ch_email',
    toChannelId: 'ch_sms',
    waitDays: 3,
    maxAttempts: 2,
    isActive: true,
  },
]
