import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET /api/vendors/:id - Get a single vendor
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const vendor = db.vendors.find((v) => v.id === id)

  if (!vendor) {
    return NextResponse.json({ error: "Vendor not found" }, { status: 404 })
  }

  return NextResponse.json(vendor)
}

// PATCH /api/vendors/:id - Update a vendor
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const vendorIndex = db.vendors.findIndex((v) => v.id === id)

  if (vendorIndex === -1) {
    return NextResponse.json({ error: "Vendor not found" }, { status: 404 })
  }

  db.vendors[vendorIndex] = { ...db.vendors[vendorIndex], ...body }

  return NextResponse.json(db.vendors[vendorIndex])
}

// DELETE /api/vendors/:id - Delete a vendor
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const vendorIndex = db.vendors.findIndex((v) => v.id === id)

  if (vendorIndex === -1) {
    return NextResponse.json({ error: "Vendor not found" }, { status: 404 })
  }

  db.vendors.splice(vendorIndex, 1)

  return NextResponse.json({ success: true })
}
