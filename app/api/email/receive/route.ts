import { NextResponse } from "next/server"
import { generateText } from "ai"
import { db, generateId } from "@/lib/db"
import { PROMPTS } from "@/lib/ai-prompts"
import { geminiModel } from "@/lib/ai-config"
import type { EmailRaw, Proposal } from "@/lib/types"

// POST /api/email/receive - Receive and parse vendor email
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { from, to, subject, emailBody, rfpId } = body

    if (!from || !emailBody) {
      return NextResponse.json({ error: "From and email body are required" }, { status: 400 })
    }

    if (!rfpId) {
      return NextResponse.json({ error: "Please select an RFP for this response" }, { status: 400 })
    }

    console.log("[v0] Processing email from:", from)

    // Store raw email
    const rawEmail: EmailRaw = {
      id: generateId(),
      from,
      to: to || "rfp@company.example.com",
      subject: subject || "Vendor Response",
      body: emailBody,
      attachments: body.attachments || [],
      received_at: new Date().toISOString(),
      parsed: false,
      rfp_id: rfpId,
    }

    db.emails.push(rawEmail)

    // Find vendor by email
    const vendor = db.vendors.find(
      (v) =>
        v.email.toLowerCase() === from.toLowerCase() ||
        from.toLowerCase().includes(v.email.split("@")[0].toLowerCase()),
    )

    let aiResponse: string
    try {
      const result = await generateText({
        model: geminiModel,
        prompt: PROMPTS.parseProposal(emailBody),
      })
      aiResponse = result.text
      console.log("[v0] AI parsed proposal:", aiResponse.substring(0, 200))
    } catch (aiError) {
      console.error("[v0] AI Error:", aiError)
      return NextResponse.json({ error: "AI service temporarily unavailable. Please try again." }, { status: 503 })
    }

    let parsedProposal
    try {
      const cleanResponse = aiResponse
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim()
      parsedProposal = JSON.parse(cleanResponse)
    } catch (parseError) {
      console.error("[v0] Parse Error:", parseError)
      return NextResponse.json(
        { error: "Failed to parse vendor response. Please try again.", raw: aiResponse },
        { status: 500 },
      )
    }

    // Create proposal from parsed data
    const proposal: Proposal = {
      id: generateId(),
      rfp_id: rfpId,
      vendor_id: vendor?.id || "unknown",
      vendor_name: vendor?.name || from,
      price: parsedProposal.price,
      currency: parsedProposal.currency || "USD",
      delivery_days: parsedProposal.delivery_days,
      payment_terms: parsedProposal.payment_terms,
      warranty: parsedProposal.warranty,
      notes: parsedProposal.notes,
      raw_text: emailBody,
      created_at: new Date().toISOString(),
    }

    db.proposals.push(proposal)

    // Mark email as parsed
    const emailIndex = db.emails.findIndex((e) => e.id === rawEmail.id)
    if (emailIndex !== -1) {
      db.emails[emailIndex].parsed = true
    }

    console.log("[v0] Proposal created:", proposal.id)

    return NextResponse.json(
      {
        success: true,
        email: rawEmail,
        proposal,
        vendor: vendor || { name: from, email: from },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Unexpected error receiving email:", error)
    return NextResponse.json({ error: "Failed to process email. Please try again." }, { status: 500 })
  }
}

// GET /api/email/receive - List all received emails
export async function GET() {
  return NextResponse.json(db.emails)
}
