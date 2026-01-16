"use client"

import { useState } from "react"
import useSWR, { mutate } from "swr"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Send, Check, FileText, Users } from "lucide-react"
import type { RFP, Vendor } from "@/lib/types"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }
  return res.json()
}

export default function SendRFPPage() {
  const { data: rfps = [] } = useSWR<RFP[]>("/api/rfps", fetcher)
  const { data: vendors = [] } = useSWR<Vendor[]>("/api/vendors", fetcher)

  const [selectedRFP, setSelectedRFP] = useState<string>("")
  const [selectedVendors, setSelectedVendors] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    emailPreview?: string
    sentTo?: Array<{ vendor: string; email: string }>
  } | null>(null)

  const draftRFPs = rfps.filter((r) => r.status === "draft" || r.status === "sent")
  const currentRFP = rfps.find((r) => r.id === selectedRFP)

  const handleVendorToggle = (vendorId: string) => {
    setSelectedVendors((prev) => (prev.includes(vendorId) ? prev.filter((id) => id !== vendorId) : [...prev, vendorId]))
  }

  const handleSelectAll = () => {
    if (selectedVendors.length === vendors.length) {
      setSelectedVendors([])
    } else {
      setSelectedVendors(vendors.map((v) => v.id))
    }
  }

  const handleSend = async () => {
    if (!selectedRFP || selectedVendors.length === 0) return

    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rfpId: selectedRFP,
          vendorIds: selectedVendors,
        }),
      })

      const data = await response.json()
      setResult(data)
      mutate("/api/rfps")
    } catch (error) {
      setResult({
        success: false,
        message: "Failed to send emails",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="Send RFP" description="Select an RFP and vendors to send it to" />

      <div className="mx-auto max-w-4xl p-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* RFP Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Select RFP
              </CardTitle>
              <CardDescription>Choose an RFP to send to vendors</CardDescription>
            </CardHeader>
            <CardContent>
              {draftRFPs.length === 0 ? (
                <p className="text-sm text-muted-foreground">No RFPs available. Create an RFP first.</p>
              ) : (
                <Select value={selectedRFP} onValueChange={setSelectedRFP}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an RFP" />
                  </SelectTrigger>
                  <SelectContent>
                    {draftRFPs.map((rfp) => (
                      <SelectItem key={rfp.id} value={rfp.id}>
                        {rfp.title} ({rfp.status})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {currentRFP && (
                <div className="mt-4 rounded-lg bg-muted p-4">
                  <h4 className="font-medium">{currentRFP.title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{currentRFP.description}</p>
                  <div className="mt-2 flex gap-2">
                    <Badge variant="secondary">
                      {currentRFP.budget ? `${currentRFP.currency} ${currentRFP.budget.toLocaleString()}` : "No budget"}
                    </Badge>
                    <Badge variant="secondary">{currentRFP.items.length} items</Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Vendor Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Select Vendors
              </CardTitle>
              <CardDescription>Choose which vendors to send the RFP to</CardDescription>
            </CardHeader>
            <CardContent>
              {vendors.length === 0 ? (
                <p className="text-sm text-muted-foreground">No vendors available. Add vendors first.</p>
              ) : (
                <>
                  <Button variant="outline" size="sm" className="mb-3 bg-transparent" onClick={handleSelectAll}>
                    {selectedVendors.length === vendors.length ? "Deselect All" : "Select All"}
                  </Button>

                  <div className="max-h-64 space-y-2 overflow-y-auto">
                    {vendors.map((vendor) => (
                      <div key={vendor.id} className="flex items-center space-x-3 rounded-lg border p-3">
                        <Checkbox
                          id={vendor.id}
                          checked={selectedVendors.includes(vendor.id)}
                          onCheckedChange={() => handleVendorToggle(vendor.id)}
                        />
                        <label htmlFor={vendor.id} className="flex-1 cursor-pointer">
                          <div className="font-medium">{vendor.name}</div>
                          <div className="text-sm text-muted-foreground">{vendor.email}</div>
                        </label>
                        <Badge variant="secondary">{vendor.category}</Badge>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Send Button */}
        <div className="mt-6 flex justify-center">
          <Button
            size="lg"
            className="gap-2"
            disabled={!selectedRFP || selectedVendors.length === 0 || isLoading}
            onClick={handleSend}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send RFP to {selectedVendors.length} Vendor{selectedVendors.length !== 1 ? "s" : ""}
              </>
            )}
          </Button>
        </div>

        {/* Result */}
        {result && (
          <Card
            className={`mt-6 ${result.success ? "border-emerald-200 bg-emerald-50/50" : "border-destructive bg-destructive/10"}`}
          >
            <CardHeader>
              <CardTitle
                className={`flex items-center gap-2 ${result.success ? "text-emerald-800" : "text-destructive"}`}
              >
                {result.success ? <Check className="h-5 w-5" /> : null}
                {result.message}
              </CardTitle>
            </CardHeader>
            {result.success && result.emailPreview && (
              <CardContent>
                <div className="mb-4">
                  <h4 className="mb-2 font-medium">Sent to:</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.sentTo?.map((item, i) => (
                      <Badge key={i} variant="secondary">
                        {item.vendor} ({item.email})
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="mb-2 font-medium">Email Preview:</h4>
                  <pre className="overflow-auto whitespace-pre-wrap rounded-lg bg-background p-4 text-sm">
                    {result.emailPreview}
                  </pre>
                </div>
              </CardContent>
            )}
          </Card>
        )}
      </div>
    </div>
  )
}
