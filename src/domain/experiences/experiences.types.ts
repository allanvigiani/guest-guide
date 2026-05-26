export interface Restaurant {
  name: string
  distance: string
  description: string
}

export interface Attraction {
  name: string
  distance: string
  description: string
}

export interface Essential {
  name: string
  type: string
  distance: string
  description: string
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
