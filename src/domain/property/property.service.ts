import { notFound } from "next/navigation"
import { findPropertyByCode } from "./property.repository"
import type { PropertyWithRelations } from "./property.types"

export async function getPropertyByCode(code: string): Promise<PropertyWithRelations> {
  const property = await findPropertyByCode(code)
  if (!property) notFound()
  return property
}
