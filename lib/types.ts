// Data Models for the RFP Management System

export interface RFPItem {
  name: string
  qty: number
  specs: string
}

export interface RFP {
  id: string
  title: string
  description: string
  budget: number | null
  currency: string
  delivery_timeline_days: number | null
  items: RFPItem[]
  payment_terms: string | null
  warranty: string | null
  created_at: string
  status: "draft" | "sent" | "evaluating" | "awarded"
}

export interface Vendor {
  id: string
  name: string
  email: string
  category: string
  notes: string
  created_at: string
}

export interface Proposal {
  id: string
  rfp_id: string
  vendor_id: string
  vendor_name?: string
  price: number | null
  currency: string | null
  delivery_days: number | null
  payment_terms: string | null
  warranty: string | null
  notes: string
  raw_text: string
  created_at: string
  score?: number
  explanation?: string
}

export interface EmailRaw {
  id: string
  from: string
  to: string
  subject: string
  body: string
  attachments: string[]
  received_at: string
  parsed: boolean
  rfp_id?: string
}

export interface AIComparisonResult {
  scores: Array<{
    vendorId: string
    vendorName: string
    score: number
    explanation: string
  }>
  recommendedVendorId: string
  recommendedVendorName: string
  summary: string
}
