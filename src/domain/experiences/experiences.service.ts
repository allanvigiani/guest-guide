import Anthropic from "@anthropic-ai/sdk"
import { aiClient } from "@/lib/ai"
import { env } from "@/lib/env"
import { EXPERIENCES_SYSTEM_PROMPT } from "./experiences.prompt"
import {
  findExperiencesByPropertyId,
  upsertExperiences,
} from "./experiences.repository"
import type { PropertyWithRelations, PropertyExperiences } from "@/domain/property/property.types"
import type { ExperiencesData } from "./experiences.types"

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
    const userContent = `Generate a guest guide for this property:\n${JSON.stringify(property, null, 2)}`
    const messages: Anthropic.MessageParam[] = [{ role: "user", content: userContent }]

    let message = await aiClient.messages.create({
      model: env.AI_MODEL,
      max_tokens: 4096,
      system: EXPERIENCES_SYSTEM_PROMPT,
      tools: [{ type: "web_search_20250305" as const, name: "web_search" }],
      messages,
    })

    while (message.stop_reason === "pause_turn") {
      messages.push({ role: "assistant", content: message.content })
      message = await aiClient.messages.create({
        model: env.AI_MODEL,
        max_tokens: 2048,
        system: EXPERIENCES_SYSTEM_PROMPT,
        tools: [{ type: "web_search_20250305" as const, name: "web_search" }],
        messages,
      })
    }

    const textBlock = message.content.findLast(b => b.type === "text")

    if (!textBlock || textBlock.type !== "text") {
      throw new ExperiencesGenerationError("Unexpected non-text response from AI")
    }

    const extractedJSON = textBlock.text.match(/\{[\s\S]*\}/)
    if (extractedJSON) {
      rawText = extractedJSON[0]
    } else {
      messages.push({ role: "assistant", content: message.content })
      messages.push({
        role: "user",
        content: "Return ONLY the JSON object now. No introduction, no explanation, no markdown.",
      })
      const retry = await aiClient.messages.create({
        model: env.AI_MODEL,
        max_tokens: 2048,
        system: EXPERIENCES_SYSTEM_PROMPT,
        messages,
      })
      const retryBlock = retry.content.findLast(b => b.type === "text")
      if (!retryBlock || retryBlock.type !== "text") {
        throw new ExperiencesGenerationError("AI failed to return JSON after retry")
      }
      rawText = (retryBlock.text.match(/\{[\s\S]*\}/) ?? [retryBlock.text])[0]
    }
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

  rawText = rawText.replace(/<cite[^>]*>([\s\S]*?)<\/cite>/g, "$1")

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
