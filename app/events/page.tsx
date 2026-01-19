"use client"

import { useState, Suspense } from "react"
import { AppSidebar } from "@/components/messaging/app-sidebar"
import { SeverityBadge } from "@/components/messaging/status-badge"
import { messagingStore } from "@/lib/messaging/store"
import type { OnboardingEvent, EventCategory, EventSeverity } from "@/lib/messaging/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Plus, Pencil, Trash2, Search } from "lucide-react"

const categories: EventCategory[] = ["application", "document", "verification", "approval", "completion", "reminder"]
const severities: EventSeverity[] = ["low", "medium", "high", "critical"]

function EventsContent() {
  const [events, setEvents] = useState(messagingStore.getEvents())
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<OnboardingEvent | null>(null)

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    category: "application" as EventCategory,
    severity: "medium" as EventSeverity,
    requiresResponse: false,
    isActive: true,
  })

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.code.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || event.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleCreateEvent = () => {
    const newEvent: OnboardingEvent = {
      id: `evt_${Date.now()}`,
      ...formData,
      createdAt: new Date().toISOString(),
    }
    messagingStore.createEvent(newEvent)
    setEvents(messagingStore.getEvents())
    setIsCreateDialogOpen(false)
    resetForm()
  }

  const handleUpdateEvent = () => {
    if (!editingEvent) return
    messagingStore.updateEvent(editingEvent.id, formData)
    setEvents(messagingStore.getEvents())
    setEditingEvent(null)
    resetForm()
  }

  const handleDeleteEvent = (id: string) => {
    messagingStore.deleteEvent(id)
    setEvents(messagingStore.getEvents())
  }

  const handleToggleActive = (id: string, isActive: boolean) => {
    messagingStore.updateEvent(id, { isActive })
    setEvents(messagingStore.getEvents())
  }

  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      description: "",
      category: "application",
      severity: "medium",
      requiresResponse: false,
      isActive: true,
    })
  }

  const openEditDialog = (event: OnboardingEvent) => {
    setEditingEvent(event)
    setFormData({
      code: event.code,
      name: event.name,
      description: event.description,
      category: event.category,
      severity: event.severity,
      requiresResponse: event.requiresResponse,
      isActive: event.isActive,
    })
  }

  const EventForm = () => (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="code">Event Code</Label>
        <Input
          id="code"
          placeholder="e.g., APPLICATION_SUBMITTED"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="name">Event Name</Label>
        <Input
          id="name"
          placeholder="e.g., Application Submitted"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe when this event is triggered..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label>Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value: EventCategory) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat} className="capitalize">
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Severity</Label>
          <Select
            value={formData.severity}
            onValueChange={(value: EventSeverity) => setFormData({ ...formData, severity: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {severities.map((sev) => (
                <SelectItem key={sev} value={sev} className="capitalize">
                  {sev}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="requiresResponse">Requires Response</Label>
        <Switch
          id="requiresResponse"
          checked={formData.requiresResponse}
          onCheckedChange={(checked) => setFormData({ ...formData, requiresResponse: checked })}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="isActive">Active</Label>
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
        />
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <div className="border-b border-border bg-card px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Onboarding Events</h1>
              <p className="text-sm text-muted-foreground">
                Configure events that trigger messages during onboarding
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Event</DialogTitle>
                  <DialogDescription>
                    Define a new onboarding event that can trigger messages.
                  </DialogDescription>
                </DialogHeader>
                <EventForm />
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateEvent}>Create Event</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="p-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search events..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat} className="capitalize">
                        {cat}
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
                    <TableHead>Event</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Response</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{event.name}</p>
                          <p className="text-xs text-muted-foreground">{event.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="rounded bg-muted px-2 py-1 text-xs">{event.code}</code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {event.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <SeverityBadge severity={event.severity} />
                      </TableCell>
                      <TableCell>
                        {event.requiresResponse ? (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            Required
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-slate-50 text-slate-600">
                            Optional
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={event.isActive}
                          onCheckedChange={(checked) => handleToggleActive(event.id, checked)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Dialog
                            open={editingEvent?.id === event.id}
                            onOpenChange={(open) => !open && setEditingEvent(null)}
                          >
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => openEditDialog(event)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                              <DialogHeader>
                                <DialogTitle>Edit Event</DialogTitle>
                                <DialogDescription>
                                  Modify the event configuration.
                                </DialogDescription>
                              </DialogHeader>
                              <EventForm />
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setEditingEvent(null)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleUpdateEvent}>Save Changes</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteEvent(event.id)}
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
        </div>
      </main>
    </div>
  )
}

export default function EventsPage() {
  return (
    <Suspense fallback={null}>
      <EventsContent />
    </Suspense>
  )
}
