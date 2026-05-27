import { prisma } from "@/lib/prisma"
import type { PropertyExperiences } from "@/domain/property/property.types"
import type { ExperiencesData } from "./experiences.types"

function mapRow(row: {
  id: string
  propertyId: string
  welcomeMessage: string
  restaurants: unknown
  attractions: unknown
  essentials: unknown
  seasonalTip: string
  generatedAt: Date
}): PropertyExperiences {
  return {
    id: row.id,
    propertyId: row.propertyId,
    welcomeMessage: row.welcomeMessage,
    restaurants: row.restaurants as PropertyExperiences["restaurants"],
    attractions: row.attractions as PropertyExperiences["attractions"],
    essentials: row.essentials as PropertyExperiences["essentials"],
    seasonalTip: row.seasonalTip,
    generatedAt: row.generatedAt,
  }
}

export async function findExperiencesByPropertyId(
  propertyId: string
): Promise<PropertyExperiences | null> {
  const row = await prisma.experiences.findUnique({ where: { propertyId } })
  if (!row) return null
  return mapRow(row)
}

export async function upsertExperiences(
  propertyId: string,
  data: ExperiencesData
): Promise<PropertyExperiences> {
  const payload = {
    propertyId,
    welcomeMessage: data.welcomeMessage,
    restaurants: data.restaurants,
    attractions: data.attractions,
    essentials: data.essentials,
    seasonalTip: data.seasonalTip,
  }
  const row = await prisma.experiences.upsert({
    where: { propertyId },
    create: payload,
    update: payload,
  })
  return mapRow(row)
}
