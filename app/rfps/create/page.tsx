"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, Check } from "lucide-react"
import type { RFP } from "@/lib/types"

export default function CreateRFPPage() {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [createdRFP, setCreatedRFP] = useState<RFP | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCreate = async () => {
    if (!input.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/rfps/from-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      })

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned an invalid response. Please try again.")
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create RFP")
      }

      setCreatedRFP(data)
    } catch (err) {
      console.error("[v0] Create RFP error:", err)
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setInput("")
    setCreatedRFP(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="Create RFP" description="Describe your procurement needs in natural language" />

      <div className="mx-auto max-w-4xl p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              AI-Powered RFP Creation
            </CardTitle>
            <CardDescription>
              Simply describe what you need to procure, and our AI will structure it into a formal RFP
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Example: I need to procure laptops and monitors for our new office. Budget is $50,000 total. Need delivery within 30 days. We need 20 laptops with 16GB RAM and 15 monitors 27-inch. Payment terms should be net 30, and we need at least 1 year warranty."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[150px] resize-none"
              disabled={isLoading || !!createdRFP}
            />

            {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

            <div className="flex gap-2">
              <Button onClick={handleCreate} disabled={!input.trim() || isLoading || !!createdRFP} className="gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Create RFP with AI
                  </>
                )}
              </Button>

              {createdRFP && (
                <Button variant="outline" onClick={handleReset}>
                  Create Another
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Structured RFP Display */}
        {createdRFP && (
          <Card className="mt-6 border-emerald-200 bg-emerald-50/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-emerald-600" />
                <CardTitle className="text-emerald-800">RFP Created Successfully</CardTitle>
              </div>
              <CardDescription>Your procurement request has been structured and saved</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Title</label>
                  <p className="text-lg font-semibold">{createdRFP.title}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="text-foreground">{createdRFP.description}</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Budget</label>
                    <p className="text-lg font-semibold">
                      {createdRFP.budget
                        ? `${createdRFP.currency} ${createdRFP.budget.toLocaleString()}`
                        : "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Delivery Timeline</label>
                    <p className="text-lg font-semibold">
                      {createdRFP.delivery_timeline_days
                        ? `${createdRFP.delivery_timeline_days} days`
                        : "Not specified"}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Items</label>
                  <div className="mt-2 space-y-2">
                    {createdRFP.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between rounded-lg bg-background p-3">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <span className="ml-2 text-muted-foreground">({item.specs})</span>
                        </div>
                        <Badge variant="secondary">Qty: {item.qty}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Payment Terms</label>
                    <p>{createdRFP.payment_terms || "Not specified"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Warranty</label>
                    <p>{createdRFP.warranty || "Not specified"}</p>
                  </div>
                </div>

                {/* JSON Preview */}
                <div className="mt-4">
                  <label className="text-sm font-medium text-muted-foreground">Structured JSON</label>
                  <pre className="mt-2 overflow-auto rounded-lg bg-muted p-4 text-xs">
                    {JSON.stringify(createdRFP, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
