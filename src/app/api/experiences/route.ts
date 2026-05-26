import { NextRequest, NextResponse } from "next/server"
import { findPropertyByCode } from "@/domain/property/property.repository"
import {
  getOrGenerateExperiences,
  ExperiencesGenerationError,
} from "@/domain/experiences/experiences.service"

export async function GET(request: NextRequest) {
  const propertyCode = request.nextUrl.searchParams.get("propertyCode")

  if (!propertyCode) {
    return NextResponse.json({ error: "propertyCode is required" }, { status: 400 })
  }

  const property = await findPropertyByCode(propertyCode)
  if (!property) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 })
  }

  try {
    const experiences = await getOrGenerateExperiences(property)
    return NextResponse.json(experiences)
  } catch (err) {
    if (err instanceof ExperiencesGenerationError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
