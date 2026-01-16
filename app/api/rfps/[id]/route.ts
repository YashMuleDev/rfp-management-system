import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET /api/rfps/:id - Get a single RFP
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const rfp = db.rfps.find((r) => r.id === id)

  if (!rfp) {
    return NextResponse.json({ error: "RFP not found" }, { status: 404 })
  }

  return NextResponse.json(rfp)
}

// PATCH /api/rfps/:id - Update RFP status
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const rfpIndex = db.rfps.findIndex((r) => r.id === id)

  if (rfpIndex === -1) {
    return NextResponse.json({ error: "RFP not found" }, { status: 404 })
  }

  db.rfps[rfpIndex] = { ...db.rfps[rfpIndex], ...body }

  return NextResponse.json(db.rfps[rfpIndex])
}

// DELETE /api/rfps/:id - Delete an RFP
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const rfpIndex = db.rfps.findIndex((r) => r.id === id)

  if (rfpIndex === -1) {
    return NextResponse.json({ error: "RFP not found" }, { status: 404 })
  }

  db.rfps.splice(rfpIndex, 1)

  return NextResponse.json({ success: true })
}
