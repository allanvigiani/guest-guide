import { prisma } from "@/lib/prisma"
import type { PropertyWithRelations } from "./property.types"

const PROPERTY_INCLUDE = {
  address: true,
  operational: true,
  rules: true,
  amenities: true,
  host: true,
  experiences: true,
} as const

export async function findAllProperties(): Promise<PropertyWithRelations[]> {
  return prisma.property.findMany({
    include: PROPERTY_INCLUDE,
    orderBy: { createdAt: "asc" },
  }) as Promise<PropertyWithRelations[]>
}

export async function findPropertyByCode(code: string): Promise<PropertyWithRelations | null> {
  return prisma.property.findUnique({
    where: { code },
    include: PROPERTY_INCLUDE,
  }) as Promise<PropertyWithRelations | null>
}
