import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import Anthropic from "@anthropic-ai/sdk"
import { getOrGenerateExperiences, ExperiencesGenerationError } from "./experiences.service"
import { findExperiencesByPropertyId, upsertExperiences } from "./experiences.repository"
import { aiClient } from "@/lib/ai"

vi.mock("./experiences.repository", () => ({
  findExperiencesByPropertyId: vi.fn(),
  upsertExperiences: vi.fn(),
}))

vi.mock("@/lib/ai", () => ({
  aiClient: {
    messages: {
      create: vi.fn(),
    },
  },
}))

vi.mock("@/lib/env", () => ({
  env: { AI_MODEL: "claude-test" },
}))

const mockProperty = { id: "prop-1", name: "Test Property", address: { city: "Florianópolis" } } as any

const mockExperiences = {
  id: "exp-1",
  propertyId: "prop-1",
  welcomeMessage: "Bem-vindo!",
  restaurants: [],
  attractions: [],
  essentials: [],
  seasonalTip: "Aproveite o verão.",
  generatedAt: new Date(),
}

const validAIData = {
  welcomeMessage: "Bem-vindo ao seu refúgio!",
  restaurants: [{ name: "Café Central", distance: "200m", description: "Ótimo" }],
  attractions: [{ name: "Praia", distance: "1km", description: "Linda" }],
  essentials: [{ name: "Farmácia", type: "pharmacy", distance: "100m", description: "24h" }],
  seasonalTip: "Verão quente.",
}

function makeAPIError(status: number): Anthropic.APIError {
  const err = Object.create(Anthropic.APIError.prototype) as Anthropic.APIError
  Object.assign(err, { status, message: `HTTP ${status}`, name: "APIError" })
  return err
}

describe("getOrGenerateExperiences", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("returns cached experiences after 2s delay without calling AI", async () => {
    vi.mocked(findExperiencesByPropertyId).mockResolvedValue(mockExperiences)

    const promise = getOrGenerateExperiences(mockProperty)
    await vi.advanceTimersByTimeAsync(2000)
    const result = await promise

    expect(result).toBe(mockExperiences)
    expect(aiClient.messages.create).not.toHaveBeenCalled()
  })

  it("generates, upserts and returns experiences when not cached", async () => {
    vi.mocked(findExperiencesByPropertyId).mockResolvedValue(null)
    vi.mocked(aiClient.messages.create).mockResolvedValue({
      content: [{ type: "text", text: JSON.stringify(validAIData) }],
    } as any)
    vi.mocked(upsertExperiences).mockResolvedValue({ ...mockExperiences, ...validAIData })

    const result = await getOrGenerateExperiences(mockProperty)

    expect(aiClient.messages.create).toHaveBeenCalledOnce()
    expect(upsertExperiences).toHaveBeenCalledWith("prop-1", validAIData)
    expect(result.welcomeMessage).toBe(validAIData.welcomeMessage)
  })

  it("throws ExperiencesGenerationError when AI returns non-text content block", async () => {
    vi.mocked(findExperiencesByPropertyId).mockResolvedValue(null)
    vi.mocked(aiClient.messages.create).mockResolvedValue({
      content: [{ type: "tool_use", id: "tool-1", name: "foo", input: {} }],
    } as any)

    await expect(getOrGenerateExperiences(mockProperty)).rejects.toBeInstanceOf(
      ExperiencesGenerationError
    )
  })

  it("throws ExperiencesGenerationError with statusCode 502 on AI 5xx error", async () => {
    vi.mocked(findExperiencesByPropertyId).mockResolvedValue(null)
    vi.mocked(aiClient.messages.create).mockRejectedValue(makeAPIError(500))

    await expect(getOrGenerateExperiences(mockProperty)).rejects.toMatchObject({
      name: "ExperiencesGenerationError",
      statusCode: 502,
    })
  })

  it("throws ExperiencesGenerationError with statusCode 503 on AI 4xx error", async () => {
    vi.mocked(findExperiencesByPropertyId).mockResolvedValue(null)
    vi.mocked(aiClient.messages.create).mockRejectedValue(makeAPIError(429))

    await expect(getOrGenerateExperiences(mockProperty)).rejects.toMatchObject({
      name: "ExperiencesGenerationError",
      statusCode: 503,
    })
  })

  it("throws ExperiencesGenerationError on generic network error", async () => {
    vi.mocked(findExperiencesByPropertyId).mockResolvedValue(null)
    vi.mocked(aiClient.messages.create).mockRejectedValue(new Error("Network failure"))

    await expect(getOrGenerateExperiences(mockProperty)).rejects.toBeInstanceOf(
      ExperiencesGenerationError
    )
  })

  it("throws ExperiencesGenerationError with statusCode 500 when AI returns invalid JSON", async () => {
    vi.mocked(findExperiencesByPropertyId).mockResolvedValue(null)
    vi.mocked(aiClient.messages.create).mockResolvedValue({
      content: [{ type: "text", text: "não é json válido" }],
    } as any)

    await expect(getOrGenerateExperiences(mockProperty)).rejects.toMatchObject({
      name: "ExperiencesGenerationError",
      statusCode: 500,
    })
  })
})

describe("ExperiencesGenerationError", () => {
  it("has correct name and default statusCode", () => {
    const err = new ExperiencesGenerationError("algo deu errado")
    expect(err.name).toBe("ExperiencesGenerationError")
    expect(err.message).toBe("algo deu errado")
    expect(err.statusCode).toBe(502)
  })

  it("accepts custom statusCode and cause", () => {
    const cause = new Error("raiz")
    const err = new ExperiencesGenerationError("falha", cause, 500)
    expect(err.statusCode).toBe(500)
    expect(err.cause).toBe(cause)
  })
})
