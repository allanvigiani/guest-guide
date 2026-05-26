import { prisma } from "@/lib/prisma"
import type { PropertyWithRelations } from "./property.types"

export async function findPropertyByCode(code: string): Promise<PropertyWithRelations | null> {
  return prisma.property.findUnique({
    where: { code },
    include: {
      address: true,
      operational: true,
      rules: true,
      amenities: true,
      host: true,
      experiences: true,
    },
  }) as Promise<PropertyWithRelations | null>
}
