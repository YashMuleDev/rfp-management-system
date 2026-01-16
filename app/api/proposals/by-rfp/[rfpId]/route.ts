import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET /api/proposals/by-rfp/:rfpId - Get all proposals for an RFP
export async function GET(request: Request, { params }: { params: Promise<{ rfpId: string }> }) {
  const { rfpId } = await params
  const proposals = db.proposals.filter((p) => p.rfp_id === rfpId)

  // Enrich with vendor names
  const enrichedProposals = proposals.map((proposal) => {
    const vendor = db.vendors.find((v) => v.id === proposal.vendor_id)
    return {
      ...proposal,
      vendor_name: vendor?.name || proposal.vendor_name || "Unknown Vendor",
    }
  })

  return NextResponse.json(enrichedProposals)
}
