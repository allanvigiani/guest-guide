import { describe, it, expect, vi, beforeEach } from "vitest"
import { findExperiencesByPropertyId, upsertExperiences } from "./experiences.repository"
import { prisma } from "@/lib/prisma"

vi.mock("@/lib/prisma", () => ({
  prisma: {
    experiences: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
  },
}))

const mockRow = {
  id: "exp-1",
  propertyId: "prop-1",
  welcomeMessage: "Bem-vindo!",
  restaurants: [{ name: "Café Central", distance: "200m", description: "Ótimo café" }],
  attractions: [{ name: "Praia da Joaquina", distance: "3km", description: "Bela praia" }],
  essentials: [{ name: "Farmácia Nissei", type: "pharmacy", distance: "100m", description: "24h" }],
  seasonalTip: "Verão quente, use protetor solar.",
  generatedAt: new Date("2024-06-01"),
}

const mockData = {
  welcomeMessage: mockRow.welcomeMessage,
  restaurants: mockRow.restaurants as any,
  attractions: mockRow.attractions as any,
  essentials: mockRow.essentials as any,
  seasonalTip: mockRow.seasonalTip,
}

describe("findExperiencesByPropertyId", () => {
  beforeEach(() => vi.clearAllMocks())

  it("returns null when no record exists", async () => {
    vi.mocked(prisma.experiences.findUnique).mockResolvedValue(null)
    const result = await findExperiencesByPropertyId("prop-1")
    expect(result).toBeNull()
  })

  it("returns mapped experiences when record exists", async () => {
    vi.mocked(prisma.experiences.findUnique).mockResolvedValue(mockRow)
    const result = await findExperiencesByPropertyId("prop-1")
    expect(result).toEqual({
      id: mockRow.id,
      propertyId: mockRow.propertyId,
      welcomeMessage: mockRow.welcomeMessage,
      restaurants: mockRow.restaurants,
      attractions: mockRow.attractions,
      essentials: mockRow.essentials,
      seasonalTip: mockRow.seasonalTip,
      generatedAt: mockRow.generatedAt,
    })
  })
})

describe("upsertExperiences", () => {
  beforeEach(() => vi.clearAllMocks())

  it("calls upsert with correct payload and returns mapped row", async () => {
    vi.mocked(prisma.experiences.upsert).mockResolvedValue(mockRow)

    const result = await upsertExperiences("prop-1", mockData)

    expect(prisma.experiences.upsert).toHaveBeenCalledWith({
      where: { propertyId: "prop-1" },
      create: expect.objectContaining({ propertyId: "prop-1", welcomeMessage: "Bem-vindo!" }),
      update: expect.objectContaining({ propertyId: "prop-1", welcomeMessage: "Bem-vindo!" }),
    })
    expect(result.id).toBe(mockRow.id)
    expect(result.generatedAt).toBe(mockRow.generatedAt)
  })
})
