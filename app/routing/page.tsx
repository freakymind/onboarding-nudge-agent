"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/messaging/app-sidebar"
import { ChannelBadge } from "@/components/messaging/status-badge"
import { messagingStore } from "@/lib/messaging/store"
import type { RoutingRule, RecipientType } from "@/lib/messaging/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Plus, Pencil, Trash2, ArrowRight, Timer, Users } from "lucide-react"

export default function RoutingPage() {
  const [rules, setRules] = useState(messagingStore.getRoutingRules())
  const events = messagingStore.getEvents()
  const channels = messagingStore.getChannels()
  const roles = messagingStore.getRoles()
  const escalationRules = messagingStore.getEscalationRules()

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<RoutingRule | null>(null)

  const [formData, setFormData] = useState({
    eventId: "",
    channelId: "",
    recipientType: "customer" as RecipientType,
    priority: 1,
    staffRoleIds: [] as string[],
    waitDaysBeforeEscalation: 0,
    escalationChannelId: "",
    isActive: true,
  })

  const getEventName = (eventId: string) => events.find((e) => e.id === eventId)?.name || eventId
  const getChannelType = (channelId: string) => channels.find((c) => c.id === channelId)?.type || channelId
  const getChannelName = (channelId: string) => channels.find((c) => c.id === channelId)?.name || channelId
  const getRoleNames = (roleIds: string[]) =>
    roleIds.map((id) => roles.find((r) => r.id === id)?.name || id).join(", ")

  const handleCreateRule = () => {
    const newRule: RoutingRule = {
      id: `rr_${Date.now()}`,
      ...formData,
      conditions: [],
    }
    messagingStore.createRoutingRule(newRule)
    setRules(messagingStore.getRoutingRules())
    setIsCreateDialogOpen(false)
    resetForm()
  }

  const handleUpdateRule = () => {
    if (!editingRule) return
    messagingStore.updateRoutingRule(editingRule.id, { ...formData, conditions: [] })
    setRules(messagingStore.getRoutingRules())
    setEditingRule(null)
    resetForm()
  }

  const handleDeleteRule = (id: string) => {
    messagingStore.deleteRoutingRule(id)
    setRules(messagingStore.getRoutingRules())
  }

  const handleToggleActive = (id: string, isActive: boolean) => {
    messagingStore.updateRoutingRule(id, { isActive })
    setRules(messagingStore.getRoutingRules())
  }

  const resetForm = () => {
    setFormData({
      eventId: "",
      channelId: "",
      recipientType: "customer",
      priority: 1,
      staffRoleIds: [],
      waitDaysBeforeEscalation: 0,
      escalationChannelId: "",
      isActive: true,
    })
  }

  const openEditDialog = (rule: RoutingRule) => {
    setEditingRule(rule)
    setFormData({
      eventId: rule.eventId,
      channelId: rule.channelId,
      recipientType: rule.recipientType,
      priority: rule.priority,
      staffRoleIds: rule.staffRoleIds,
      waitDaysBeforeEscalation: rule.waitDaysBeforeEscalation,
      escalationChannelId: rule.escalationChannelId || "",
      isActive: rule.isActive,
    })
  }

  const RuleForm = () => (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label>Event</Label>
        <Select value={formData.eventId} onValueChange={(value) => setFormData({ ...formData, eventId: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select event..." />
          </SelectTrigger>
          <SelectContent>
            {events.map((event) => (
              <SelectItem key={event.id} value={event.id}>
                {event.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label>Channel</Label>
        <Select value={formData.channelId} onValueChange={(value) => setFormData({ ...formData, channelId: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select channel..." />
          </SelectTrigger>
          <SelectContent>
            {channels.map((channel) => (
              <SelectItem key={channel.id} value={channel.id}>
                {channel.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label>Recipient Type</Label>
          <Select
            value={formData.recipientType}
            onValueChange={(value: RecipientType) => setFormData({ ...formData, recipientType: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="customer">Customer</SelectItem>
              <SelectItem value="internal_staff">Internal Staff</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Priority</Label>
          <Input
            type="number"
            min={1}
            max={10}
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 1 })}
          />
        </div>
      </div>
      {formData.recipientType === "internal_staff" && (
        <div className="grid gap-2">
          <Label>Staff Roles (for internal notifications)</Label>
          <Select
            value={formData.staffRoleIds[0] || "defaultRole"} // Updated default value
            onValueChange={(value) => setFormData({ ...formData, staffRoleIds: [value] })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role..." />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label>Wait Days Before Escalation</Label>
          <Input
            type="number"
            min={0}
            value={formData.waitDaysBeforeEscalation}
            onChange={(e) =>
              setFormData({ ...formData, waitDaysBeforeEscalation: parseInt(e.target.value) || 0 })
            }
          />
        </div>
        <div className="grid gap-2">
          <Label>Escalation Channel</Label>
          <Select
            value={formData.escalationChannelId}
            onValueChange={(value) => setFormData({ ...formData, escalationChannelId: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              {channels.map((channel) => (
                <SelectItem key={channel.id} value={channel.id}>
                  {channel.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Label>Active</Label>
        <Switch
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
        />
      </div>
    </div>
  )

  // Group rules by event
  const rulesByEvent = events.map((event) => ({
    event,
    rules: rules.filter((r) => r.eventId === event.id),
  })).filter((group) => group.rules.length > 0)

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <div className="border-b border-border bg-card px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Routing Rules</h1>
              <p className="text-sm text-muted-foreground">
                Define which channels and recipients receive messages for each event
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Rule
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create Routing Rule</DialogTitle>
                  <DialogDescription>
                    Define how messages are routed for specific events.
                  </DialogDescription>
                </DialogHeader>
                <RuleForm />
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateRule}>Create Rule</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {rulesByEvent.map(({ event, rules: eventRules }) => (
            <Card key={event.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {event.name}
                  <Badge variant="outline" className="capitalize font-normal">
                    {event.category}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Priority</TableHead>
                      <TableHead>Channel</TableHead>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Escalation</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {eventRules
                      .sort((a, b) => a.priority - b.priority)
                      .map((rule) => (
                        <TableRow key={rule.id}>
                          <TableCell>
                            <Badge variant="outline">{rule.priority}</Badge>
                          </TableCell>
                          <TableCell>
                            <ChannelBadge channel={getChannelType(rule.channelId)} />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {rule.recipientType === "customer" ? (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                  Customer
                                </Badge>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                    <Users className="mr-1 h-3 w-3" />
                                    Staff
                                  </Badge>
                                  {rule.staffRoleIds.length > 0 && (
                                    <span className="text-xs text-muted-foreground">
                                      ({getRoleNames(rule.staffRoleIds)})
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {rule.waitDaysBeforeEscalation > 0 && rule.escalationChannelId ? (
                              <div className="flex items-center gap-2 text-sm">
                                <Timer className="h-4 w-4 text-muted-foreground" />
                                <span>{rule.waitDaysBeforeEscalation}d</span>
                                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                <ChannelBadge channel={getChannelType(rule.escalationChannelId)} />
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">None</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={rule.isActive}
                              onCheckedChange={(checked) => handleToggleActive(rule.id, checked)}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Dialog
                                open={editingRule?.id === rule.id}
                                onOpenChange={(open) => !open && setEditingRule(null)}
                              >
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(rule)}>
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px]">
                                  <DialogHeader>
                                    <DialogTitle>Edit Routing Rule</DialogTitle>
                                    <DialogDescription>
                                      Modify the routing configuration.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <RuleForm />
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setEditingRule(null)}>
                                      Cancel
                                    </Button>
                                    <Button onClick={handleUpdateRule}>Save Changes</Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeleteRule(rule.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}

          {/* Escalation Rules Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Escalation Chain Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {escalationRules.map((rule) => (
                  <div key={rule.id} className="flex items-center gap-4 rounded-lg border border-border p-4">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{getEventName(rule.eventId)}</p>
                      <div className="mt-2 flex items-center gap-2 text-sm">
                        <ChannelBadge channel={getChannelType(rule.fromChannelId)} />
                        <Timer className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{rule.waitDays} days</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <ChannelBadge channel={getChannelType(rule.toChannelId)} />
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-muted-foreground">Max {rule.maxAttempts} attempts</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
