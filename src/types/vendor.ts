export interface Vendor {
  id: string
  name: string
  description?: string
  services: string[]
  pricing: {
    hourly?: number
    daily?: number
    project?: number
    currency: string
  }
  location: {
    address: string
    city: string
    state?: string
    country: string
    postalCode: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  contact: {
    email: string
    phone?: string
    website?: string
  }
  rating?: number
  reviewCount?: number
  availability: 'available' | 'busy' | 'unavailable'
  specialties: string[]
  experience: number // years
  verified: boolean
  tenantId: string
  createdAt: Date
  updatedAt: Date
}

export interface VendorWithDistance extends Vendor {
  distance?: number
  angle?: number
  mapPosition?: {
    x: number
    y: number
  }
}

