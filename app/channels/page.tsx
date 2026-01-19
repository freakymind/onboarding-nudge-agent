"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/messaging/app-sidebar"
import { messagingStore } from "@/lib/messaging/store"
import type { Channel } from "@/lib/messaging/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Mail, MessageSquare, Phone, Users, Settings, CheckCircle2, XCircle } from "lucide-react"

const channelIcons = {
  email: Mail,
  sms: MessageSquare,
  whatsapp: Phone,
  teams: Users,
}

export default function ChannelsPage() {
  const [channels, setChannels] = useState(messagingStore.getChannels())
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null)
  const metrics = messagingStore.getChannelMetrics()

  const handleToggleActive = (id: string, isActive: boolean) => {
    messagingStore.updateChannel(id, { isActive })
    setChannels(messagingStore.getChannels())
  }

  const getMetricsForChannel = (channelId: string) => {
    return metrics.find((m) => m.channelId === channelId)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <div className="border-b border-border bg-card px-8 py-6">
          <h1 className="text-2xl font-bold text-foreground">Channel Configuration</h1>
          <p className="text-sm text-muted-foreground">
            Configure messaging channels for customer and internal communications
          </p>
        </div>

        <div className="p-8">
          <div className="grid gap-6 md:grid-cols-2">
            {channels.map((channel) => {
              const Icon = channelIcons[channel.type as keyof typeof channelIcons] || Mail
              const channelMetrics = getMetricsForChannel(channel.id)

              return (
                <Card key={channel.id} className={!channel.isActive ? "opacity-60" : ""}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {channel.name}
                            {channel.isActive ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                <XCircle className="mr-1 h-3 w-3" />
                                Inactive
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription>{channel.description}</CardDescription>
                        </div>
                      </div>
                      <Switch
                        checked={channel.isActive}
                        onCheckedChange={(checked) => handleToggleActive(channel.id, checked)}
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    {channelMetrics && (
                      <div className="mb-4 grid grid-cols-4 gap-4 rounded-lg bg-muted p-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Sent</p>
                          <p className="text-lg font-semibold">{channelMetrics.totalSent}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Delivered</p>
                          <p className="text-lg font-semibold">{channelMetrics.delivered}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Opened</p>
                          <p className="text-lg font-semibold">{channelMetrics.opened}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Replied</p>
                          <p className="text-lg font-semibold">{channelMetrics.replied}</p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-foreground">Configuration</h4>
                      <div className="space-y-2">
                        {Object.entries(channel.config).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground capitalize">{key.replace(/_/g, " ")}</span>
                            <code className="rounded bg-muted px-2 py-1 text-xs">{value}</code>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Dialog
                      open={editingChannel?.id === channel.id}
                      onOpenChange={(open) => !open && setEditingChannel(null)}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" className="mt-4 w-full bg-transparent" onClick={() => setEditingChannel(channel)}>
                          <Settings className="mr-2 h-4 w-4" />
                          Configure Channel
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Configure {channel.name}</DialogTitle>
                          <DialogDescription>
                            Update the channel settings and API configuration.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          {Object.entries(channel.config).map(([key, value]) => (
                            <div key={key} className="grid gap-2">
                              <Label className="capitalize">{key.replace(/_/g, " ")}</Label>
                              <Input defaultValue={value} />
                            </div>
                          ))}
                          <div className="flex items-center justify-between">
                            <Label>Channel Active</Label>
                            <Switch checked={channel.isActive} />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setEditingChannel(null)}>
                            Cancel
                          </Button>
                          <Button onClick={() => setEditingChannel(null)}>Save Changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
