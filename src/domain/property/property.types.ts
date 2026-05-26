import type { PropertyExperiences } from "@/domain/experiences/experiences.types"

export interface PropertyAddress {
  id: string
  propertyId: string
  street: string
  number: string
  complement: string | null
  neighborhood: string
  city: string
  state: string
  postalCode: string
}

export interface PropertyOperational {
  id: string
  propertyId: string
  wifiNetwork: string
  wifiPassword: string
  isSelfCheckin: boolean
  propertyAccessType: string
  propertyAccessInstructions: string
  propertyPassword: string
  hasParkingSpot: boolean
  parkingSpotIdentifier: string | null
  parkingSpotInstructions: string | null
}

export interface PropertyRules {
  id: string
  propertyId: string
  checkInTime: string
  checkOutTime: string
  allowPet: boolean
  smokingPermitted: boolean
  suitableForChildren: boolean
  suitableForBabies: boolean
  eventsPermitted: boolean
}

export interface PropertyAmenities {
  id: string
  propertyId: string
  wifi: boolean
  tv: boolean
  airConditioning: boolean
  kitchen: boolean
  washingMachine: boolean
  elevator: boolean
  balcony: boolean
  bbqGrill: boolean
  dishwasher: boolean
  pool: boolean
}

export interface PropertyHost {
  id: string
  propertyId: string
  name: string
  phone: string
}

export interface PropertyBase {
  id: string
  code: string
  name: string
  propertyType: string
  bedroomQty: number
  bathroomQty: number
  guestCapacity: number
  images: string[]
  createdAt: Date
  updatedAt: Date
}

export interface PropertyWithRelations extends PropertyBase {
  address: PropertyAddress | null
  operational: PropertyOperational | null
  rules: PropertyRules | null
  amenities: PropertyAmenities | null
  host: PropertyHost | null
  experiences: PropertyExperiences | null
}
