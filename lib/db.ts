// In-memory database for demo purposes
// In production, this would be replaced with MongoDB

import type { RFP, Vendor, Proposal, EmailRaw } from "./types"

// Initialize with some seed data
export const db = {
  rfps: [] as RFP[],
  vendors: [
    {
      id: "v1",
      name: "TechSupply Co.",
      email: "sales@techsupply.example.com",
      category: "Electronics",
      notes: "Reliable vendor for IT equipment",
      created_at: new Date().toISOString(),
    },
    {
      id: "v2",
      name: "Office Solutions Ltd.",
      email: "procurement@officesolutions.example.com",
      category: "Office Supplies",
      notes: "Great for bulk orders",
      created_at: new Date().toISOString(),
    },
    {
      id: "v3",
      name: "Digital Dynamics",
      email: "bids@digitaldynamics.example.com",
      category: "Electronics",
      notes: "Competitive pricing on monitors",
      created_at: new Date().toISOString(),
    },
  ] as Vendor[],
  proposals: [] as Proposal[],
  emails: [] as EmailRaw[],
}

// Helper to generate IDs
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}
