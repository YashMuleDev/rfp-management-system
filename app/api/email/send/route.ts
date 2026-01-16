import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// POST /api/email/send - Send RFP to vendors
export async function POST(request: Request) {
  try {
    const { rfpId, vendorIds } = await request.json()

    if (!rfpId || !vendorIds || !Array.isArray(vendorIds)) {
      return NextResponse.json({ error: "RFP ID and vendor IDs are required" }, { status: 400 })
    }

    const rfp = db.rfps.find((r) => r.id === rfpId)
    if (!rfp) {
      return NextResponse.json({ error: "RFP not found" }, { status: 404 })
    }

    const vendors = db.vendors.filter((v) => vendorIds.includes(v.id))
    if (vendors.length === 0) {
      return NextResponse.json({ error: "No valid vendors found" }, { status: 400 })
    }

    // Format RFP for email
    const itemsList = rfp.items.map((item) => `- ${item.name}: ${item.qty} units (${item.specs})`).join("\n")

    const emailBody = `
Request for Proposal: ${rfp.title}

Dear Vendor,

We are seeking proposals for the following procurement:

${rfp.description}

Requirements:
${itemsList}

Budget: ${rfp.budget ? `${rfp.currency} ${rfp.budget.toLocaleString()}` : "Not specified"}
Delivery Timeline: ${rfp.delivery_timeline_days ? `${rfp.delivery_timeline_days} days` : "Not specified"}
Payment Terms: ${rfp.payment_terms || "To be discussed"}
Warranty Required: ${rfp.warranty || "To be discussed"}

Please submit your proposal by replying to this email with:
1. Your quoted price
2. Delivery timeline
3. Payment terms
4. Warranty offered
5. Any additional notes or conditions

We look forward to your response.

Best regards,
Procurement Team
    `.trim()

    // In a real app, this would use Nodemailer with SMTP
    // For demo, we simulate successful sending
    const sentEmails = vendors.map((vendor) => ({
      vendor: vendor.name,
      email: vendor.email,
      subject: `RFP: ${rfp.title}`,
      status: "sent",
    }))

    // Update RFP status
    const rfpIndex = db.rfps.findIndex((r) => r.id === rfpId)
    if (rfpIndex !== -1) {
      db.rfps[rfpIndex].status = "sent"
    }

    return NextResponse.json({
      success: true,
      message: `RFP sent to ${vendors.length} vendor(s)`,
      sentTo: sentEmails,
      emailPreview: emailBody,
    })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
