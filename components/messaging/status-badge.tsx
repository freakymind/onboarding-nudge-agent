import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ApplicationStatus, MessageStatus, EventSeverity } from "@/lib/messaging/types"

const applicationStatusConfig: Record<ApplicationStatus, { label: string; className: string }> = {
  submitted: { label: "Submitted", className: "bg-blue-100 text-blue-800 border-blue-200" },
  documents_pending: { label: "Docs Pending", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  documents_received: { label: "Docs Received", className: "bg-cyan-100 text-cyan-800 border-cyan-200" },
  under_review: { label: "Under Review", className: "bg-purple-100 text-purple-800 border-purple-200" },
  additional_info_required: { label: "Info Required", className: "bg-orange-100 text-orange-800 border-orange-200" },
  approved: { label: "Approved", className: "bg-green-100 text-green-800 border-green-200" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-800 border-red-200" },
  completed: { label: "Completed", className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
}

const messageStatusConfig: Record<MessageStatus, { label: string; className: string }> = {
  queued: { label: "Queued", className: "bg-slate-100 text-slate-800 border-slate-200" },
  sent: { label: "Sent", className: "bg-blue-100 text-blue-800 border-blue-200" },
  delivered: { label: "Delivered", className: "bg-cyan-100 text-cyan-800 border-cyan-200" },
  opened: { label: "Opened", className: "bg-green-100 text-green-800 border-green-200" },
  clicked: { label: "Clicked", className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  replied: { label: "Replied", className: "bg-teal-100 text-teal-800 border-teal-200" },
  failed: { label: "Failed", className: "bg-red-100 text-red-800 border-red-200" },
  bounced: { label: "Bounced", className: "bg-orange-100 text-orange-800 border-orange-200" },
}

const severityConfig: Record<EventSeverity, { label: string; className: string }> = {
  low: { label: "Low", className: "bg-slate-100 text-slate-800 border-slate-200" },
  medium: { label: "Medium", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  high: { label: "High", className: "bg-orange-100 text-orange-800 border-orange-200" },
  critical: { label: "Critical", className: "bg-red-100 text-red-800 border-red-200" },
}

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus
}

export function ApplicationStatusBadge({ status }: ApplicationStatusBadgeProps) {
  const config = applicationStatusConfig[status]
  return (
    <Badge variant="outline" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  )
}

interface MessageStatusBadgeProps {
  status: MessageStatus
}

export function MessageStatusBadge({ status }: MessageStatusBadgeProps) {
  const config = messageStatusConfig[status]
  return (
    <Badge variant="outline" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  )
}

interface SeverityBadgeProps {
  severity: EventSeverity
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  const config = severityConfig[severity]
  return (
    <Badge variant="outline" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  )
}

interface ChannelBadgeProps {
  channel: string
}

const channelColors: Record<string, string> = {
  email: "bg-blue-100 text-blue-800 border-blue-200",
  sms: "bg-green-100 text-green-800 border-green-200",
  whatsapp: "bg-emerald-100 text-emerald-800 border-emerald-200",
  teams: "bg-purple-100 text-purple-800 border-purple-200",
}

export function ChannelBadge({ channel }: ChannelBadgeProps) {
  const className = channelColors[channel] || "bg-slate-100 text-slate-800 border-slate-200"
  return (
    <Badge variant="outline" className={cn("font-medium capitalize", className)}>
      {channel}
    </Badge>
  )
}
