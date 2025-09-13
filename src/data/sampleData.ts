import { Vendor } from '../types/vendor'
import { User } from '../types/user'

export const sampleUser: User = {
  id: 'user_001',
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  location: {
    address: '123 Main Street',
    city: 'Darmstadt',
    state: 'Hesse',
    country: 'Germany',
    postalCode: '64289',
    coordinates: {
      lat: 49.8728,
      lng: 8.6512
    }
  },
  preferences: {
    maxDistance: 50,
    preferredServices: ['Web Development', 'Software Development', 'Digital Marketing'],
    budgetRange: {
      min: 50,
      max: 200,
      currency: 'EUR'
    },
    language: 'de',
    timezone: 'Europe/Berlin'
  },
  subscription: {
    plan: 'premium',
    status: 'active',
    expiresAt: new Date('2024-12-31T23:59:59Z')
  },
  tenantId: 'tenant_001',
  lastLogin: new Date('2024-01-15T10:30:00Z'),
  createdAt: new Date('2023-06-01T00:00:00Z'),
  updatedAt: new Date('2024-01-15T10:30:00Z')
}

export const sampleVendors: Vendor[] = [
  {
    id: 'vendor_001',
    name: 'TechSolutions GmbH',
    description: 'Professional web development and software solutions',
    services: ['Web Development', 'Software Development', 'Mobile Apps'],
    pricing: {
      hourly: 75,
      daily: 600,
      project: 5000,
      currency: 'EUR'
    },
    location: {
      address: 'Tech Park 15',
      city: 'Darmstadt',
      state: 'Hesse',
      country: 'Germany',
      postalCode: '64289',
      coordinates: {
        lat: 49.8728,
        lng: 8.6512
      }
    },
    contact: {
      email: 'contact@techsolutions.de',
      phone: '+49 6151 123456',
      website: 'https://techsolutions.de'
    },
    rating: 4.8,
    reviewCount: 127,
    availability: 'available',
    specialties: ['React', 'Node.js', 'Python'],
    experience: 8,
    verified: true,
    tenantId: 'tenant_001',
    createdAt: new Date('2023-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z')
  },
  {
    id: 'vendor_002',
    name: 'Digital Marketing Pro',
    description: 'Full-service digital marketing agency',
    services: ['Digital Marketing', 'SEO', 'Social Media'],
    pricing: {
      hourly: 65,
      daily: 520,
      currency: 'EUR'
    },
    location: {
      address: 'Marketing Street 42',
      city: 'Frankfurt',
      state: 'Hesse',
      country: 'Germany',
      postalCode: '60311',
      coordinates: {
        lat: 50.1109,
        lng: 8.6821
      }
    },
    contact: {
      email: 'hello@digitalmarketingpro.de',
      phone: '+49 69 987654',
      website: 'https://digitalmarketingpro.de'
    },
    rating: 4.6,
    reviewCount: 89,
    availability: 'available',
    specialties: ['Google Ads', 'Facebook Ads', 'Content Marketing'],
    experience: 6,
    verified: true,
    tenantId: 'tenant_001',
    createdAt: new Date('2023-03-01T00:00:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z')
  },
  {
    id: 'vendor_003',
    name: 'Creative Design Studio',
    description: 'UI/UX design and creative services',
    services: ['UI/UX Design', 'Graphic Design', 'Branding'],
    pricing: {
      hourly: 55,
      daily: 440,
      project: 3000,
      currency: 'EUR'
    },
    location: {
      address: 'Design Avenue 7',
      city: 'Mannheim',
      state: 'Baden-Württemberg',
      country: 'Germany',
      postalCode: '68159',
      coordinates: {
        lat: 49.4875,
        lng: 8.4662
      }
    },
    contact: {
      email: 'studio@creativedesign.de',
      phone: '+49 621 456789',
      website: 'https://creativedesign.de'
    },
    rating: 4.9,
    reviewCount: 156,
    availability: 'busy',
    specialties: ['Figma', 'Adobe Creative Suite', 'Prototyping'],
    experience: 10,
    verified: true,
    tenantId: 'tenant_001',
    createdAt: new Date('2022-08-01T00:00:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z')
  },
  {
    id: 'vendor_004',
    name: 'Cloud Infrastructure Experts',
    description: 'Cloud computing and DevOps solutions',
    services: ['Cloud Computing', 'DevOps', 'Infrastructure'],
    pricing: {
      hourly: 85,
      daily: 680,
      project: 8000,
      currency: 'EUR'
    },
    location: {
      address: 'Cloud Tower 23',
      city: 'Heidelberg',
      state: 'Baden-Württemberg',
      country: 'Germany',
      postalCode: '69117',
      coordinates: {
        lat: 49.3988,
        lng: 8.6724
      }
    },
    contact: {
      email: 'info@cloudinfra.de',
      phone: '+49 6221 789012',
      website: 'https://cloudinfra.de'
    },
    rating: 4.7,
    reviewCount: 94,
    availability: 'available',
    specialties: ['AWS', 'Docker', 'Kubernetes'],
    experience: 7,
    verified: true,
    tenantId: 'tenant_001',
    createdAt: new Date('2023-05-01T00:00:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z')
  },
  {
    id: 'vendor_005',
    name: 'Data Analytics Solutions',
    description: 'Big data and analytics consulting',
    services: ['Data Analytics', 'Business Intelligence', 'Machine Learning'],
    pricing: {
      hourly: 95,
      daily: 760,
      project: 12000,
      currency: 'EUR'
    },
    location: {
      address: 'Data Center 5',
      city: 'Karlsruhe',
      state: 'Baden-Württemberg',
      country: 'Germany',
      postalCode: '76131',
      coordinates: {
        lat: 49.0069,
        lng: 8.4037
      }
    },
    contact: {
      email: 'analytics@datasolutions.de',
      phone: '+49 721 234567',
      website: 'https://datasolutions.de'
    },
    rating: 4.5,
    reviewCount: 67,
    availability: 'available',
    specialties: ['Python', 'R', 'Tableau'],
    experience: 9,
    verified: true,
    tenantId: 'tenant_001',
    createdAt: new Date('2023-02-01T00:00:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z')
  }
]

