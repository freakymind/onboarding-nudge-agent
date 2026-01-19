"use client";

import React from "react"

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Clock,
  ArrowRight,
  Mail,
  Phone,
  MessageSquare,
  Users,
  Trash2,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { messagingStore } from "@/lib/messaging/store";
import type { EscalationRule } from "@/lib/messaging/types";

const channelIcons: Record<string, React.ReactNode> = {
  email: <Mail className="h-4 w-4" />,
  sms: <Phone className="h-4 w-4" />,
  whatsapp: <MessageSquare className="h-4 w-4" />,
  teams: <Users className="h-4 w-4" />,
};

const channelColors: Record<string, string> = {
  email: "bg-blue-100 text-blue-700 border-blue-200",
  sms: "bg-green-100 text-green-700 border-green-200",
  whatsapp: "bg-emerald-100 text-emerald-700 border-emerald-200",
  teams: "bg-purple-100 text-purple-700 border-purple-200",
};

export default function EscalationPage() {
  const [rules, setRules] = useState<EscalationRule[]>(() => {
    const storedRules = messagingStore.getEscalationRules();
    return storedRules || [];
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const channels = messagingStore.getChannels() || [];
  const events = messagingStore.getEvents() || [];

  const [newRule, setNewRule] = useState<Partial<EscalationRule>>({
    eventId: "",
    fromChannelId: "",
    toChannelId: "",
    waitDays: 3,
    maxAttempts: 2,
    isActive: true,
  });

  const handleSave = () => {
    if (newRule.eventId && newRule.fromChannelId && newRule.toChannelId) {
      const rule: EscalationRule = {
        id: `esc_${Date.now()}`,
        eventId: newRule.eventId,
        fromChannelId: newRule.fromChannelId,
        toChannelId: newRule.toChannelId,
        waitDays: newRule.waitDays || 3,
        maxAttempts: newRule.maxAttempts || 2,
        isActive: newRule.isActive ?? true,
      };
      setRules([...rules, rule]);
      setIsDialogOpen(false);
      setNewRule({
        eventId: "",
        fromChannelId: "",
        toChannelId: "",
        waitDays: 3,
        maxAttempts: 2,
        isActive: true,
      });
    }
  };

  const toggleRuleActive = (ruleId: string) => {
    setRules(
      rules.map((rule) =>
        rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
      )
    );
  };

  const deleteRule = (ruleId: string) => {
    setRules(rules.filter((rule) => rule.id !== ruleId));
  };

  const getChannelName = (channelId: string) => {
    return channels.find((c) => c.id === channelId)?.name || channelId;
  };

  const getChannelType = (channelId: string) => {
    return channels.find((c) => c.id === channelId)?.type || "email";
  };

  const getEventName = (eventId: string) => {
    return events.find((e) => e.id === eventId)?.name || eventId;
  };

  // Group rules by event for better visualization
  const rulesByEvent = rules.reduce(
    (acc, rule) => {
      const eventId = rule.eventId;
      if (!acc[eventId]) {
        acc[eventId] = [];
      }
      acc[eventId].push(rule);
      return acc;
    },
    {} as Record<string, EscalationRule[]>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Escalation Rules
                </h1>
                <p className="text-sm text-gray-500">
                  Configure automatic channel fallback logic
                </p>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Escalation Rule
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create Escalation Rule</DialogTitle>
                  <DialogDescription>
                    Define how messages should escalate from one channel to another
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Trigger Event</Label>
                    <Select
                      value={newRule.eventId}
                      onValueChange={(value) =>
                        setNewRule({ ...newRule, eventId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select event" />
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

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>From Channel</Label>
                      <Select
                        value={newRule.fromChannelId}
                        onValueChange={(value) =>
                          setNewRule({ ...newRule, fromChannelId: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select channel" />
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
                    <div className="space-y-2">
                      <Label>To Channel</Label>
                      <Select
                        value={newRule.toChannelId}
                        onValueChange={(value) =>
                          setNewRule({ ...newRule, toChannelId: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select channel" />
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

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="waitDays">Wait Days Before Escalation</Label>
                      <Input
                        id="waitDays"
                        type="number"
                        min="1"
                        max="30"
                        value={newRule.waitDays}
                        onChange={(e) =>
                          setNewRule({
                            ...newRule,
                            waitDays: Number.parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxAttempts">Max Attempts</Label>
                      <Input
                        id="maxAttempts"
                        type="number"
                        min="1"
                        max="10"
                        value={newRule.maxAttempts}
                        onChange={(e) =>
                          setNewRule({
                            ...newRule,
                            maxAttempts: Number.parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="active">Rule Active</Label>
                    <Switch
                      id="active"
                      checked={newRule.isActive}
                      onCheckedChange={(checked) =>
                        setNewRule({ ...newRule, isActive: checked })
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>Create Rule</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-6 bg-amber-50 border-amber-200">
          <CardContent className="flex items-start gap-4 pt-6">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-900">How Escalation Works</h3>
              <p className="text-sm text-amber-700 mt-1">
                When a message is sent and no response is received within the specified
                wait period, the system automatically tries the next channel. Create
                multiple rules for the same event to build an escalation chain (e.g.,
                Email to SMS to WhatsApp).
              </p>
            </div>
          </CardContent>
        </Card>

        {Object.keys(rulesByEvent).length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Clock className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Escalation Rules
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Create escalation rules to automatically retry messages on different channels
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Rule
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(rulesByEvent).map(([eventId, eventRules]) => (
              <Card key={eventId}>
                <CardHeader>
                  <CardTitle className="text-lg">{getEventName(eventId)}</CardTitle>
                  <CardDescription>
                    {eventRules.length} escalation rule{eventRules.length !== 1 ? "s" : ""} configured
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {eventRules.map((rule) => (
                      <div
                        key={rule.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border"
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <div
                            className={`flex items-center gap-2 px-3 py-2 rounded border ${channelColors[getChannelType(rule.fromChannelId)]}`}
                          >
                            {channelIcons[getChannelType(rule.fromChannelId)]}
                            <span className="font-medium text-sm">
                              {getChannelName(rule.fromChannelId)}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-gray-400">
                            <Clock className="h-3 w-3" />
                            <span className="text-xs">{rule.waitDays}d</span>
                            <ArrowRight className="h-4 w-4" />
                          </div>

                          <div
                            className={`flex items-center gap-2 px-3 py-2 rounded border ${channelColors[getChannelType(rule.toChannelId)]}`}
                          >
                            {channelIcons[getChannelType(rule.toChannelId)]}
                            <span className="font-medium text-sm">
                              {getChannelName(rule.toChannelId)}
                            </span>
                          </div>

                          <Badge variant="outline" className="ml-2">
                            max {rule.maxAttempts} attempts
                          </Badge>

                          {rule.isActive ? (
                            <Badge className="bg-green-100 text-green-700 ml-auto">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="ml-auto">
                              Inactive
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Switch
                            checked={rule.isActive}
                            onCheckedChange={() => toggleRuleActive(rule.id)}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteRule(rule.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
