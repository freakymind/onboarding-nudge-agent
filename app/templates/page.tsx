"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { AppSidebar } from "@/components/messaging/app-sidebar"
import { ChannelBadge } from "@/components/messaging/status-badge"
import { messagingStore } from "@/lib/messaging/store"
import type { MessageTemplate, RecipientType } from "@/lib/messaging/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, Search, Eye, Code, Copy, CheckCircle2 } from "lucide-react"
import Loading from "./loading"

export default function TemplatesPage() {
  const searchParams = useSearchParams()
  const [templates, setTemplates] = useState(messagingStore.getTemplates())
  const events = messagingStore.getEvents()
  const channels = messagingStore.getChannels()

  const [searchQuery, setSearchQuery] = useState("")
  const [eventFilter, setEventFilter] = useState<string>("all")
  const [channelFilter, setChannelFilter] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null)
  const [previewTemplate, setPreviewTemplate] = useState<MessageTemplate | null>(null)
  const [copiedVariable, setCopiedVariable] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    eventId: "",
    channelId: "",
    recipientType: "customer" as RecipientType,
    subject: "",
    body: "",
    variables: [] as string[],
    isActive: true,
  })

  const getEventName = (eventId: string) => events.find((e) => e.id === eventId)?.name || eventId
  const getChannelType = (channelId: string) => channels.find((c) => c.id === channelId)?.type || channelId
  const getChannelName = (channelId: string) => channels.find((c) => c.id === channelId)?.name || channelId

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (template.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    const matchesEvent = eventFilter === "all" || template.eventId === eventFilter
    const matchesChannel = channelFilter === "all" || template.channelId === channelFilter
    return matchesSearch && matchesEvent && matchesChannel
  })

  const handleCreateTemplate = () => {
    const newTemplate: MessageTemplate = {
      id: `tpl_${Date.now()}`,
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    messagingStore.createTemplate(newTemplate)
    setTemplates(messagingStore.getTemplates())
    setIsCreateDialogOpen(false)
    resetForm()
  }

  const handleUpdateTemplate = () => {
    if (!editingTemplate) return
    messagingStore.updateTemplate(editingTemplate.id, formData)
    setTemplates(messagingStore.getTemplates())
    setEditingTemplate(null)
    resetForm()
  }

  const handleDeleteTemplate = (id: string) => {
    messagingStore.deleteTemplate(id)
    setTemplates(messagingStore.getTemplates())
  }

  const handleToggleActive = (id: string, isActive: boolean) => {
    messagingStore.updateTemplate(id, { isActive })
    setTemplates(messagingStore.getTemplates())
  }

  const resetForm = () => {
    setFormData({
      eventId: "",
      channelId: "",
      recipientType: "customer",
      subject: "",
      body: "",
      variables: [],
      isActive: true,
    })
  }

  const openEditDialog = (template: MessageTemplate) => {
    setEditingTemplate(template)
    setFormData({
      eventId: template.eventId,
      channelId: template.channelId,
      recipientType: template.recipientType,
      subject: template.subject || "",
      body: template.body,
      variables: template.variables,
      isActive: template.isActive,
    })
  }

  // Extract variables from template body
  const extractVariables = (text: string): string[] => {
    const matches = text.match(/\{\{([^}]+)\}\}/g)
    if (!matches) return []
    return [...new Set(matches.map((m) => m.replace(/\{\{|\}\}/g, "").trim()))]
  }

  const handleBodyChange = (body: string) => {
    const variables = extractVariables(body + (formData.subject || ""))
    setFormData({ ...formData, body, variables })
  }

  const handleSubjectChange = (subject: string) => {
    const variables = extractVariables(formData.body + subject)
    setFormData({ ...formData, subject, variables })
  }

  const copyVariable = (variable: string) => {
    navigator.clipboard.writeText(`{{${variable}}}`)
    setCopiedVariable(variable)
    setTimeout(() => setCopiedVariable(null), 2000)
  }

  // Sample data for preview
  const sampleData: Record<string, string> = {
    applicant_name: "John Smith",
    application_id: "APP-123456",
    application_type: "Premium Account",
    submitted_date: "January 15, 2024",
    deadline: "January 22, 2024",
    current_status: "Documents Pending",
    days_inactive: "3",
    days_stalled: "7",
    required_action: "upload the requested documents",
    document_list: "- ID Proof\n- Address Proof\n- Income Statement",
    approval_details: "Your Premium Account has been activated.",
    next_steps: "1. Set up your profile\n2. Complete verification\n3. Make your first transaction",
    assigned_staff: "Sarah Johnson",
    escalation_attempt: "2",
  }

  const renderPreview = (template: MessageTemplate) => {
    let previewBody = template.body
    let previewSubject = template.subject || ""

    template.variables.forEach((variable) => {
      const value = sampleData[variable] || `[${variable}]`
      previewBody = previewBody.replace(new RegExp(`\\{\\{${variable}\\}\\}`, "g"), value)
      previewSubject = previewSubject.replace(new RegExp(`\\{\\{${variable}\\}\\}`, "g"), value)
    })

    return { subject: previewSubject, body: previewBody }
  }

  const TemplateForm = () => {
    const selectedChannel = channels.find((c) => c.id === formData.channelId)
    const showSubject = selectedChannel?.type === "email"

    return (
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
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
        </div>
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
        {showSubject && (
          <div className="grid gap-2">
            <Label>Subject Line</Label>
            <Input
              placeholder="e.g., Your Application {{application_id}} Status Update"
              value={formData.subject}
              onChange={(e) => handleSubjectChange(e.target.value)}
            />
          </div>
        )}
        <div className="grid gap-2">
          <Label>Message Body</Label>
          <Textarea
            placeholder="Write your message template here. Use {{variable_name}} for dynamic content."
            className="min-h-[200px] font-mono text-sm"
            value={formData.body}
            onChange={(e) => handleBodyChange(e.target.value)}
          />
        </div>
        {formData.variables.length > 0 && (
          <div className="rounded-lg border border-border bg-muted/50 p-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Detected Variables:</p>
            <div className="flex flex-wrap gap-2">
              {formData.variables.map((variable) => (
                <Badge
                  key={variable}
                  variant="outline"
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => copyVariable(variable)}
                >
                  <Code className="mr-1 h-3 w-3" />
                  {variable}
                  {copiedVariable === variable ? (
                    <CheckCircle2 className="ml-1 h-3 w-3 text-green-600" />
                  ) : (
                    <Copy className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>
        )}
        <div className="flex items-center justify-between">
          <Label>Active</Label>
          <Switch
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
          />
        </div>
      </div>
    )
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="flex min-h-screen bg-background">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="border-b border-border bg-card px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Message Templates</h1>
                <p className="text-sm text-muted-foreground">
                  Manage templates for each event and channel combination
                </p>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Template
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Create Message Template</DialogTitle>
                    <DialogDescription>
                      Create a new message template with dynamic variables.
                    </DialogDescription>
                  </DialogHeader>
                  <TemplateForm />
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateTemplate}>Create Template</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="p-8">
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search templates..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={eventFilter} onValueChange={setEventFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by event" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Events</SelectItem>
                      {events.map((event) => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={channelFilter} onValueChange={setChannelFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by channel" />
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
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredTemplates.map((template) => (
                    <Card key={template.id} className={!template.isActive ? "opacity-60" : ""}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">{getEventName(template.eventId)}</CardTitle>
                            <div className="mt-2 flex items-center gap-2">
                              <ChannelBadge channel={getChannelType(template.channelId)} />
                              <Badge
                                variant="outline"
                                className={
                                  template.recipientType === "customer"
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : "bg-purple-50 text-purple-700 border-purple-200"
                                }
                              >
                                {template.recipientType === "customer" ? "Customer" : "Staff"}
                              </Badge>
                            </div>
                          </div>
                          <Switch
                            checked={template.isActive}
                            onCheckedChange={(checked) => handleToggleActive(template.id, checked)}
                          />
                        </div>
                      </CardHeader>
                      <CardContent>
                        {template.subject && (
                          <div className="mb-2">
                            <p className="text-xs font-medium text-muted-foreground">Subject</p>
                            <p className="text-sm">{template.subject}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Body</p>
                          <p className="line-clamp-3 text-sm text-foreground">{template.body}</p>
                        </div>
                        {template.variables.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {template.variables.slice(0, 4).map((v) => (
                              <Badge key={v} variant="outline" className="text-xs">
                                {v}
                              </Badge>
                            ))}
                            {template.variables.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{template.variables.length - 4} more
                              </Badge>
                            )}
                          </div>
                        )}
                        <div className="mt-4 flex items-center gap-2">
                          <Dialog
                            open={previewTemplate?.id === template.id}
                            onOpenChange={(open) => !open && setPreviewTemplate(null)}
                          >
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setPreviewTemplate(template)}>
                                <Eye className="mr-2 h-3 w-3" />
                                Preview
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                              <DialogHeader>
                                <DialogTitle>Template Preview</DialogTitle>
                                <DialogDescription>
                                  Preview with sample data
                                </DialogDescription>
                              </DialogHeader>
                              <Tabs defaultValue="preview" className="mt-4">
                                <TabsList>
                                  <TabsTrigger value="preview">Preview</TabsTrigger>
                                  <TabsTrigger value="raw">Raw Template</TabsTrigger>
                                </TabsList>
                                <TabsContent value="preview" className="mt-4">
                                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                                    {renderPreview(template).subject && (
                                      <div className="mb-4 border-b border-border pb-4">
                                        <p className="text-xs font-medium text-muted-foreground">Subject</p>
                                        <p className="font-medium">{renderPreview(template).subject}</p>
                                      </div>
                                    )}
                                    <div className="whitespace-pre-wrap text-sm">{renderPreview(template).body}</div>
                                  </div>
                                </TabsContent>
                                <TabsContent value="raw" className="mt-4">
                                  <div className="rounded-lg border border-border bg-muted/30 p-4 font-mono text-sm">
                                    {template.subject && (
                                      <div className="mb-4 border-b border-border pb-4">
                                        <p className="text-xs font-medium text-muted-foreground">Subject</p>
                                        <p>{template.subject}</p>
                                      </div>
                                    )}
                                    <div className="whitespace-pre-wrap">{template.body}</div>
                                  </div>
                                </TabsContent>
                              </Tabs>
                            </DialogContent>
                          </Dialog>
                          <Dialog
                            open={editingTemplate?.id === template.id}
                            onOpenChange={(open) => !open && setEditingTemplate(null)}
                          >
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => openEditDialog(template)}>
                                <Pencil className="mr-2 h-3 w-3" />
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                              <DialogHeader>
                                <DialogTitle>Edit Template</DialogTitle>
                                <DialogDescription>
                                  Modify the message template.
                                </DialogDescription>
                              </DialogHeader>
                              <TemplateForm />
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setEditingTemplate(null)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleUpdateTemplate}>Save Changes</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteTemplate(template.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </Suspense>
  )
}
