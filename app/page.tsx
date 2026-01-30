"use client"

import { AppSidebar } from "@/components/messaging/app-sidebar"
import { StatCard } from "@/components/messaging/stat-card"
import { RecentActivity } from "@/components/messaging/recent-activity"
import { ApplicationsOverview } from "@/components/messaging/applications-overview"
import { messagingStore } from "@/lib/messaging/store"
import {
  FolderKanban,
  Send,
  CheckCircle2,
  Reply,
  Radio,
  Zap,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DashboardPage() {
  const stats = messagingStore.getDashboardStats()
  const logs = messagingStore.getMessageLogs()
  const events = messagingStore.getEvents()
  const channels = messagingStore.getChannels()
  const applications = messagingStore.getApplications()
  const staff = messagingStore.getStaff()

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <div className="border-b border-border bg-card px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Onboarding Messaging Hub - Overview and quick actions
              </p>
            </div>
            <Link href="/send">
              <Button className="bg-[#D71C2B] hover:bg-[#EE2033]">
                <Send className="mr-2 h-4 w-4" />
                Send Message
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="p-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <StatCard
              title="Total Applications"
              value={stats.totalApplications}
              subtitle={`${stats.pendingApplications} pending`}
              icon={FolderKanban}
            />
            <StatCard
              title="Messages Sent"
              value={stats.totalMessagesSent}
              subtitle="All time"
              icon={Send}
            />
            <StatCard
              title="Delivery Rate"
              value={`${stats.deliveryRate}%`}
              subtitle="Successfully delivered"
              icon={CheckCircle2}
              trend={{ value: 2.5, isPositive: true }}
            />
            <StatCard
              title="Response Rate"
              value={`${stats.responseRate}%`}
              subtitle="Customer replies"
              icon={Reply}
              trend={{ value: 1.2, isPositive: true }}
            />
            <StatCard
              title="Active Channels"
              value={stats.activeChannels}
              subtitle="Configured"
              icon={Radio}
            />
            <StatCard
              title="Active Events"
              value={stats.activeEvents}
              subtitle="Triggers enabled"
              icon={Zap}
            />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <RecentActivity logs={logs} events={events} channels={channels} />
            <ApplicationsOverview applications={applications} staff={staff} />
          </div>
        </div>
      </main>
    </div>
  )
}
