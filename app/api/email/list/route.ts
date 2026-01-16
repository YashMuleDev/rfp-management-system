import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET /api/email/list - List all emails with parsed status
export async function GET() {
  const emailsWithProposals = db.emails.map((email) => {
    const proposal = db.proposals.find((p) => p.raw_text === email.body || p.vendor_name === email.from)
    return {
      ...email,
      proposal: proposal || null,
    }
  })

  return NextResponse.json(emailsWithProposals)
}
