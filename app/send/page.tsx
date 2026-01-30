"use client"

import React from "react"

import { useState, useMemo, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { AppSidebar } from "@/components/messaging/app-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Search,
  Send,
  Mail,
  Phone,
  MessageSquare,
  Users,
  CheckCircle2,
  FileText,
  User,
  Building2,
  ChevronsUpDown,
  Check,
  Eye,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { messagingStore } from "@/lib/messaging/store"
import type { Application, MessageTemplate, ChannelType } from "@/lib/messaging/types"

const channelIcons: Record<ChannelType, React.ReactNode> = {
  email: <Mail className="h-4 w-4" />,
  sms: <Phone className="h-4 w-4" />,
  whatsapp: <MessageSquare className="h-4 w-4" />,
  teams: <Users className="h-4 w-4" />,
}

const channelLabels: Record<ChannelType, string> = {
  email: "Email",
  sms: "SMS",
  whatsapp: "WhatsApp",
  teams: "Microsoft Teams",
}

function SendMessageContent() {
  const searchParams = useSearchParams()
  const applicationIdFromUrl = searchParams.get("application")

  const applications = messagingStore.getApplications()
  const channels = messagingStore.getChannels()
  const templates = messagingStore.getTemplates()
  const events = messagingStore.getEvents()
  const staffMembers = messagingStore.getStaff()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(() => {
    if (applicationIdFromUrl) {
      return applications.find((app) => app.id === applicationIdFromUrl) || null
    }
    return null
  })
  const [selectedChannel, setSelectedChannel] = useState<ChannelType | "">("")
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null)
  const [recipientType, setRecipientType] = useState<"customer" | "staff">("customer")
  const [selectedStaffId, setSelectedStaffId] = useState<string>("")
  const [messageContent, setMessageContent] = useState("")
  const [messageSubject, setMessageSubject] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [applicationOpen, setApplicationOpen] = useState(false)

  // Filter applications based on search
  const filteredApplications = useMemo(() => {
    if (!searchQuery) return applications
    const query = searchQuery.toLowerCase()
    return applications.filter(
      (app) =>
        app.applicantName.toLowerCase().includes(query) ||
        app.applicantEmail.toLowerCase().includes(query) ||
        app.id.toLowerCase().includes(query) ||
        app.companyName?.toLowerCase().includes(query)
    )
  }, [applications, searchQuery])

  // Filter templates based on selected channel
  const filteredTemplates = useMemo(() => {
    if (!selectedChannel) return []
    return templates.filter((t) => t.channelId === selectedChannel)
  }, [templates, selectedChannel])

  // Replace template variables with actual values
  const processTemplate = (content: string, subject?: string) => {
    if (!selectedApplication) return { content, subject }
    
    const replacements: Record<string, string> = {
      "{{applicant_name}}": selectedApplication.applicantName,
      "{{application_id}}": selectedApplication.id,
      "{{company_name}}": selectedApplication.companyName || "N/A",
      "{{status}}": selectedApplication.status,
      "{{current_stage}}": selectedApplication.currentStage,
      "{{deadline}}": new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      "{{support_email}}": "support@company.com",
      "{{support_phone}}": "0800 123 4567",
    }

    let processedContent = content
    let processedSubject = subject || ""

    for (const [key, value] of Object.entries(replacements)) {
      processedContent = processedContent.replace(new RegExp(key, "g"), value)
      processedSubject = processedSubject.replace(new RegExp(key, "g"), value)
    }

    return { content: processedContent, subject: processedSubject }
  }

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    if (template) {
      setSelectedTemplate(template)
      const { content, subject } = processTemplate(template.content, template.subject)
      setMessageContent(content)
      setMessageSubject(subject)
    }
  }

  const handleSendMessage = () => {
    if (!selectedApplication || !selectedChannel || !messageContent) return

    // Create message log entry
    const recipient = recipientType === "customer" 
      ? selectedApplication.applicantEmail 
      : staffMembers.find(s => s.id === selectedStaffId)?.email || ""

    messagingStore.addMessageLog({
      applicationId: selectedApplication.id,
      eventId: selectedTemplate?.eventId || "manual",
      channelId: selectedChannel,
      recipientType,
      recipientId: recipientType === "customer" ? selectedApplication.id : selectedStaffId,
      content: messageContent,
      status: "sent",
      sentAt: new Date().toISOString(),
    })

    setShowSuccess(true)
    
    // Reset form after delay
    setTimeout(() => {
      setShowSuccess(false)
      setSelectedApplication(null)
      setSelectedChannel("")
      setSelectedTemplate(null)
      setMessageContent("")
      setMessageSubject("")
      setSelectedStaffId("")
    }, 2000)
  }

  const getEventName = (eventId: string) => {
    return events.find((e) => e.id === eventId)?.name || "Manual Message"
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <div className="border-b border-border bg-card px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#D71C2B]">
              <Send className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Send Message</h1>
              <p className="text-sm text-muted-foreground">
                Send ad-hoc messages to customers or internal staff
              </p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="mx-auto max-w-4xl space-y-6">
            {/* Step 1: Select Application */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    1
                  </div>
                  <CardTitle className="text-lg">Select Application</CardTitle>
                </div>
                <CardDescription>
                  Search and select an application to send a message
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Popover open={applicationOpen} onOpenChange={setApplicationOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={applicationOpen}
                      className="w-full justify-between h-auto py-3 bg-transparent"
                    >
                      {selectedApplication ? (
                        <div className="flex items-center gap-3 text-left">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{selectedApplication.applicantName}</p>
                            <p className="text-sm text-muted-foreground">
                              {selectedApplication.id} • {selectedApplication.companyName}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Search for an application...</span>
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[500px] p-0" align="start">
                    <Command>
                      <CommandInput 
                        placeholder="Search by name, email, or application ID..." 
                        value={searchQuery}
                        onValueChange={setSearchQuery}
                      />
                      <CommandList>
                        <CommandEmpty>No applications found.</CommandEmpty>
                        <CommandGroup>
                          {filteredApplications.map((app) => (
                            <CommandItem
                              key={app.id}
                              value={`${app.id} ${app.applicantName} ${app.applicantEmail}`}
                              onSelect={() => {
                                setSelectedApplication(app)
                                setApplicationOpen(false)
                                // Re-process template if one is selected
                                if (selectedTemplate) {
                                  const { content, subject } = processTemplate(
                                    selectedTemplate.content,
                                    selectedTemplate.subject
                                  )
                                  setMessageContent(content)
                                  setMessageSubject(subject)
                                }
                              }}
                              className="py-3"
                            >
                              <div className="flex items-center gap-3 w-full">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                  <User className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium truncate">{app.applicantName}</p>
                                    <Badge variant="outline" className="text-xs">
                                      {app.status}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground truncate">
                                    {app.applicantEmail}
                                  </p>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Building2 className="h-3 w-3" />
                                    <span>{app.companyName}</span>
                                    <span>•</span>
                                    <span>{app.id}</span>
                                  </div>
                                </div>
                                {selectedApplication?.id === app.id && (
                                  <Check className="h-4 w-4 text-primary" />
                                )}
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {selectedApplication && (
                  <div className="mt-4 rounded-lg border border-border bg-muted/50 p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Current Stage:</span>
                        <p className="font-medium">{selectedApplication.currentStage}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <p className="font-medium">{selectedApplication.status}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Email:</span>
                        <p className="font-medium">{selectedApplication.applicantEmail}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Phone:</span>
                        <p className="font-medium">{selectedApplication.applicantPhone || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Step 2: Select Recipient & Channel */}
            <Card className={cn(!selectedApplication && "opacity-50 pointer-events-none")}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    2
                  </div>
                  <CardTitle className="text-lg">Recipient & Channel</CardTitle>
                </div>
                <CardDescription>
                  Choose who to send the message to and via which channel
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Recipient Type</Label>
                    <Select value={recipientType} onValueChange={(v) => setRecipientType(v as "customer" | "staff")}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Customer / Applicant
                          </div>
                        </SelectItem>
                        <SelectItem value="staff">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Internal Staff
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {recipientType === "staff" && (
                    <div className="space-y-2">
                      <Label>Select Staff Member</Label>
                      <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose staff member..." />
                        </SelectTrigger>
                        <SelectContent>
                          {staffMembers.map((staff) => (
                            <SelectItem key={staff.id} value={staff.id}>
                              {staff.name} - {staff.role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Channel</Label>
                  <div className="grid grid-cols-4 gap-3">
                    {channels.filter(c => c.isActive).map((channel) => (
                      <button
                        key={channel.id}
                        type="button"
                        onClick={() => {
                          setSelectedChannel(channel.id as ChannelType)
                          setSelectedTemplate(null)
                          setMessageContent("")
                          setMessageSubject("")
                        }}
                        className={cn(
                          "flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all",
                          selectedChannel === channel.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <div className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full",
                          selectedChannel === channel.id ? "bg-primary text-white" : "bg-muted"
                        )}>
                          {channelIcons[channel.id as ChannelType]}
                        </div>
                        <span className="text-sm font-medium">
                          {channelLabels[channel.id as ChannelType]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 3: Compose Message */}
            <Card className={cn((!selectedApplication || !selectedChannel) && "opacity-50 pointer-events-none")}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    3
                  </div>
                  <CardTitle className="text-lg">Compose Message</CardTitle>
                </div>
                <CardDescription>
                  Select a template or write a custom message
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Message Template (Optional)</Label>
                  <Select 
                    value={selectedTemplate?.id || ""} 
                    onValueChange={handleTemplateSelect}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a template..." />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredTemplates.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                          No templates available for this channel
                        </div>
                      ) : (
                        filteredTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              <span>{template.name}</span>
                              <Badge variant="secondary" className="text-xs">
                                {getEventName(template.eventId)}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {(selectedChannel === "email" || selectedChannel === "teams") && (
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={messageSubject}
                      onChange={(e) => setMessageSubject(e.target.value)}
                      placeholder="Enter message subject..."
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="content">Message Content</Label>
                  <Textarea
                    id="content"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="Enter your message..."
                    rows={6}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Available variables: {"{{applicant_name}}"}, {"{{application_id}}"}, {"{{company_name}}"}, {"{{status}}"}, {"{{current_stage}}"}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowPreview(true)}
                    disabled={!messageContent}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Preview Message
                  </Button>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageContent || (recipientType === "staff" && !selectedStaffId)}
                    className="bg-[#D71C2B] hover:bg-[#EE2033]"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Message Preview</DialogTitle>
            <DialogDescription>
              Preview how the message will appear to the recipient
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                {selectedChannel && channelIcons[selectedChannel as ChannelType]}
                <span>{selectedChannel && channelLabels[selectedChannel as ChannelType]}</span>
                <span>•</span>
                <span>
                  To: {recipientType === "customer" 
                    ? selectedApplication?.applicantName 
                    : staffMembers.find(s => s.id === selectedStaffId)?.name}
                </span>
              </div>
              {messageSubject && (
                <div className="mb-2">
                  <span className="text-sm font-medium">Subject: </span>
                  <span className="text-sm">{messageSubject}</span>
                </div>
              )}
              <div className="whitespace-pre-wrap text-sm">{messageContent}</div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close
            </Button>
            <Button 
              onClick={() => {
                setShowPreview(false)
                handleSendMessage()
              }}
              className="bg-[#D71C2B] hover:bg-[#EE2033]"
            >
              <Send className="mr-2 h-4 w-4" />
              Send Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="max-w-sm text-center">
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <DialogTitle className="text-xl">Message Sent!</DialogTitle>
              <DialogDescription className="mt-2">
                Your message has been successfully sent and logged.
              </DialogDescription>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function SendMessagePage() {
  return (
    <Suspense fallback={null}>
      <SendMessageContent />
    </Suspense>
  )
}
