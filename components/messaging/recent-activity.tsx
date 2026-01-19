"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageStatusBadge, ChannelBadge } from "./status-badge"
import type { MessageLog, OnboardingEvent, Channel } from "@/lib/messaging/types"
import { formatDistanceToNow } from "date-fns"

interface RecentActivityProps {
  logs: MessageLog[]
  events: OnboardingEvent[]
  channels: Channel[]
}

export function RecentActivity({ logs, events, channels }: RecentActivityProps) {
  const recentLogs = logs.slice(0, 8)

  const getEventName = (eventId: string) => {
    return events.find((e) => e.id === eventId)?.name || eventId
  }

  const getChannelType = (channelId: string) => {
    return channels.find((c) => c.id === channelId)?.type || channelId
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Messages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-start justify-between gap-4 border-b border-border pb-4 last:border-0 last:pb-0"
            >
              <div className="min-w-0 flex-1 space-y-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {log.recipientName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {getEventName(log.eventId)}
                </p>
                <div className="flex items-center gap-2">
                  <ChannelBadge channel={getChannelType(log.channelId)} />
                  <MessageStatusBadge status={log.status} />
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(log.sentAt), { addSuffix: true })}
                </p>
                {log.escalationAttempt > 0 && (
                  <p className="text-xs text-orange-600">
                    Escalation #{log.escalationAttempt}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
