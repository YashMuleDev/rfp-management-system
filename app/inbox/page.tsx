"use client"

import type React from "react"
import { useState } from "react"
import useSWR, { mutate } from "swr"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Plus, Mail, Check, InboxIcon } from "lucide-react"
import type { RFP, EmailRaw } from "@/lib/types"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  const contentType = res.headers.get("content-type")
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("Server returned an invalid response")
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || "Failed to fetch data")
  }
  return res.json()
}

export default function InboxPage() {
  const { data: emails = [], isLoading } = useSWR<(EmailRaw & { proposal?: any })[]>("/api/email/list", fetcher)
  const { data: rfps = [] } = useSWR<RFP[]>("/api/rfps", fetcher)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    from: "",
    subject: "",
    emailBody: "",
    rfpId: "",
  })
  const [result, setResult] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setResult(null)
    setError(null)

    try {
      const response = await fetch("/api/email/receive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned an invalid response. Please try again.")
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to process email")
      }

      setResult(data)
      mutate("/api/email/list")
    } catch (error) {
      console.error("[v0] Error receiving email:", error)
      setError(error instanceof Error ? error.message : "Failed to process email")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setFormData({ from: "", subject: "", emailBody: "", rfpId: "" })
    setResult(null)
    setError(null)
    setIsDialogOpen(false)
  }

  const rfpsForDropdown = rfps

  return (
    <div className="min-h-screen bg-background">
      <Header title="Email Inbox" description="View received vendor responses and AI-parsed proposals" />

      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-muted-foreground">
              {emails.length} email{emails.length !== 1 ? "s" : ""} received
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Simulate Vendor Response
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Simulate Vendor Email Response</DialogTitle>
                  <DialogDescription>Enter a vendor's email response to test the AI parsing feature</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="from">From (Vendor Email)</Label>
                      <Input
                        id="from"
                        type="email"
                        value={formData.from}
                        onChange={(e) => setFormData((prev) => ({ ...prev, from: e.target.value }))}
                        placeholder="sales@vendor.com"
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="rfpId">Related RFP *</Label>
                      <Select
                        value={formData.rfpId}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, rfpId: value }))}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select RFP" />
                        </SelectTrigger>
                        <SelectContent>
                          {rfpsForDropdown.length === 0 ? (
                            <SelectItem value="none" disabled>
                              No RFPs available - create one first
                            </SelectItem>
                          ) : (
                            rfpsForDropdown.map((rfp) => (
                              <SelectItem key={rfp.id} value={rfp.id}>
                                {rfp.title}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                      placeholder="RE: RFP for Office Equipment"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="emailBody">Email Body *</Label>
                    <Textarea
                      id="emailBody"
                      value={formData.emailBody}
                      onChange={(e) => setFormData((prev) => ({ ...prev, emailBody: e.target.value }))}
                      placeholder="Example: Thank you for the RFP. We are pleased to offer the following quote:

20x Laptops (16GB RAM, i7 processor): $800 each = $16,000
15x 27-inch Monitors: $350 each = $5,250

Total: $21,250 USD

Delivery: 25 business days
Payment: Net 45
Warranty: 2 years on-site support

Please let us know if you need any clarification."
                      className="min-h-[200px]"
                      required
                    />
                  </div>
                </div>

                {error && <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

                {result && (
                  <div className="mb-4 rounded-lg bg-emerald-50 p-4">
                    <h4 className="mb-2 flex items-center gap-2 font-medium text-emerald-800">
                      <Check className="h-4 w-4" />
                      Email Parsed Successfully
                    </h4>
                    <div className="grid gap-2 text-sm">
                      <div>
                        <strong>Price:</strong> {result.proposal?.currency || "USD"}{" "}
                        {result.proposal?.price?.toLocaleString() || "Not extracted"}
                      </div>
                      <div>
                        <strong>Delivery:</strong>{" "}
                        {result.proposal?.delivery_days ? `${result.proposal.delivery_days} days` : "Not extracted"}
                      </div>
                      <div>
                        <strong>Payment Terms:</strong> {result.proposal?.payment_terms || "Not extracted"}
                      </div>
                      <div>
                        <strong>Warranty:</strong> {result.proposal?.warranty || "Not extracted"}
                      </div>
                      <div>
                        <strong>Notes:</strong> {result.proposal?.notes || "None"}
                      </div>
                    </div>
                  </div>
                )}

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleReset}>
                    {result ? "Done" : "Cancel"}
                  </Button>
                  {!result && (
                    <Button type="submit" disabled={isSubmitting || !formData.rfpId || !formData.emailBody}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing with AI...
                        </>
                      ) : (
                        "Receive & Parse Email"
                      )}
                    </Button>
                  )}
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : emails.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <InboxIcon className="mb-4 h-12 w-12 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No emails received yet</p>
              <p className="mt-1 text-sm text-muted-foreground">Create an RFP first, then simulate vendor responses</p>
              <Button variant="link" className="mt-2" onClick={() => setIsDialogOpen(true)}>
                Simulate a vendor response
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {emails.map((email) => (
              <Card key={email.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Mail className="h-4 w-4" />
                        {email.subject || "No Subject"}
                      </CardTitle>
                      <CardDescription>
                        From: {email.from} • {new Date(email.received_at).toLocaleString()}
                      </CardDescription>
                    </div>
                    <Badge variant={email.parsed ? "default" : "secondary"}>
                      {email.parsed ? "Parsed" : "Pending"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg bg-muted p-4">
                    <pre className="whitespace-pre-wrap text-sm">{email.body}</pre>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
