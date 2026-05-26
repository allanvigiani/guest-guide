import { describe, it, expect, vi } from "vitest"
import { buildChatPayload } from "./chat.service"
import { buildAssistantPrompt } from "@/lib/prompts/assistant.prompt"

vi.mock("@/lib/env", () => ({
  env: { AI_MODEL: "claude-test" },
}))

vi.mock("@/lib/prompts/assistant.prompt", () => ({
  buildAssistantPrompt: vi.fn(() => "system prompt gerado"),
}))

const mockProperty = { id: "prop-1", name: "Test Property" } as any
const mockExperiences = { id: "exp-1", propertyId: "prop-1" } as any
const messages = [{ role: "user" as const, content: "Olá!" }]

describe("buildChatPayload", () => {
  it("returns correct payload shape", () => {
    const payload = buildChatPayload(messages, mockProperty, mockExperiences)
    expect(payload).toEqual({
      model: "claude-test",
      max_tokens: 1024,
      stream: true,
      system: "system prompt gerado",
      messages,
    })
  })

  it("passes property and experiences to buildAssistantPrompt", () => {
    buildChatPayload(messages, mockProperty, mockExperiences)
    expect(vi.mocked(buildAssistantPrompt)).toHaveBeenCalledWith(mockProperty, mockExperiences)
  })

  it("accepts null experiences", () => {
    const payload = buildChatPayload(messages, mockProperty, null)
    expect(payload.stream).toBe(true)
    expect(vi.mocked(buildAssistantPrompt)).toHaveBeenCalledWith(mockProperty, null)
  })
})
