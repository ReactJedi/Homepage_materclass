export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  imageUrl?: string
  location: {
    address?: string
    city?: string
    state?: string
    country?: string
    postalCode?: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  preferences: {
    maxDistance: number
    preferredServices: string[]
    budgetRange: {
      min: number
      max: number
      currency: string
    }
    language: string
    timezone: string
  }
  subscription: {
    plan: 'free' | 'basic' | 'premium'
    status: 'active' | 'inactive' | 'cancelled'
    expiresAt?: Date
  }
  tenantId?: string
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

export interface ClerkUser {
  id: string
  email: string
  firstName?: string
  lastName?: string
  imageUrl?: string
  createdAt: Date
  updatedAt: Date
}

