import { describe, it, expect, vi, beforeEach } from "vitest"
import { findAllProperties, findPropertyByCode } from "./property.repository"
import { prisma } from "@/lib/prisma"

vi.mock("@/lib/prisma", () => ({
  prisma: {
    property: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}))

const mockProperty = { id: "prop-1", code: "FLN001", name: "Florianópolis Apt" } as any

describe("findAllProperties", () => {
  beforeEach(() => vi.clearAllMocks())

  it("returns all properties ordered by createdAt asc", async () => {
    vi.mocked(prisma.property.findMany).mockResolvedValue([mockProperty])
    const result = await findAllProperties()
    expect(result).toEqual([mockProperty])
    expect(prisma.property.findMany).toHaveBeenCalledWith({
      include: expect.objectContaining({
        address: true,
        operational: true,
        rules: true,
        amenities: true,
        host: true,
        experiences: true,
      }),
      orderBy: { createdAt: "asc" },
    })
  })
})

describe("findPropertyByCode", () => {
  beforeEach(() => vi.clearAllMocks())

  it("returns property when code matches", async () => {
    vi.mocked(prisma.property.findUnique).mockResolvedValue(mockProperty)
    const result = await findPropertyByCode("FLN001")
    expect(result).toBe(mockProperty)
    expect(prisma.property.findUnique).toHaveBeenCalledWith({
      where: { code: "FLN001" },
      include: expect.objectContaining({ address: true, host: true }),
    })
  })

  it("returns null when no property matches", async () => {
    vi.mocked(prisma.property.findUnique).mockResolvedValue(null)
    const result = await findPropertyByCode("UNKNOWN")
    expect(result).toBeNull()
  })
})
