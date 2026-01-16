// AI Prompts for the RFP Management System

export const PROMPTS = {
  // Natural language → RFP JSON
  createRFP: (userText: string) => `You are an assistant that converts procurement needs into a structured RFP object.

Input:
"""${userText}"""

Return ONLY valid JSON with fields:
- title (string): A concise title for this RFP
- description (string): A detailed description of the procurement need
- budget (number or null): Total budget amount
- currency (string): Currency code like "USD", "EUR", etc. Default to "USD"
- delivery_timeline_days (number or null): Number of days for delivery
- items (array of { name: string, qty: number, specs: string }): List of items to procure
- payment_terms (string or null): Payment terms like "Net 30"
- warranty (string or null): Warranty requirements

If a field is not mentioned, return null or empty array for items.
Return ONLY the JSON object, no markdown formatting or explanation.`,

  // Vendor email → parsed proposal
  parseProposal: (emailBody: string) => `Extract proposal details from this vendor reply.

Email:
"""${emailBody}"""

Return ONLY valid JSON with these fields:
{
  "price": number or null (total price offered),
  "currency": string or null (currency code),
  "delivery_days": number or null (delivery timeline in days),
  "payment_terms": string or null (payment terms offered),
  "warranty": string or null (warranty offered),
  "notes": string (any additional notes or comments extracted)
}

Return ONLY the JSON object, no markdown formatting or explanation.`,

  // Compare proposals
  compareProposals: (
    rfp: string,
    proposals: string,
  ) => `Given an RFP and vendor proposals, compare them and recommend the best vendor.

RFP Details:
"""${rfp}"""

Vendor Proposals:
"""${proposals}"""

Evaluate each proposal based on:
1. Price competitiveness (lower is better, considering budget)
2. Delivery timeline (faster is better, meeting requirements)
3. Payment terms (favorable terms)
4. Warranty coverage (longer/better is better)
5. Overall completeness and professionalism

Return ONLY valid JSON:
{
  "scores": [
    { "vendorId": "string", "vendorName": "string", "score": 0-100, "explanation": "brief explanation" }
  ],
  "recommendedVendorId": "string",
  "recommendedVendorName": "string", 
  "summary": "A 2-3 sentence summary explaining the recommendation"
}

Return ONLY the JSON object, no markdown formatting or explanation.`,
}
