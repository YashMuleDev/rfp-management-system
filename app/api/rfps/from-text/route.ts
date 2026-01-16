import { NextResponse } from "next/server"
import { generateText } from "ai"
import { db, generateId } from "@/lib/db"
import { PROMPTS } from "@/lib/ai-prompts"
import { geminiModel } from "@/lib/ai-config"
import type { RFP } from "@/lib/types"

// POST /api/rfps/from-text - Create RFP from natural language
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { text } = body

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text input is required" }, { status: 400 })
    }

    console.log("[v0] Creating RFP from text:", text.substring(0, 100))

    let aiResponse: string
    try {
      console.log("[v0] Attempting to call Gemini API...")
      const result = await generateText({
        model: geminiModel,
        prompt: PROMPTS.createRFP(text),
      })
      aiResponse = result.text
      console.log("[v0] AI Response received:", aiResponse.substring(0, 200))
    } catch (aiError: any) {
      console.error("[v0] AI Error:", aiError)
      console.error("[v0] Error message:", aiError?.message)
      console.error("[v0] Error status:", aiError?.statusCode)
      console.error("[v0] API Key being used:", process.env.GOOGLE_GENERATIVE_AI_API_KEY?.substring(0, 15) + '...')
      return NextResponse.json({ error: "AI service temporarily unavailable. Please try again." }, { status: 503 })
    }

    // Parse the AI response
    let parsedRFP
    try {
      // Remove any markdown code blocks if present
      const cleanResponse = aiResponse
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim()
      console.log("[v0] Cleaned response:", cleanResponse.substring(0, 200))
      parsedRFP = JSON.parse(cleanResponse)
    } catch (parseError) {
      console.error("[v0] Parse Error:", parseError)
      return NextResponse.json(
        { error: "Failed to parse AI response. Please try rephrasing your request.", raw: aiResponse },
        { status: 500 },
      )
    }

    // Create the RFP object
    const newRFP: RFP = {
      id: generateId(),
      title: parsedRFP.title || "Untitled RFP",
      description: parsedRFP.description || "",
      budget: parsedRFP.budget,
      currency: parsedRFP.currency || "USD",
      delivery_timeline_days: parsedRFP.delivery_timeline_days,
      items: parsedRFP.items || [],
      payment_terms: parsedRFP.payment_terms,
      warranty: parsedRFP.warranty,
      created_at: new Date().toISOString(),
      status: "draft",
    }

    db.rfps.push(newRFP)
    console.log("[v0] RFP created successfully:", newRFP.id)

    return NextResponse.json(newRFP, { status: 201 })
  } catch (error) {
    console.error("[v0] Unexpected error creating RFP from text:", error)
    return NextResponse.json({ error: "Failed to create RFP. Please try again." }, { status: 500 })
  }
}
