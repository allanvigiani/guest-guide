import Anthropic from "@anthropic-ai/sdk"
import { env } from "@/lib/env"

const globalForAI = global as unknown as { aiClient: Anthropic }

export const aiClient =
  globalForAI.aiClient ?? new Anthropic({ apiKey: env.AI_API_KEY })

if (process.env.NODE_ENV !== "production") globalForAI.aiClient = aiClient
