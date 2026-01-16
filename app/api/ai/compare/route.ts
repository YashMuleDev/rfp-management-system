import { NextResponse } from "next/server"
import { generateText } from "ai"
import { db } from "@/lib/db"
import { PROMPTS } from "@/lib/ai-prompts"
import { geminiModel } from "@/lib/ai-config"
import type { AIComparisonResult } from "@/lib/types"

// POST /api/ai/compare - Compare proposals using AI
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { rfpId } = body

    if (!rfpId) {
      return NextResponse.json({ error: "RFP ID is required" }, { status: 400 })
    }

    const rfp = db.rfps.find((r) => r.id === rfpId)
    if (!rfp) {
      return NextResponse.json({ error: "RFP not found" }, { status: 404 })
    }

    const proposals = db.proposals.filter((p) => p.rfp_id === rfpId)
    if (proposals.length === 0) {
      return NextResponse.json(
        { error: "No proposals found for this RFP. Add vendor responses first." },
        { status: 400 },
      )
    }

    console.log("[v0] Comparing proposals for RFP:", rfpId, "Proposals:", proposals.length)

    // Format RFP for AI
    const rfpText = `
Title: ${rfp.title}
Description: ${rfp.description}
Budget: ${rfp.budget ? `${rfp.currency} ${rfp.budget}` : "Not specified"}
Delivery Required: ${rfp.delivery_timeline_days ? `${rfp.delivery_timeline_days} days` : "Not specified"}
Payment Terms Required: ${rfp.payment_terms || "Flexible"}
Warranty Required: ${rfp.warranty || "Not specified"}
Items: ${rfp.items.map((i) => `${i.name} (${i.qty} units)`).join(", ")}
    `.trim()

    // Format proposals for AI
    const proposalsText = proposals
      .map((p) => {
        const vendor = db.vendors.find((v) => v.id === p.vendor_id)
        return `
Vendor ID: ${p.vendor_id}
Vendor Name: ${vendor?.name || p.vendor_name || "Unknown"}
Price: ${p.price ? `${p.currency || "USD"} ${p.price}` : "Not specified"}
Delivery: ${p.delivery_days ? `${p.delivery_days} days` : "Not specified"}
Payment Terms: ${p.payment_terms || "Not specified"}
Warranty: ${p.warranty || "Not specified"}
Notes: ${p.notes || "None"}
        `.trim()
      })
      .join("\n\n---\n\n")

    let aiResponse: string
    try {
      const result = await generateText({
        model: geminiModel,
        prompt: PROMPTS.compareProposals(rfpText, proposalsText),
      })
      aiResponse = result.text
      console.log("[v0] AI comparison result:", aiResponse.substring(0, 200))
    } catch (aiError) {
      console.error("[v0] AI Error:", aiError)
      return NextResponse.json({ error: "AI service temporarily unavailable. Please try again." }, { status: 503 })
    }

    let comparison: AIComparisonResult
    try {
      const cleanResponse = aiResponse
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim()
      comparison = JSON.parse(cleanResponse)
    } catch (parseError) {
      console.error("[v0] Parse Error:", parseError)
      return NextResponse.json(
        { error: "Failed to parse AI comparison. Please try again.", raw: aiResponse },
        { status: 500 },
      )
    }

    // Update RFP status to evaluating
    const rfpIndex = db.rfps.findIndex((r) => r.id === rfpId)
    if (rfpIndex !== -1) {
      db.rfps[rfpIndex].status = "evaluating"
    }

    console.log("[v0] Comparison complete, recommended:", comparison.recommendedVendorName)

    return NextResponse.json(comparison)
  } catch (error) {
    console.error("[v0] Unexpected error comparing proposals:", error)
    return NextResponse.json({ error: "Failed to compare proposals. Please try again." }, { status: 500 })
  }
}
