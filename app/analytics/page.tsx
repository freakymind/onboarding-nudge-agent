"use client";

import React from "react"

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Mail,
  MessageSquare,
  Phone,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  BarChart3,
  PieChart,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { messagingStore } from "@/lib/messaging/store";

const channelIcons: Record<string, React.ReactNode> = {
  email: <Mail className="h-4 w-4" />,
  sms: <Phone className="h-4 w-4" />,
  whatsapp: <MessageSquare className="h-4 w-4" />,
  teams: <Users className="h-4 w-4" />,
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d");
  const logs = messagingStore.getMessageLogs();
  const channels = messagingStore.getChannels();
  const events = messagingStore.getEvents();
  const applications = messagingStore.getApplications();

  // Calculate channel performance metrics
  const channelMetrics = channels.map((channel) => {
    const channelLogs = logs.filter((log) => log.channelId === channel.id);
    const delivered = channelLogs.filter(
      (log) => log.status === "delivered" || log.status === "read"
    ).length;
    const read = channelLogs.filter((log) => log.status === "read").length;
    const failed = channelLogs.filter((log) => log.status === "failed").length;
    const total = channelLogs.length;

    return {
      ...channel,
      total,
      delivered,
      read,
      failed,
      deliveryRate: total > 0 ? Math.round((delivered / total) * 100) : 0,
      readRate: delivered > 0 ? Math.round((read / delivered) * 100) : 0,
      failureRate: total > 0 ? Math.round((failed / total) * 100) : 0,
    };
  });

  // Calculate event metrics
  const eventMetrics = events.map((event) => {
    const eventLogs = logs.filter((log) => log.eventId === event.id);
    const total = eventLogs.length;
    const successful = eventLogs.filter(
      (log) => log.status === "delivered" || log.status === "read"
    ).length;

    return {
      ...event,
      total,
      successful,
      successRate: total > 0 ? Math.round((successful / total) * 100) : 0,
    };
  });

  // Overall stats
  const totalMessages = logs.length;
  const deliveredMessages = logs.filter(
    (log) => log.status === "delivered" || log.status === "read"
  ).length;
  const readMessages = logs.filter((log) => log.status === "read").length;
  const failedMessages = logs.filter((log) => log.status === "failed").length;
  const pendingMessages = logs.filter(
    (log) => log.status === "pending" || log.status === "sent"
  ).length;

  const overallDeliveryRate =
    totalMessages > 0 ? Math.round((deliveredMessages / totalMessages) * 100) : 0;
  const overallReadRate =
    deliveredMessages > 0 ? Math.round((readMessages / deliveredMessages) * 100) : 0;

  // Response time analysis
  const avgResponseTime = "4.2 hours";
  const medianResponseTime = "2.8 hours";

  // Application progress metrics
  const completedApps = applications.filter(
    (app) => app.status === "completed"
  ).length;
  const activeApps = applications.filter(
    (app) => app.status === "in_progress" || app.status === "pending_documents"
  ).length;
  const stuckApps = applications.filter(
    (app) => app.status === "stuck" || app.status === "escalated"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
                  Analytics Dashboard
                </h1>
                <p className="text-sm text-gray-500">
                  Messaging performance and insights
                </p>
              </div>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Messages
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{totalMessages}</div>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span>+12% from last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Delivery Rate
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {overallDeliveryRate}%
              </div>
              <Progress value={overallDeliveryRate} className="h-2 mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Read Rate
              </CardTitle>
              <Mail className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{overallReadRate}%</div>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span>+5% from last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Avg Response Time
              </CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{avgResponseTime}</div>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingDown className="h-3 w-3" />
                <span>-18% faster</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="channels" className="space-y-6">
          <TabsList>
            <TabsTrigger value="channels">Channel Performance</TabsTrigger>
            <TabsTrigger value="events">Event Analytics</TabsTrigger>
            <TabsTrigger value="applications">Application Progress</TabsTrigger>
            <TabsTrigger value="escalations">Escalation Analysis</TabsTrigger>
          </TabsList>

          {/* Channel Performance */}
          <TabsContent value="channels" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {channelMetrics.map((channel) => (
                <Card key={channel.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            channel.isActive ? "bg-green-100" : "bg-gray-100"
                          }`}
                        >
                          {channelIcons[channel.type]}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{channel.name}</CardTitle>
                          <CardDescription>{channel.total} messages sent</CardDescription>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          channel.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {channel.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Delivery Rate</span>
                        <span className="font-medium">{channel.deliveryRate}%</span>
                      </div>
                      <Progress value={channel.deliveryRate} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Read Rate</span>
                        <span className="font-medium">{channel.readRate}%</span>
                      </div>
                      <Progress value={channel.readRate} className="h-2 bg-gray-100" />
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-600">
                          {channel.delivered}
                        </div>
                        <div className="text-xs text-gray-500">Delivered</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-blue-600">
                          {channel.read}
                        </div>
                        <div className="text-xs text-gray-500">Read</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-red-600">
                          {channel.failed}
                        </div>
                        <div className="text-xs text-gray-500">Failed</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Event Analytics */}
          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Trigger Analysis</CardTitle>
                <CardDescription>
                  Message volume and success rate by event type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {eventMetrics
                    .sort((a, b) => b.total - a.total)
                    .map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="font-medium text-gray-900">
                                {event.name}
                              </span>
                              <span
                                className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${
                                  event.category === "application"
                                    ? "bg-blue-100 text-blue-700"
                                    : event.category === "document"
                                      ? "bg-purple-100 text-purple-700"
                                      : event.category === "reminder"
                                        ? "bg-orange-100 text-orange-700"
                                        : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {event.category}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {event.total} messages
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <Progress
                              value={event.successRate}
                              className="flex-1 h-2"
                            />
                            <span className="text-sm font-medium w-12">
                              {event.successRate}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Application Progress */}
          <TabsContent value="applications" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Completed Applications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {completedApps}
                  </div>
                  <p className="text-sm text-gray-500">Successfully onboarded</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Active Applications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{activeApps}</div>
                  <p className="text-sm text-gray-500">Currently in progress</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Stuck/Escalated
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">{stuckApps}</div>
                  <p className="text-sm text-gray-500">Require attention</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Messaging Impact on Progress</CardTitle>
                <CardDescription>
                  How messages are helping move applications forward
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                      <div>
                        <div className="font-medium text-green-900">
                          Positive Response Rate
                        </div>
                        <div className="text-sm text-green-700">
                          Applications progressed after messaging
                        </div>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-green-600">73%</div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">
                        Avg. Time to First Response
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {avgResponseTime}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">
                        Median Response Time
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {medianResponseTime}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="font-medium text-blue-900 mb-2">
                      Channel Effectiveness for Nudging
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-700">SMS</span>
                        <div className="flex items-center gap-2">
                          <Progress value={85} className="w-32 h-2" />
                          <span className="text-sm font-medium">85%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-700">WhatsApp</span>
                        <div className="flex items-center gap-2">
                          <Progress value={78} className="w-32 h-2" />
                          <span className="text-sm font-medium">78%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-700">Email</span>
                        <div className="flex items-center gap-2">
                          <Progress value={62} className="w-32 h-2" />
                          <span className="text-sm font-medium">62%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-700">Teams</span>
                        <div className="flex items-center gap-2">
                          <Progress value={91} className="w-32 h-2" />
                          <span className="text-sm font-medium">91%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Escalation Analysis */}
          <TabsContent value="escalations" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Escalation Triggers</CardTitle>
                  <CardDescription>
                    Why messages are being escalated to other channels
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <XCircle className="h-5 w-5 text-red-500" />
                        <span className="text-sm">No Response (48h+)</span>
                      </div>
                      <span className="font-medium">45%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <XCircle className="h-5 w-5 text-orange-500" />
                        <span className="text-sm">Delivery Failure</span>
                      </div>
                      <span className="font-medium">28%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <XCircle className="h-5 w-5 text-yellow-500" />
                        <span className="text-sm">Unread (24h+)</span>
                      </div>
                      <span className="font-medium">18%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <XCircle className="h-5 w-5 text-gray-500" />
                        <span className="text-sm">Manual Escalation</span>
                      </div>
                      <span className="font-medium">9%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Escalation Success Rate</CardTitle>
                  <CardDescription>
                    Response rate after escalating to secondary channel
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center py-6">
                      <div className="text-5xl font-bold text-green-600">67%</div>
                      <div className="text-sm text-gray-500 mt-2">
                        of escalated messages got responses
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>Email → SMS</span>
                        <span className="font-medium text-green-600">72%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Email → WhatsApp</span>
                        <span className="font-medium text-green-600">68%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>SMS → WhatsApp</span>
                        <span className="font-medium text-green-600">54%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Any → Teams (Internal)</span>
                        <span className="font-medium text-green-600">89%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Escalation Timeline</CardTitle>
                <CardDescription>
                  Average time between message attempts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-600 mb-1">1st Attempt</div>
                    <div className="font-semibold">Immediate</div>
                  </div>
                  <div className="text-gray-400">→</div>
                  <div className="flex-1 text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-sm text-yellow-600 mb-1">2nd Attempt</div>
                    <div className="font-semibold">+24 hours</div>
                  </div>
                  <div className="text-gray-400">→</div>
                  <div className="flex-1 text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-sm text-orange-600 mb-1">3rd Attempt</div>
                    <div className="font-semibold">+48 hours</div>
                  </div>
                  <div className="text-gray-400">→</div>
                  <div className="flex-1 text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-sm text-red-600 mb-1">Escalate</div>
                    <div className="font-semibold">+72 hours</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
