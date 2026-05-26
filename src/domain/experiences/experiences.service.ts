import Anthropic from "@anthropic-ai/sdk"
import { aiClient } from "@/lib/ai"
import { env } from "@/lib/env"
import { EXPERIENCES_SYSTEM_PROMPT } from "@/lib/prompts/experiences.prompt"
import {
  findExperiencesByPropertyId,
  upsertExperiences,
} from "./experiences.repository"
import type { PropertyWithRelations } from "@/domain/property/property.types"
import type { PropertyExperiences, ExperiencesData } from "./experiences.types"

export class ExperiencesGenerationError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
    public readonly statusCode = 502
  ) {
    super(message)
    this.name = "ExperiencesGenerationError"
  }
}

export async function getOrGenerateExperiences(
  property: PropertyWithRelations
): Promise<PropertyExperiences> {
  const cached = await findExperiencesByPropertyId(property.id)
  if (cached) {
    await new Promise(resolve => setTimeout(resolve, 2000))
    return cached
  }

  let rawText: string
  try {
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
      throw new ExperiencesGenerationError("Unexpected non-text response from AI")
    }

    rawText = firstBlock.text
  } catch (err) {
    if (err instanceof ExperiencesGenerationError) {
      throw err
    }

    if (err instanceof Anthropic.APIError) {
      throw new ExperiencesGenerationError(
        `AI API error (${err.status}): ${err.message}`,
        err,
        err.status >= 500 ? 502 : 503
      )
    }

    throw new ExperiencesGenerationError("Failed to reach AI service", err)
  }

  let data: ExperiencesData
  try {
    data = JSON.parse(rawText) as ExperiencesData
  } catch {
    throw new ExperiencesGenerationError(
      `AI returned invalid JSON: ${rawText.slice(0, 200)}`,
      undefined,
      500
    )
  }

  return upsertExperiences(property.id, data)
}
