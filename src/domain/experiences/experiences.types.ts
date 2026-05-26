export interface Place {
  name: string
  distance: string
  description: string
}

export type Restaurant = Place
export type Attraction = Place

export interface Essential extends Place {
  type: string
}

export interface ExperiencesData {
  welcomeMessage: string
  restaurants: Restaurant[]
  attractions: Attraction[]
  essentials: Essential[]
  seasonalTip: string
}

export interface PropertyExperiences extends ExperiencesData {
  id: string
  propertyId: string
  generatedAt: Date
}
