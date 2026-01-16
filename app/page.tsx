"use client"

import useSWR, { mutate } from "swr"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Users, Inbox, TrendingUp, Trash2 } from "lucide-react"
import Link from "next/link"
import type { RFP, Vendor, EmailRaw } from "@/lib/types"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }
  return res.json()
}

export default function DashboardPage() {
  const { data: rfps = [] } = useSWR<RFP[]>("/api/rfps", fetcher)
  const { data: vendors = [] } = useSWR<Vendor[]>("/api/vendors", fetcher)
  const { data: emails = [] } = useSWR<EmailRaw[]>("/api/email/list", fetcher)

  const handleDeleteRFP = async (id: string) => {
    if (!confirm("Are you sure you want to delete this RFP?")) return

    try {
      await fetch(`/api/rfps/${id}`, { method: "DELETE" })
      mutate("/api/rfps")
    } catch (error) {
      console.error("Error deleting RFP:", error)
    }
  }

  const stats = [
    { name: "Total RFPs", value: rfps.length, icon: FileText, href: "/rfps/create" },
    { name: "Active Vendors", value: vendors.length, icon: Users, href: "/vendors" },
    { name: "Received Responses", value: emails.length, icon: Inbox, href: "/inbox" },
    {
      name: "Pending Evaluation",
      value: rfps.filter((r) => r.status === "sent").length,
      icon: TrendingUp,
      href: "/compare",
    },
  ]

  const statusColors: Record<string, string> = {
    draft: "bg-muted text-muted-foreground",
    sent: "bg-blue-100 text-blue-800",
    evaluating: "bg-amber-100 text-amber-800",
    awarded: "bg-emerald-100 text-emerald-800",
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="Dashboard" description="Overview of your RFP management system" />

      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Link key={stat.name} href={stat.href}>
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.name}</CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recent RFPs */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent RFPs</CardTitle>
            <CardDescription>Your latest procurement requests</CardDescription>
          </CardHeader>
          <CardContent>
            {rfps.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <FileText className="mx-auto mb-2 h-12 w-12 opacity-50" />
                <p>No RFPs created yet</p>
                <Link href="/rfps/create" className="mt-2 inline-block text-sm text-primary hover:underline">
                  Create your first RFP
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {rfps.slice(0, 5).map((rfp) => (
                  <div key={rfp.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex-1">
                      <h3 className="font-medium">{rfp.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {rfp.budget ? `${rfp.currency} ${rfp.budget.toLocaleString()}` : "No budget set"}
                        {rfp.delivery_timeline_days && ` • ${rfp.delivery_timeline_days} days`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={statusColors[rfp.status]}>{rfp.status}</Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                          e.preventDefault()
                          handleDeleteRFP(rfp.id)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Link href="/rfps/create">
            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5" />
                  Create RFP
                </CardTitle>
                <CardDescription>Describe your procurement needs in natural language</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/vendors">
            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5" />
                  Manage Vendors
                </CardTitle>
                <CardDescription>Add, edit, or remove vendors from your database</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/compare">
            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5" />
                  Compare Proposals
                </CardTitle>
                <CardDescription>Use AI to analyze and recommend the best vendor</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
