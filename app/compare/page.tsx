"use client"

import { useState } from "react"
import useSWR from "swr"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Sparkles, Trophy, BarChart3 } from "lucide-react"
import type { RFP, Proposal, AIComparisonResult } from "@/lib/types"

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

export default function ComparePage() {
  const { data: rfps = [] } = useSWR<RFP[]>("/api/rfps", fetcher)

  const [selectedRFP, setSelectedRFP] = useState<string>("")
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [comparison, setComparison] = useState<AIComparisonResult | null>(null)
  const [isLoadingProposals, setIsLoadingProposals] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const evaluableRFPs = rfps
  const currentRFP = rfps.find((r) => r.id === selectedRFP)

  const handleRFPSelect = async (rfpId: string) => {
    setSelectedRFP(rfpId)
    setComparison(null)
    setError(null)
    setIsLoadingProposals(true)

    try {
      const response = await fetch(`/api/proposals/by-rfp/${rfpId}`)

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned an invalid response")
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch proposals")
      }

      setProposals(data)
    } catch (error) {
      console.error("[v0] Error fetching proposals:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch proposals")
      setProposals([])
    } finally {
      setIsLoadingProposals(false)
    }
  }

  const handleAnalyze = async () => {
    if (!selectedRFP || proposals.length === 0) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const response = await fetch("/api/ai/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rfpId: selectedRFP }),
      })

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned an invalid response. Please try again.")
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze proposals")
      }

      setComparison(data)
    } catch (error) {
      console.error("[v0] Error analyzing proposals:", error)
      setError(error instanceof Error ? error.message : "Failed to analyze proposals")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600"
    if (score >= 60) return "text-amber-600"
    return "text-red-600"
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-100"
    if (score >= 60) return "bg-amber-100"
    return "bg-red-100"
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="Compare Proposals" description="AI-powered analysis and vendor recommendation" />

      <div className="p-6">
        {error && <div className="mb-6 rounded-lg bg-destructive/10 p-4 text-destructive">{error}</div>}

        {/* RFP Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Select RFP to Compare
            </CardTitle>
            <CardDescription>Choose an RFP with received proposals to compare</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedRFP} onValueChange={handleRFPSelect}>
              <SelectTrigger className="max-w-md">
                <SelectValue placeholder="Select an RFP" />
              </SelectTrigger>
              <SelectContent>
                {evaluableRFPs.length === 0 ? (
                  <SelectItem value="none" disabled>
                    No RFPs available - create one first
                  </SelectItem>
                ) : (
                  evaluableRFPs.map((rfp) => (
                    <SelectItem key={rfp.id} value={rfp.id}>
                      {rfp.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            {currentRFP && (
              <div className="mt-4 rounded-lg bg-muted p-4">
                <h4 className="font-medium">{currentRFP.title}</h4>
                <p className="mt-1 text-sm text-muted-foreground">{currentRFP.description}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    Budget:{" "}
                    {currentRFP.budget ? `${currentRFP.currency} ${currentRFP.budget.toLocaleString()}` : "Not set"}
                  </Badge>
                  <Badge variant="secondary">
                    Delivery:{" "}
                    {currentRFP.delivery_timeline_days ? `${currentRFP.delivery_timeline_days} days` : "Not set"}
                  </Badge>
                  <Badge variant="secondary">Status: {currentRFP.status}</Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Proposals Table */}
        {selectedRFP && (
          <>
            {isLoadingProposals ? (
              <div className="flex h-32 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : proposals.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No proposals received for this RFP yet.</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Go to the Inbox page to simulate vendor responses.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card className="mb-6">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Proposal Comparison</CardTitle>
                      <CardDescription>
                        {proposals.length} proposal{proposals.length !== 1 ? "s" : ""} received
                      </CardDescription>
                    </div>
                    <Button onClick={handleAnalyze} disabled={isAnalyzing} className="gap-2">
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Analyze with AI
                        </>
                      )}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Vendor</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Delivery</TableHead>
                            <TableHead>Payment Terms</TableHead>
                            <TableHead>Warranty</TableHead>
                            {comparison && <TableHead>AI Score</TableHead>}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {proposals.map((proposal) => {
                            const scoreData = comparison?.scores.find((s) => s.vendorId === proposal.vendor_id)
                            const isRecommended = comparison?.recommendedVendorId === proposal.vendor_id

                            return (
                              <TableRow key={proposal.id} className={isRecommended ? "bg-emerald-50" : ""}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-2">
                                    {isRecommended && <Trophy className="h-4 w-4 text-amber-500" />}
                                    {proposal.vendor_name}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {proposal.price
                                    ? `${proposal.currency || "USD"} ${proposal.price.toLocaleString()}`
                                    : "N/A"}
                                </TableCell>
                                <TableCell>
                                  {proposal.delivery_days ? `${proposal.delivery_days} days` : "N/A"}
                                </TableCell>
                                <TableCell>{proposal.payment_terms || "N/A"}</TableCell>
                                <TableCell>{proposal.warranty || "N/A"}</TableCell>
                                {comparison && (
                                  <TableCell>
                                    <span
                                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium ${getScoreBg(scoreData?.score || 0)} ${getScoreColor(scoreData?.score || 0)}`}
                                    >
                                      {scoreData?.score || 0}/100
                                    </span>
                                  </TableCell>
                                )}
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Recommendation */}
                {comparison && (
                  <Card className="border-emerald-200 bg-emerald-50/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-emerald-800">
                        <Trophy className="h-5 w-5 text-amber-500" />
                        AI Recommendation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <h4 className="text-lg font-semibold text-emerald-800">
                          Recommended Vendor: {comparison.recommendedVendorName}
                        </h4>
                        <p className="mt-2 text-foreground">{comparison.summary}</p>
                      </div>

                      <div className="space-y-3">
                        <h5 className="font-medium">Detailed Scores:</h5>
                        {comparison.scores.map((score) => (
                          <div key={score.vendorId} className="rounded-lg bg-background p-3">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{score.vendorName}</span>
                              <span className={`font-semibold ${getScoreColor(score.score)}`}>{score.score}/100</span>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">{score.explanation}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
