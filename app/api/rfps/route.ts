import { NextResponse } from "next/server"
import { db, generateId } from "@/lib/db"
import type { RFP } from "@/lib/types"

// GET /api/rfps - List all RFPs
export async function GET() {
  return NextResponse.json(db.rfps)
}

// POST /api/rfps - Create a new RFP manually
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const newRFP: RFP = {
      id: generateId(),
      title: body.title || "Untitled RFP",
      description: body.description || "",
      budget: body.budget || null,
      currency: body.currency || "USD",
      delivery_timeline_days: body.delivery_timeline_days || null,
      items: body.items || [],
      payment_terms: body.payment_terms || null,
      warranty: body.warranty || null,
      created_at: new Date().toISOString(),
      status: "draft",
    }

    db.rfps.push(newRFP)

    return NextResponse.json(newRFP, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create RFP" }, { status: 500 })
  }
}
