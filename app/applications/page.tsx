"use client"

import { useState } from "react"
import Link from "next/link"
import { AppSidebar } from "@/components/messaging/app-sidebar"
import { ApplicationStatusBadge } from "@/components/messaging/status-badge"
import { messagingStore } from "@/lib/messaging/store"
import type { ApplicationStatus } from "@/lib/messaging/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
import { Search, ArrowRight, Send, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { format, formatDistanceToNow, differenceInDays } from "date-fns"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

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

const Loading = () => null;

export default function ApplicationsPage() {
  const searchParams = useSearchParams();
  const applications = messagingStore.getApplications()
  const staff = messagingStore.getStaff()
  const messageLogs = messagingStore.getMessageLogs()

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const getStaffName = (staffId?: string) => {
    if (!staffId) return "Unassigned"
    return staff.find((s) => s.id === staffId)?.name || "Unknown"
  }

  const getMessageCountForApp = (appId: string) => {
    return messageLogs.filter((l) => l.applicationId === appId).length
  }

  const getLastMessageDate = (appId: string) => {
    const appLogs = messageLogs.filter((l) => l.applicationId === appId)
    if (appLogs.length === 0) return null
    return appLogs.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())[0].sentAt
  }

  const getDaysSinceUpdate = (dateStr: string) => {
    return differenceInDays(new Date(), new Date(dateStr))
  }

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicantEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Stats
  const totalApps = applications.length
  const pendingApps = applications.filter((a) =>
    ["submitted", "documents_pending", "under_review", "additional_info_required"].includes(a.status)
  ).length
  const completedApps = applications.filter((a) => ["approved", "completed"].includes(a.status)).length
  const stalledApps = applications.filter((a) => {
    const daysSince = getDaysSinceUpdate(a.lastUpdatedAt)
    return daysSince > 5 && !["approved", "completed", "rejected"].includes(a.status)
  }).length

  return (
    <Suspense fallback={<Loading />}>
      <div className="flex min-h-screen bg-background">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="border-b border-border bg-card px-8 py-6">
            <h1 className="text-2xl font-bold text-foreground">Applications</h1>
            <p className="text-sm text-muted-foreground">
              Track onboarding applications and their messaging history
            </p>
          </div>

          <div className="p-8">
            {/* Stats */}
            <div className="mb-6 grid grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                      <Send className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-2xl font-bold">{totalApps}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
                      <Clock className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pending</p>
                      <p className="text-2xl font-bold">{pendingApps}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Completed</p>
                      <p className="text-2xl font-bold">{completedApps}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Stalled ({'>'}5 days)</p>
                      <p className="text-2xl font-bold">{stalledApps}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, email, or ID..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status} className="capitalize">
                          {status.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Application</TableHead>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Messages</TableHead>
                      <TableHead>Last Activity</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((app) => {
                      const daysSinceUpdate = getDaysSinceUpdate(app.lastUpdatedAt)
                      const isStalled = daysSinceUpdate > 5 && !["approved", "completed", "rejected"].includes(app.status)
                      const lastMessage = getLastMessageDate(app.id)

                      return (
                        <TableRow key={app.id} className={isStalled ? "bg-red-50/50" : ""}>
                          <TableCell>
                            <p className="font-mono text-sm">{app.id}</p>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{app.applicantName}</p>
                              <p className="text-xs text-muted-foreground">{app.applicantEmail}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{app.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <ApplicationStatusBadge status={app.status} />
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">{getStaffName(app.assignedStaffId)}</p>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-slate-50">
                                {getMessageCountForApp(app.id)} sent
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm">
                                {formatDistanceToNow(new Date(app.lastUpdatedAt), { addSuffix: true })}
                              </p>
                              {isStalled && (
                                <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200 mt-1">
                                  Stalled
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/applications/${app.id}`} className="flex items-center gap-1">
                                View
                                <ArrowRight className="h-4 w-4" />
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
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
