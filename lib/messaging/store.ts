import {
  mockChannels,
  mockEvents,
  mockRoutingRules,
  mockTemplates,
  mockRoles,
  mockStaff,
  mockRoleNotificationConfig,
  mockApplications,
  mockMessageLogs,
  mockEscalationRules,
} from './mock-data'
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
  ChannelMetrics,
  EventMetrics,
} from './types'

// In-memory data store for demo purposes
// In production, this would be replaced with actual database calls

class MessagingStore {
  private channels: Channel[] = [...mockChannels]
  private events: OnboardingEvent[] = [...mockEvents]
  private routingRules: RoutingRule[] = [...mockRoutingRules]
  private templates: MessageTemplate[] = [...mockTemplates]
  private roles: StaffRole[] = [...mockRoles]
  private staff: StaffMember[] = [...mockStaff]
  private roleNotificationConfig: RoleNotificationConfig[] = [...mockRoleNotificationConfig]
  private applications: Application[] = [...mockApplications]
  private messageLogs: MessageLog[] = [...mockMessageLogs]
  private escalationRules: EscalationRule[] = [...mockEscalationRules]

  // Channels
  getChannels(): Channel[] {
    return this.channels
  }

  getChannel(id: string): Channel | undefined {
    return this.channels.find((c) => c.id === id)
  }

  updateChannel(id: string, data: Partial<Channel>): Channel | undefined {
    const index = this.channels.findIndex((c) => c.id === id)
    if (index !== -1) {
      this.channels[index] = { ...this.channels[index], ...data }
      return this.channels[index]
    }
    return undefined
  }

  // Events
  getEvents(): OnboardingEvent[] {
    return this.events
  }

  getEvent(id: string): OnboardingEvent | undefined {
    return this.events.find((e) => e.id === id)
  }

  createEvent(event: OnboardingEvent): OnboardingEvent {
    this.events.push(event)
    return event
  }

  updateEvent(id: string, data: Partial<OnboardingEvent>): OnboardingEvent | undefined {
    const index = this.events.findIndex((e) => e.id === id)
    if (index !== -1) {
      this.events[index] = { ...this.events[index], ...data }
      return this.events[index]
    }
    return undefined
  }

  deleteEvent(id: string): boolean {
    const index = this.events.findIndex((e) => e.id === id)
    if (index !== -1) {
      this.events.splice(index, 1)
      return true
    }
    return false
  }

  // Routing Rules
  getRoutingRules(): RoutingRule[] {
    return this.routingRules
  }

  getRoutingRulesForEvent(eventId: string): RoutingRule[] {
    return this.routingRules.filter((r) => r.eventId === eventId)
  }

  createRoutingRule(rule: RoutingRule): RoutingRule {
    this.routingRules.push(rule)
    return rule
  }

  updateRoutingRule(id: string, data: Partial<RoutingRule>): RoutingRule | undefined {
    const index = this.routingRules.findIndex((r) => r.id === id)
    if (index !== -1) {
      this.routingRules[index] = { ...this.routingRules[index], ...data }
      return this.routingRules[index]
    }
    return undefined
  }

  deleteRoutingRule(id: string): boolean {
    const index = this.routingRules.findIndex((r) => r.id === id)
    if (index !== -1) {
      this.routingRules.splice(index, 1)
      return true
    }
    return false
  }

  // Templates
  getTemplates(): MessageTemplate[] {
    return this.templates
  }

  getTemplate(id: string): MessageTemplate | undefined {
    return this.templates.find((t) => t.id === id)
  }

  getTemplatesForEvent(eventId: string): MessageTemplate[] {
    return this.templates.filter((t) => t.eventId === eventId)
  }

  getTemplateForEventAndChannel(eventId: string, channelId: string, recipientType: string): MessageTemplate | undefined {
    return this.templates.find(
      (t) => t.eventId === eventId && t.channelId === channelId && t.recipientType === recipientType
    )
  }

  createTemplate(template: MessageTemplate): MessageTemplate {
    this.templates.push(template)
    return template
  }

  updateTemplate(id: string, data: Partial<MessageTemplate>): MessageTemplate | undefined {
    const index = this.templates.findIndex((t) => t.id === id)
    if (index !== -1) {
      this.templates[index] = { ...this.templates[index], ...data, updatedAt: new Date().toISOString() }
      return this.templates[index]
    }
    return undefined
  }

  deleteTemplate(id: string): boolean {
    const index = this.templates.findIndex((t) => t.id === id)
    if (index !== -1) {
      this.templates.splice(index, 1)
      return true
    }
    return false
  }

  // Roles
  getRoles(): StaffRole[] {
    return this.roles
  }

  getRole(id: string): StaffRole | undefined {
    return this.roles.find((r) => r.id === id)
  }

  createRole(role: StaffRole): StaffRole {
    this.roles.push(role)
    return role
  }

  updateRole(id: string, data: Partial<StaffRole>): StaffRole | undefined {
    const index = this.roles.findIndex((r) => r.id === id)
    if (index !== -1) {
      this.roles[index] = { ...this.roles[index], ...data }
      return this.roles[index]
    }
    return undefined
  }

  // Staff
  getStaff(): StaffMember[] {
    return this.staff
  }

  getStaffMember(id: string): StaffMember | undefined {
    return this.staff.find((s) => s.id === id)
  }

  getStaffByRole(roleId: string): StaffMember[] {
    return this.staff.filter((s) => s.roleIds.includes(roleId))
  }

  createStaffMember(member: StaffMember): StaffMember {
    this.staff.push(member)
    return member
  }

  updateStaffMember(id: string, data: Partial<StaffMember>): StaffMember | undefined {
    const index = this.staff.findIndex((s) => s.id === id)
    if (index !== -1) {
      this.staff[index] = { ...this.staff[index], ...data }
      return this.staff[index]
    }
    return undefined
  }

  // Role Notification Config
  getRoleNotificationConfig(): RoleNotificationConfig[] {
    return this.roleNotificationConfig
  }

  updateRoleNotificationConfig(roleId: string, eventId: string, isEnabled: boolean): void {
    const existing = this.roleNotificationConfig.find((c) => c.roleId === roleId && c.eventId === eventId)
    if (existing) {
      existing.isEnabled = isEnabled
    } else {
      this.roleNotificationConfig.push({
        id: `rnc_${Date.now()}`,
        roleId,
        eventId,
        isEnabled,
      })
    }
  }

  // Applications
  getApplications(): Application[] {
    return this.applications
  }

  getApplication(id: string): Application | undefined {
    return this.applications.find((a) => a.id === id)
  }

  updateApplication(id: string, data: Partial<Application>): Application | undefined {
    const index = this.applications.findIndex((a) => a.id === id)
    if (index !== -1) {
      this.applications[index] = { ...this.applications[index], ...data, lastUpdatedAt: new Date().toISOString() }
      return this.applications[index]
    }
    return undefined
  }

  // Message Logs
  getMessageLogs(): MessageLog[] {
    return this.messageLogs.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
  }

  getMessageLogsForApplication(applicationId: string): MessageLog[] {
    return this.messageLogs
      .filter((m) => m.applicationId === applicationId)
      .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
  }

  createMessageLog(log: MessageLog): MessageLog {
    this.messageLogs.push(log)
    return log
  }

  updateMessageLog(id: string, data: Partial<MessageLog>): MessageLog | undefined {
    const index = this.messageLogs.findIndex((m) => m.id === id)
    if (index !== -1) {
      this.messageLogs[index] = { ...this.messageLogs[index], ...data }
      return this.messageLogs[index]
    }
    return undefined
  }

  // Escalation Rules
  getEscalationRules(): EscalationRule[] {
    return this.escalationRules
  }

  getEscalationRulesForEvent(eventId: string): EscalationRule[] {
    return this.escalationRules.filter((e) => e.eventId === eventId)
  }

  createEscalationRule(rule: EscalationRule): EscalationRule {
    this.escalationRules.push(rule)
    return rule
  }

  updateEscalationRule(id: string, data: Partial<EscalationRule>): EscalationRule | undefined {
    const index = this.escalationRules.findIndex((e) => e.id === id)
    if (index !== -1) {
      this.escalationRules[index] = { ...this.escalationRules[index], ...data }
      return this.escalationRules[index]
    }
    return undefined
  }

  deleteEscalationRule(id: string): boolean {
    const index = this.escalationRules.findIndex((e) => e.id === id)
    if (index !== -1) {
      this.escalationRules.splice(index, 1)
      return true
    }
    return false
  }

  // Analytics
  getChannelMetrics(): ChannelMetrics[] {
    return this.channels.map((channel) => {
      const logs = this.messageLogs.filter((l) => l.channelId === channel.id)
      const delivered = logs.filter((l) => ['delivered', 'opened', 'clicked', 'replied'].includes(l.status)).length
      const opened = logs.filter((l) => ['opened', 'clicked', 'replied'].includes(l.status)).length
      const replied = logs.filter((l) => l.status === 'replied').length
      const failed = logs.filter((l) => ['failed', 'bounced'].includes(l.status)).length

      // Calculate avg response time for replied messages
      const repliedLogs = logs.filter((l) => l.repliedAt && l.sentAt)
      const avgResponseTimeHours =
        repliedLogs.length > 0
          ? repliedLogs.reduce((acc, l) => {
              const sent = new Date(l.sentAt).getTime()
              const replied = new Date(l.repliedAt!).getTime()
              return acc + (replied - sent) / (1000 * 60 * 60)
            }, 0) / repliedLogs.length
          : 0

      return {
        channelId: channel.id,
        totalSent: logs.length,
        delivered,
        opened,
        replied,
        failed,
        avgResponseTimeHours: Math.round(avgResponseTimeHours * 10) / 10,
      }
    })
  }

  getEventMetrics(): EventMetrics[] {
    return this.events.map((event) => {
      const logs = this.messageLogs.filter((l) => l.eventId === event.id)
      const delivered = logs.filter((l) => ['delivered', 'opened', 'clicked', 'replied'].includes(l.status)).length
      const replied = logs.filter((l) => l.status === 'replied').length

      return {
        eventId: event.id,
        totalTriggered: logs.length,
        successfulDelivery: delivered,
        responseRate: logs.length > 0 ? Math.round((replied / logs.length) * 100) : 0,
        avgTimeToAction: Math.random() * 48, // Mock data
      }
    })
  }

  getDashboardStats() {
    const totalApplications = this.applications.length
    const pendingApplications = this.applications.filter((a) =>
      ['submitted', 'documents_pending', 'under_review', 'additional_info_required'].includes(a.status)
    ).length
    const completedApplications = this.applications.filter((a) =>
      ['approved', 'completed'].includes(a.status)
    ).length
    const totalMessagesSent = this.messageLogs.length
    const messagesDelivered = this.messageLogs.filter((l) =>
      ['delivered', 'opened', 'clicked', 'replied'].includes(l.status)
    ).length
    const messagesReplied = this.messageLogs.filter((l) => l.status === 'replied').length
    const activeChannels = this.channels.filter((c) => c.isActive).length
    const activeEvents = this.events.filter((e) => e.isActive).length

    return {
      totalApplications,
      pendingApplications,
      completedApplications,
      totalMessagesSent,
      messagesDelivered,
      messagesReplied,
      deliveryRate: totalMessagesSent > 0 ? Math.round((messagesDelivered / totalMessagesSent) * 100) : 0,
      responseRate: totalMessagesSent > 0 ? Math.round((messagesReplied / totalMessagesSent) * 100) : 0,
      activeChannels,
      activeEvents,
    }
  }
}

// Singleton instance
export const messagingStore = new MessagingStore()
