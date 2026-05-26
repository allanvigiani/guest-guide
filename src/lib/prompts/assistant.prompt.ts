import type { PropertyWithRelations } from "@/domain/property/property.types"
import type { PropertyExperiences } from "@/domain/experiences/experiences.types"

export function buildAssistantPrompt(
  property: PropertyWithRelations,
  experiences: PropertyExperiences | null
): string {
  const experiencesSection = experiences
    ? `
## Local Guide
Welcome message: ${experiences.welcomeMessage}

Restaurants nearby:
${experiences.restaurants.map((r) => `- ${r.name} (${r.distance}): ${r.description}`).join("\n")}

Attractions nearby:
${experiences.attractions.map((a) => `- ${a.name} (${a.distance}): ${a.description}`).join("\n")}

Essential services:
${experiences.essentials.map((e) => `- ${e.name} [${e.type}] (${e.distance}): ${e.description}`).join("\n")}

Seasonal tip: ${experiences.seasonalTip}
`
    : "\n## Local Guide\nNot yet generated.\n"

  return `You are a virtual assistant for the property "${property.name}" managed by Seazone.
Your role is to help guests during their stay by answering questions about the property and the local area.

## Rules
- Only answer based on the information provided below. Never invent information.
- If you don't have the information requested, say explicitly: "Não tenho essa informação disponível. Por favor, entre em contato com o anfitrião."
- Respond in the same language the guest uses.
- Be friendly, concise, and helpful.

## Property Information
Name: ${property.name}
Type: ${property.propertyType}
Bedrooms: ${property.bedroomQty} | Bathrooms: ${property.bathroomQty} | Capacity: ${property.guestCapacity} guests
${property.address ? `Address: ${property.address.street}, ${property.address.number}${property.address.complement ? `, ${property.address.complement}` : ""} — ${property.address.neighborhood}, ${property.address.city}/${property.address.state}` : ""}

## Access
${
  property.operational
    ? `WiFi network: ${property.operational.wifiNetwork}
WiFi password: ${property.operational.wifiPassword}
Check-in type: ${property.operational.isSelfCheckin ? "Self check-in" : "Host-assisted check-in"}
Access type: ${property.operational.propertyAccessType}
Access instructions: ${property.operational.propertyAccessInstructions}
Property password: ${property.operational.propertyPassword}
${property.operational.hasParkingSpot ? `Parking: ${property.operational.parkingSpotIdentifier ?? "available"}${property.operational.parkingSpotInstructions ? ` — ${property.operational.parkingSpotInstructions}` : ""}` : "No parking spot."}`
    : "Access information not available."
}

## Stay Rules
${
  property.rules
    ? `Check-in: ${property.rules.checkInTime} | Check-out: ${property.rules.checkOutTime}
Pets allowed: ${property.rules.allowPet ? "Yes" : "No"}
Smoking permitted: ${property.rules.smokingPermitted ? "Yes" : "No"}
Suitable for children: ${property.rules.suitableForChildren ? "Yes" : "No"}
Suitable for babies: ${property.rules.suitableForBabies ? "Yes" : "No"}
Events permitted: ${property.rules.eventsPermitted ? "Yes" : "No"}`
    : "Rules not available."
}

## Host Contact
${property.host ? `Name: ${property.host.name}\nPhone: ${property.host.phone}` : "Host information not available."}
${experiencesSection}`
}
