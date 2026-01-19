"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ApplicationStatusBadge } from "./status-badge"
import type { Application, StaffMember } from "@/lib/messaging/types"
import { formatDistanceToNow } from "date-fns"
import { ArrowRight } from "lucide-react"

interface ApplicationsOverviewProps {
  applications: Application[]
  staff: StaffMember[]
}

export function ApplicationsOverview({ applications, staff }: ApplicationsOverviewProps) {
  const pendingApplications = applications
    .filter((a) => !["approved", "completed", "rejected"].includes(a.status))
    .slice(0, 5)

  const getStaffName = (staffId?: string) => {
    if (!staffId) return "Unassigned"
    return staff.find((s) => s.id === staffId)?.name || "Unknown"
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Pending Applications</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/applications" className="flex items-center gap-1">
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingApplications.map((app) => (
            <Link
              key={app.id}
              href={`/applications/${app.id}`}
              className="block rounded-lg border border-border p-3 transition-colors hover:bg-muted"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium text-foreground">
                      {app.applicantName}
                    </p>
                    <ApplicationStatusBadge status={app.status} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {app.type} &middot; {app.id}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Assigned to: {getStaffName(app.assignedStaffId)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    Updated {formatDistanceToNow(new Date(app.lastUpdatedAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </Link>
          ))}
          {pendingApplications.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No pending applications
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
