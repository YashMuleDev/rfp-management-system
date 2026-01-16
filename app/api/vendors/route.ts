import { NextResponse } from "next/server"
import { db, generateId } from "@/lib/db"
import type { Vendor } from "@/lib/types"

// GET /api/vendors - List all vendors
export async function GET() {
  return NextResponse.json(db.vendors)
}

// POST /api/vendors - Create a new vendor
export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.name || !body.email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    const newVendor: Vendor = {
      id: generateId(),
      name: body.name,
      email: body.email,
      category: body.category || "General",
      notes: body.notes || "",
      created_at: new Date().toISOString(),
    }

    db.vendors.push(newVendor)

    return NextResponse.json(newVendor, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create vendor" }, { status: 500 })
  }
}
