"use client"

import React from "react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

import { useState } from "react"
import { AppSidebar } from "@/components/messaging/app-sidebar"
import { ChannelBadge } from "@/components/messaging/status-badge"
import { messagingStore } from "@/lib/messaging/store"
import type { StaffMember, StaffRole, ChannelType } from "@/lib/messaging/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, Search, Users, Shield, Bell, Mail, MessageSquare, Phone } from "lucide-react"

const channelOptions: { type: ChannelType; label: string; icon: React.ReactNode }[] = [
  { type: "email", label: "Email", icon: <Mail className="h-4 w-4" /> },
  { type: "sms", label: "SMS", icon: <MessageSquare className="h-4 w-4" /> },
  { type: "whatsapp", label: "WhatsApp", icon: <Phone className="h-4 w-4" /> },
  { type: "teams", label: "Teams", icon: <Users className="h-4 w-4" /> },
]

const Loading = () => null

export default function StaffPage() {
  const searchParams = useSearchParams()
  const [staff, setStaff] = useState(messagingStore.getStaff())
  const [roles, setRoles] = useState(messagingStore.getRoles())
  const events = messagingStore.getEvents()
  const roleNotificationConfig = messagingStore.getRoleNotificationConfig()

  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateStaffDialogOpen, setIsCreateStaffDialogOpen] = useState(false)
  const [isCreateRoleDialogOpen, setIsCreateRoleDialogOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null)
  const [editingRole, setEditingRole] = useState<StaffRole | null>(null)

  const [staffFormData, setStaffFormData] = useState({
    name: "",
    email: "",
    phone: "",
    roleIds: [] as string[],
    contactPreferences: [] as ChannelType[],
    isActive: true,
  })

  const [roleFormData, setRoleFormData] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
    isActive: true,
  })

  const availablePermissions = [
    "view_applications",
    "update_status",
    "request_documents",
    "approve_applications",
    "reject_applications",
    "manage_staff",
    "contact_customer",
    "compliance_review",
    "view_analytics",
    "manage_templates",
  ]

  const getRoleNames = (roleIds: string[]) =>
    roleIds.map((id) => roles.find((r) => r.id === id)?.name || id)

  const filteredStaff = staff.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Staff CRUD
  const handleCreateStaff = () => {
    const newStaff: StaffMember = {
      id: `staff_${Date.now()}`,
      ...staffFormData,
    }
    messagingStore.createStaffMember(newStaff)
    setStaff(messagingStore.getStaff())
    setIsCreateStaffDialogOpen(false)
    resetStaffForm()
  }

  const handleUpdateStaff = () => {
    if (!editingStaff) return
    messagingStore.updateStaffMember(editingStaff.id, staffFormData)
    setStaff(messagingStore.getStaff())
    setEditingStaff(null)
    resetStaffForm()
  }

  const handleToggleStaffActive = (id: string, isActive: boolean) => {
    messagingStore.updateStaffMember(id, { isActive })
    setStaff(messagingStore.getStaff())
  }

  const resetStaffForm = () => {
    setStaffFormData({
      name: "",
      email: "",
      phone: "",
      roleIds: [],
      contactPreferences: [],
      isActive: true,
    })
  }

  const openEditStaffDialog = (member: StaffMember) => {
    setEditingStaff(member)
    setStaffFormData({
      name: member.name,
      email: member.email,
      phone: member.phone || "",
      roleIds: member.roleIds,
      contactPreferences: member.contactPreferences,
      isActive: member.isActive,
    })
  }

  // Role CRUD
  const handleCreateRole = () => {
    const newRole: StaffRole = {
      id: `role_${Date.now()}`,
      ...roleFormData,
    }
    messagingStore.createRole(newRole)
    setRoles(messagingStore.getRoles())
    setIsCreateRoleDialogOpen(false)
    resetRoleForm()
  }

  const handleUpdateRole = () => {
    if (!editingRole) return
    messagingStore.updateRole(editingRole.id, roleFormData)
    setRoles(messagingStore.getRoles())
    setEditingRole(null)
    resetRoleForm()
  }

  const resetRoleForm = () => {
    setRoleFormData({
      name: "",
      description: "",
      permissions: [],
      isActive: true,
    })
  }

  const openEditRoleDialog = (role: StaffRole) => {
    setEditingRole(role)
    setRoleFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
      isActive: role.isActive,
    })
  }

  // Notification config
  const isNotificationEnabled = (roleId: string, eventId: string) => {
    return roleNotificationConfig.find((c) => c.roleId === roleId && c.eventId === eventId)?.isEnabled ?? false
  }

  const toggleNotification = (roleId: string, eventId: string) => {
    const current = isNotificationEnabled(roleId, eventId)
    messagingStore.updateRoleNotificationConfig(roleId, eventId, !current)
  }

  const StaffForm = () => (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label>Full Name</Label>
        <Input
          placeholder="e.g., John Smith"
          value={staffFormData.name}
          onChange={(e) => setStaffFormData({ ...staffFormData, name: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label>Email</Label>
          <Input
            type="email"
            placeholder="john@company.com"
            value={staffFormData.email}
            onChange={(e) => setStaffFormData({ ...staffFormData, email: e.target.value })}
          />
        </div>
        <div className="grid gap-2">
          <Label>Phone</Label>
          <Input
            placeholder="+1234567890"
            value={staffFormData.phone}
            onChange={(e) => setStaffFormData({ ...staffFormData, phone: e.target.value })}
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label>Roles</Label>
        <div className="grid grid-cols-2 gap-2">
          {roles.map((role) => (
            <div key={role.id} className="flex items-center space-x-2">
              <Checkbox
                id={`role-${role.id}`}
                checked={staffFormData.roleIds.includes(role.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setStaffFormData({
                      ...staffFormData,
                      roleIds: [...staffFormData.roleIds, role.id],
                    })
                  } else {
                    setStaffFormData({
                      ...staffFormData,
                      roleIds: staffFormData.roleIds.filter((id) => id !== role.id),
                    })
                  }
                }}
              />
              <label htmlFor={`role-${role.id}`} className="text-sm">
                {role.name}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-2">
        <Label>Contact Preferences</Label>
        <div className="flex flex-wrap gap-2">
          {channelOptions.map((channel) => (
            <div key={channel.type} className="flex items-center space-x-2">
              <Checkbox
                id={`channel-${channel.type}`}
                checked={staffFormData.contactPreferences.includes(channel.type)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setStaffFormData({
                      ...staffFormData,
                      contactPreferences: [...staffFormData.contactPreferences, channel.type],
                    })
                  } else {
                    setStaffFormData({
                      ...staffFormData,
                      contactPreferences: staffFormData.contactPreferences.filter((t) => t !== channel.type),
                    })
                  }
                }}
              />
              <label htmlFor={`channel-${channel.type}`} className="flex items-center gap-1 text-sm">
                {channel.icon}
                {channel.label}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Label>Active</Label>
        <Switch
          checked={staffFormData.isActive}
          onCheckedChange={(checked) => setStaffFormData({ ...staffFormData, isActive: checked })}
        />
      </div>
    </div>
  )

  const RoleForm = () => (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label>Role Name</Label>
        <Input
          placeholder="e.g., Application Reviewer"
          value={roleFormData.name}
          onChange={(e) => setRoleFormData({ ...roleFormData, name: e.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <Label>Description</Label>
        <Input
          placeholder="Describe the role responsibilities..."
          value={roleFormData.description}
          onChange={(e) => setRoleFormData({ ...roleFormData, description: e.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <Label>Permissions</Label>
        <div className="grid grid-cols-2 gap-2 rounded-lg border border-border p-3">
          {availablePermissions.map((permission) => (
            <div key={permission} className="flex items-center space-x-2">
              <Checkbox
                id={`perm-${permission}`}
                checked={roleFormData.permissions.includes(permission)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setRoleFormData({
                      ...roleFormData,
                      permissions: [...roleFormData.permissions, permission],
                    })
                  } else {
                    setRoleFormData({
                      ...roleFormData,
                      permissions: roleFormData.permissions.filter((p) => p !== permission),
                    })
                  }
                }}
              />
              <label htmlFor={`perm-${permission}`} className="text-sm capitalize">
                {permission.replace(/_/g, " ")}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Label>Active</Label>
        <Switch
          checked={roleFormData.isActive}
          onCheckedChange={(checked) => setRoleFormData({ ...roleFormData, isActive: checked })}
        />
      </div>
    </div>
  )

  return (
    <Suspense fallback={<Loading />}>
      <div className="flex min-h-screen bg-background">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="border-b border-border bg-card px-8 py-6">
            <h1 className="text-2xl font-bold text-foreground">Staff & Roles Management</h1>
            <p className="text-sm text-muted-foreground">
              Manage staff members, roles, and notification preferences
            </p>
          </div>

          <div className="p-8">
            <Tabs defaultValue="staff">
              <TabsList>
                <TabsTrigger value="staff" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Staff Members
                </TabsTrigger>
                <TabsTrigger value="roles" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Roles
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notification Config
                </TabsTrigger>
              </TabsList>

              <TabsContent value="staff" className="mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Search staff..."
                          className="pl-10"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <Dialog open={isCreateStaffDialogOpen} onOpenChange={setIsCreateStaffDialogOpen}>
                        <DialogTrigger asChild>
                          <Button onClick={resetStaffForm}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Staff
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Add Staff Member</DialogTitle>
                            <DialogDescription>
                              Add a new staff member to the system.
                            </DialogDescription>
                          </DialogHeader>
                          <StaffForm />
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateStaffDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleCreateStaff}>Add Staff</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Roles</TableHead>
                          <TableHead>Contact Preferences</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStaff.map((member) => (
                          <TableRow key={member.id} className={!member.isActive ? "opacity-60" : ""}>
                            <TableCell className="font-medium">{member.name}</TableCell>
                            <TableCell>{member.email}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {getRoleNames(member.roleIds).map((name) => (
                                  <Badge key={name} variant="outline">
                                    {name}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {member.contactPreferences.map((channel) => (
                                  <ChannelBadge key={channel} channel={channel} />
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Switch
                                checked={member.isActive}
                                onCheckedChange={(checked) => handleToggleStaffActive(member.id, checked)}
                              />
                            </TableCell>
                            <TableCell className="text-right">
                              <Dialog
                                open={editingStaff?.id === member.id}
                                onOpenChange={(open) => !open && setEditingStaff(null)}
                              >
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={() => openEditStaffDialog(member)}>
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px]">
                                  <DialogHeader>
                                    <DialogTitle>Edit Staff Member</DialogTitle>
                                    <DialogDescription>
                                      Update staff member details.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <StaffForm />
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setEditingStaff(null)}>
                                      Cancel
                                    </Button>
                                    <Button onClick={handleUpdateStaff}>Save Changes</Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="roles" className="mt-6">
                <div className="flex justify-end mb-4">
                  <Dialog open={isCreateRoleDialogOpen} onOpenChange={setIsCreateRoleDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={resetRoleForm}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Role
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Create Role</DialogTitle>
                        <DialogDescription>
                          Define a new role with specific permissions.
                        </DialogDescription>
                      </DialogHeader>
                      <RoleForm />
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateRoleDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateRole}>Create Role</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {roles.map((role) => (
                    <Card key={role.id} className={!role.isActive ? "opacity-60" : ""}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              <Shield className="h-5 w-5 text-primary" />
                              {role.name}
                            </CardTitle>
                            <CardDescription>{role.description}</CardDescription>
                          </div>
                          <Dialog
                            open={editingRole?.id === role.id}
                            onOpenChange={(open) => !open && setEditingRole(null)}
                          >
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => openEditRoleDialog(role)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                              <DialogHeader>
                                <DialogTitle>Edit Role</DialogTitle>
                                <DialogDescription>
                                  Modify role permissions.
                                </DialogDescription>
                              </DialogHeader>
                              <RoleForm />
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setEditingRole(null)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleUpdateRole}>Save Changes</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-2 text-sm font-medium text-muted-foreground">Permissions</p>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.map((perm) => (
                            <Badge key={perm} variant="outline" className="text-xs capitalize">
                              {perm.replace(/_/g, " ")}
                            </Badge>
                          ))}
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {staff.filter((s) => s.roleIds.includes(role.id)).length} members
                          </span>
                          <Badge variant={role.isActive ? "default" : "secondary"}>
                            {role.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="notifications" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Role Notification Configuration</CardTitle>
                    <CardDescription>
                      Configure which events trigger notifications for each role
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="min-w-[200px]">Event</TableHead>
                            {roles.map((role) => (
                              <TableHead key={role.id} className="text-center min-w-[120px]">
                                {role.name}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {events.map((event) => (
                            <TableRow key={event.id}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{event.name}</p>
                                  <p className="text-xs text-muted-foreground capitalize">{event.category}</p>
                                </div>
                              </TableCell>
                              {roles.map((role) => (
                                <TableCell key={role.id} className="text-center">
                                  <Switch
                                    checked={isNotificationEnabled(role.id, event.id)}
                                    onCheckedChange={() => toggleNotification(role.id, event.id)}
                                  />
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </Suspense>
  )
}
