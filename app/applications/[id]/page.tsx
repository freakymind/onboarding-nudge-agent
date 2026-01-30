"use client"

import { use } from "react"
import Link from "next/link"
import { AppSidebar } from "@/components/messaging/app-sidebar"
import { ApplicationStatusBadge, MessageStatusBadge, ChannelBadge } from "@/components/messaging/status-badge"
import { messagingStore } from "@/lib/messaging/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Send,
  Mail,
  Phone,
  User,
  Calendar,
  Clock,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"
import type { ApplicationStatus } from "@/lib/messaging/types"

const statusOptions: ApplicationStatus[] = [
  "submitted",
  "documents_pending",
  "documents_received",
  "under_review",
  "additional_info_required",
  "approved",
  "rejected",
  "completed",
]

export default function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const application = messagingStore.getApplication(id)
  const messageLogs = messagingStore.getMessageLogsForApplication(id)
  const staff = messagingStore.getStaff()
  const events = messagingStore.getEvents()
  const channels = messagingStore.getChannels()

  if (!application) {
    return (
      <div className="flex min-h-screen bg-background">
        <AppSidebar />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Application Not Found</h1>
            <p className="mt-2 text-muted-foreground">The application you are looking for does not exist.</p>
            <Button asChild className="mt-4">
              <Link href="/applications">Back to Applications</Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  const getStaffName = (staffId?: string) => {
    if (!staffId) return "Unassigned"
    return staff.find((s) => s.id === staffId)?.name || "Unknown"
  }

  const getEventName = (eventId: string) => events.find((e) => e.id === eventId)?.name || eventId
  const getChannelType = (channelId: string) => channels.find((c) => c.id === channelId)?.type || channelId

  // Message stats
  const totalMessages = messageLogs.length
  const customerMessages = messageLogs.filter((l) => l.recipientType === "customer").length
  const staffMessages = messageLogs.filter((l) => l.recipientType === "internal_staff").length
  const escalatedMessages = messageLogs.filter((l) => l.escalationAttempt > 0).length

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <div className="border-b border-border bg-card px-8 py-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/applications">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">{application.applicantName}</h1>
                <ApplicationStatusBadge status={application.status} />
              </div>
              <p className="text-sm text-muted-foreground">Application ID: {application.id}</p>
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue={application.status}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Update status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status} className="capitalize">
                      {status.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button asChild className="bg-[#D71C2B] hover:bg-[#EE2033]">
                <Link href={`/send?application=${id}`}>
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Application Details */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Application Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Applicant</p>
                      <p className="font-medium">{application.applicantName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{application.applicantEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{application.applicantPhone}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Submitted</p>
                      <p className="font-medium">{format(new Date(application.submittedAt), "MMM d, yyyy")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Last Updated</p>
                      <p className="font-medium">
                        {formatDistanceToNow(new Date(application.lastUpdatedAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground">Application Type</p>
                    <Badge variant="outline" className="mt-1">
                      {application.type}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Assigned To</p>
                    <p className="mt-1 font-medium">{getStaffName(application.assignedStaffId)}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Message Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Message Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-muted p-3 text-center">
                      <p className="text-2xl font-bold">{totalMessages}</p>
                      <p className="text-xs text-muted-foreground">Total Sent</p>
                    </div>
                    <div className="rounded-lg bg-muted p-3 text-center">
                      <p className="text-2xl font-bold">{customerMessages}</p>
                      <p className="text-xs text-muted-foreground">To Customer</p>
                    </div>
                    <div className="rounded-lg bg-muted p-3 text-center">
                      <p className="text-2xl font-bold">{staffMessages}</p>
                      <p className="text-xs text-muted-foreground">To Staff</p>
                    </div>
                    <div className="rounded-lg bg-muted p-3 text-center">
                      <p className="text-2xl font-bold text-orange-600">{escalatedMessages}</p>
                      <p className="text-xs text-muted-foreground">Escalated</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Message History */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Message History</CardTitle>
                  <CardDescription>Complete timeline of all messages for this application</CardDescription>
                </CardHeader>
                <CardContent>
                  {messageLogs.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                      <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <p className="mt-2">No messages sent yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messageLogs.map((log, index) => (
                        <div key={log.id} className="relative">
                          {index < messageLogs.length - 1 && (
                            <div className="absolute left-5 top-12 h-full w-0.5 bg-border" />
                          )}
                          <div className="flex gap-4">
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                                log.recipientType === "customer"
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-purple-100 text-purple-600"
                              }`}
                            >
                              {log.recipientType === "customer" ? (
                                <User className="h-5 w-5" />
                              ) : (
                                <User className="h-5 w-5" />
                              )}
                            </div>
                            <div className="flex-1 rounded-lg border border-border p-4">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <p className="font-medium">{log.recipientName}</p>
                                    <ChannelBadge channel={getChannelType(log.channelId)} />
                                    <MessageStatusBadge status={log.status} />
                                    {log.escalationAttempt > 0 && (
                                      <Badge
                                        variant="outline"
                                        className="bg-orange-50 text-orange-700 border-orange-200"
                                      >
                                        <AlertTriangle className="mr-1 h-3 w-3" />
                                        Escalation #{log.escalationAttempt}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="mt-1 text-sm text-muted-foreground">
                                    {getEventName(log.eventId)} &middot; {log.recipientContact}
                                  </p>
                                </div>
                                <p className="text-xs text-muted-foreground whitespace-nowrap">
                                  {format(new Date(log.sentAt), "MMM d, h:mm a")}
                                </p>
                              </div>
                              {log.subject && (
                                <div className="mt-3">
                                  <p className="text-xs font-medium text-muted-foreground">Subject</p>
                                  <p className="text-sm">{log.subject}</p>
                                </div>
                              )}
                              <div className="mt-2">
                                <p className="text-xs font-medium text-muted-foreground">Message</p>
                                <p className="mt-1 line-clamp-3 text-sm text-foreground">{log.body}</p>
                              </div>
                              {/* Delivery Timeline */}
                              <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Send className="h-3 w-3" />
                                  Sent
                                </span>
                                {log.deliveredAt && (
                                  <span className="flex items-center gap-1">
                                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                                    Delivered
                                  </span>
                                )}
                                {log.openedAt && (
                                  <span className="flex items-center gap-1">
                                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                                    Opened
                                  </span>
                                )}
                                {log.repliedAt && (
                                  <span className="flex items-center gap-1">
                                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                                    Replied
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
