"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/messaging/app-sidebar"
import { MessageStatusBadge, ChannelBadge } from "@/components/messaging/status-badge"
import { messagingStore } from "@/lib/messaging/store"
import type { MessageLog, MessageStatus } from "@/lib/messaging/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, ArrowUpRight, RefreshCw, Download } from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

const statusOptions: MessageStatus[] = ["queued", "sent", "delivered", "opened", "clicked", "replied", "failed", "bounced"]

const Loading = () => null

export default function LogsPage() {
  const searchParams = useSearchParams()
  const logs = messagingStore.getMessageLogs()
  const events = messagingStore.getEvents()
  const channels = messagingStore.getChannels()
  const applications = messagingStore.getApplications()

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [channelFilter, setChannelFilter] = useState<string>("all")
  const [recipientFilter, setRecipientFilter] = useState<string>("all")
  const [selectedLog, setSelectedLog] = useState<MessageLog | null>(null)

  const getEventName = (eventId: string) => events.find((e) => e.id === eventId)?.name || eventId
  const getChannelType = (channelId: string) => channels.find((c) => c.id === channelId)?.type || channelId
  const getChannelName = (channelId: string) => channels.find((c) => c.id === channelId)?.name || channelId
  const getApplicationName = (appId: string) => applications.find((a) => a.id === appId)?.applicantName || appId

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.recipientContact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.applicationId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || log.status === statusFilter
    const matchesChannel = channelFilter === "all" || log.channelId === channelFilter
    const matchesRecipient = recipientFilter === "all" || log.recipientType === recipientFilter
    return matchesSearch && matchesStatus && matchesChannel && matchesRecipient
  })

  // Stats
  const totalMessages = logs.length
  const deliveredMessages = logs.filter((l) => ["delivered", "opened", "clicked", "replied"].includes(l.status)).length
  const failedMessages = logs.filter((l) => ["failed", "bounced"].includes(l.status)).length
  const escalatedMessages = logs.filter((l) => l.escalationAttempt > 0).length

  return (
    <Suspense fallback={<Loading />}>
      <div className="flex min-h-screen bg-background">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="border-b border-border bg-card px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Message Logs</h1>
                <p className="text-sm text-muted-foreground">
                  Complete history of all sent messages and their delivery status
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Stats */}
            <div className="mb-6 grid grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Total Messages</p>
                  <p className="text-2xl font-bold">{totalMessages}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Delivered</p>
                  <p className="text-2xl font-bold text-green-600">{deliveredMessages}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Failed</p>
                  <p className="text-2xl font-bold text-red-600">{failedMessages}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Escalated</p>
                  <p className="text-2xl font-bold text-orange-600">{escalatedMessages}</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search by recipient, contact, or application..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status} className="capitalize">
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={channelFilter} onValueChange={setChannelFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Channel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Channels</SelectItem>
                      {channels.map((channel) => (
                        <SelectItem key={channel.id} value={channel.id}>
                          {channel.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={recipientFilter} onValueChange={setRecipientFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Recipient" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Recipients</SelectItem>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="internal_staff">Internal Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Channel</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Application</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div>
                            <p className="text-sm">{format(new Date(log.sentAt), "MMM d, yyyy")}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(log.sentAt), "h:mm a")}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{log.recipientName}</p>
                            <p className="text-xs text-muted-foreground">{log.recipientContact}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{getEventName(log.eventId)}</p>
                            <Badge
                              variant="outline"
                              className={
                                log.recipientType === "customer"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-purple-50 text-purple-700 border-purple-200"
                              }
                            >
                              {log.recipientType === "customer" ? "Customer" : "Staff"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <ChannelBadge channel={getChannelType(log.channelId)} />
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <MessageStatusBadge status={log.status} />
                            {log.escalationAttempt > 0 && (
                              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                                Escalation #{log.escalationAttempt}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <a
                            href={`/applications/${log.applicationId}`}
                            className="flex items-center gap-1 text-sm text-primary hover:underline"
                          >
                            {log.applicationId}
                            <ArrowUpRight className="h-3 w-3" />
                          </a>
                        </TableCell>
                        <TableCell className="text-right">
                          <Dialog
                            open={selectedLog?.id === log.id}
                            onOpenChange={(open) => !open && setSelectedLog(null)}
                          >
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => setSelectedLog(log)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                              <DialogHeader>
                                <DialogTitle>Message Details</DialogTitle>
                                <DialogDescription>
                                  Full message content and delivery timeline
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                {/* Meta Info */}
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="text-muted-foreground">Message ID</p>
                                    <p className="font-mono">{log.id}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Application</p>
                                    <p>{log.applicationId}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Recipient</p>
                                    <p>{log.recipientName}</p>
                                    <p className="text-xs text-muted-foreground">{log.recipientContact}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Channel</p>
                                    <ChannelBadge channel={getChannelType(log.channelId)} />
                                  </div>
                                </div>

                                {/* Timeline */}
                                <div className="rounded-lg border border-border p-4">
                                  <h4 className="mb-3 font-medium">Delivery Timeline</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Sent</span>
                                      <span>{format(new Date(log.sentAt), "MMM d, h:mm:ss a")}</span>
                                    </div>
                                    {log.deliveredAt && (
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Delivered</span>
                                        <span>{format(new Date(log.deliveredAt), "MMM d, h:mm:ss a")}</span>
                                      </div>
                                    )}
                                    {log.openedAt && (
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Opened</span>
                                        <span>{format(new Date(log.openedAt), "MMM d, h:mm:ss a")}</span>
                                      </div>
                                    )}
                                    {log.repliedAt && (
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Replied</span>
                                        <span>{format(new Date(log.repliedAt), "MMM d, h:mm:ss a")}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Message Content */}
                                <div className="rounded-lg border border-border p-4">
                                  <h4 className="mb-3 font-medium">Message Content</h4>
                                  {log.subject && (
                                    <div className="mb-2">
                                      <p className="text-xs text-muted-foreground">Subject</p>
                                      <p className="font-medium">{log.subject}</p>
                                    </div>
                                  )}
                                  <div>
                                    <p className="text-xs text-muted-foreground">Body</p>
                                    <p className="whitespace-pre-wrap text-sm">{log.body}</p>
                                  </div>
                                </div>

                                {/* Escalation Info */}
                                {log.escalationAttempt > 0 && (
                                  <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                                    <h4 className="mb-2 font-medium text-orange-800">Escalation Information</h4>
                                    <p className="text-sm text-orange-700">
                                      This is escalation attempt #{log.escalationAttempt}
                                      {log.escalatedFrom && ` (escalated from message ${log.escalatedFrom})`}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </Suspense>
  )
}
