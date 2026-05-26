import { aiClient } from "@/lib/ai"
import { env } from "@/lib/env"
import { EXPERIENCES_SYSTEM_PROMPT } from "@/lib/prompts/experiences.prompt"
import {
  findExperiencesByPropertyId,
  createExperiences,
} from "./experiences.repository"
import type { PropertyWithRelations } from "@/domain/property/property.types"
import type { PropertyExperiences, ExperiencesData } from "./experiences.types"

export async function getOrGenerateExperiences(
  property: PropertyWithRelations
): Promise<PropertyExperiences> {
  const cached = await findExperiencesByPropertyId(property.id)
  if (cached) return cached

  const message = await aiClient.messages.create({
    model: env.AI_MODEL,
    max_tokens: 2048,
    system: EXPERIENCES_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Generate a guest guide for this property:\n${JSON.stringify(property, null, 2)}`,
      },
    ],
  })

  const firstBlock = message.content[0]
  if (firstBlock.type !== "text") {
    throw new Error("Unexpected non-text response from AI client")
  }

  let data: ExperiencesData
  try {
    data = JSON.parse(firstBlock.text) as ExperiencesData
  } catch {
    throw new Error(`AI returned invalid JSON: ${firstBlock.text.slice(0, 200)}`)
  }
  return createExperiences(property.id, data)
}
