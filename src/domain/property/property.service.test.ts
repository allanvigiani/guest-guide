import { describe, it, expect, vi, beforeEach } from "vitest"
import { getPropertyByCode } from "./property.service"
import { findPropertyByCode } from "./property.repository"

vi.mock("./property.repository", () => ({
  findPropertyByCode: vi.fn(),
}))

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NOT_FOUND")
  }),
}))

const mockProperty = {
  id: "prop-1",
  code: "FLN001",
  name: "Florianópolis Apt",
} as any

describe("getPropertyByCode", () => {
  beforeEach(() => vi.clearAllMocks())

  it("returns property when found", async () => {
    vi.mocked(findPropertyByCode).mockResolvedValue(mockProperty)
    const result = await getPropertyByCode("FLN001")
    expect(result).toBe(mockProperty)
    expect(findPropertyByCode).toHaveBeenCalledWith("FLN001")
  })

  it("calls notFound when property does not exist", async () => {
    vi.mocked(findPropertyByCode).mockResolvedValue(null)
    await expect(getPropertyByCode("INVALID")).rejects.toThrow("NOT_FOUND")
  })
})
