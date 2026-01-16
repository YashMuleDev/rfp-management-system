import { createGoogleGenerativeAI } from '@ai-sdk/google'

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY

if (!apiKey) {
  console.error('[AI Config] GOOGLE_GENERATIVE_AI_API_KEY is not set!')
} else {
  console.log('[AI Config] API Key loaded:', apiKey.substring(0, 10) + '...')
}

const google = createGoogleGenerativeAI({
  apiKey: apiKey,
})

export const geminiModel = google('gemini-1.5-flash-latest')
