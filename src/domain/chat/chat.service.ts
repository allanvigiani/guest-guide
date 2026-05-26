import type { MessageParam } from "@anthropic-ai/sdk/resources/messages"
import { env } from "@/lib/env"
import { buildAssistantPrompt } from "@/lib/prompts/assistant.prompt"
import type { PropertyWithRelations } from "@/domain/property/property.types"
import type { PropertyExperiences } from "@/domain/experiences/experiences.types"

export interface ChatPayload {
  model: string
  max_tokens: number
  stream: true
  system: string
  messages: MessageParam[]
}

export function buildChatPayload(
  messages: MessageParam[],
  property: PropertyWithRelations,
  experiences: PropertyExperiences | null
): ChatPayload {
  return {
    model: env.AI_MODEL,
    max_tokens: 1024,
    stream: true,
    system: buildAssistantPrompt(property, experiences),
    messages,
  }
}
