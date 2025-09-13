'use client'

import React, { useState } from 'react'
import { VendorWithDistance } from '../types/vendor'
import { User } from '../types/user'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  Euro,
  Filter,
  Search,
  SortAsc,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

interface VendorListProps {
  vendors: VendorWithDistance[]
  user: User
  recommendedVendors: VendorWithDistance[]
  onContact: (vendor: VendorWithDistance) => void
}

export default function VendorList({ 
  vendors, 
  user, 
  recommendedVendors, 
  onContact 
}: VendorListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'price'>('distance')
  const [filterBy, setFilterBy] = useState<'all' | 'recommended' | 'available' | 'verified'>('all')

  // Filter and sort vendors
  const filteredVendors = vendors
    .filter(vendor => {
      const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           vendor.services.some(service => 
                             service.toLowerCase().includes(searchTerm.toLowerCase())
                           )
      
      let matchesFilter = true
      switch (filterBy) {
        case 'recommended':
          matchesFilter = recommendedVendors.some(rec => rec.id === vendor.id)
          break
        case 'available':
          matchesFilter = vendor.availability === 'available'
          break
        case 'verified':
          matchesFilter = vendor.verified
          break
        default:
          matchesFilter = true
      }
      
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return (a.distance || 0) - (b.distance || 0)
        case 'rating':
          return (b.rating || 0) - (a.rating || 0)
        case 'price':
          return (a.pricing.hourly || 0) - (b.pricing.hourly || 0)
        default:
          return 0
      }
    })

  const getAvailabilityIcon = (availability: string) => {
    switch (availability) {
      case 'available':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'busy':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case 'unavailable':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'Available'
      case 'busy':
        return 'Busy'
      case 'unavailable':
        return 'Unavailable'
      default:
        return 'Unknown'
    }
  }

  const formatPricing = (vendor: VendorWithDistance) => {
    if (vendor.pricing.hourly) {
      return `${vendor.pricing.currency}${vendor.pricing.hourly}/hr`
    }
    if (vendor.pricing.daily) {
      return `${vendor.pricing.currency}${vendor.pricing.daily}/day`
    }
    if (vendor.pricing.project) {
      return `${vendor.pricing.currency}${vendor.pricing.project}/project`
    }
    return 'Contact for pricing'
  }

  const isRecommended = (vendor: VendorWithDistance) => {
    return recommendedVendors.some(rec => rec.id === vendor.id)
  }

  const isWithinRange = (vendor: VendorWithDistance) => {
    return (vendor.distance || 0) <= (user.preferences?.maxDistance || 50)
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search vendors or services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter and Sort Controls */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as 'all' | 'recommended' | 'available' | 'verified')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Vendors</option>
                <option value="recommended">Recommended</option>
                <option value="available">Available</option>
                <option value="verified">Verified</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <SortAsc className="w-4 h-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'distance' | 'rating' | 'price')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="distance">Sort by Distance</option>
                <option value="rating">Sort by Rating</option>
                <option value="price">Sort by Price</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-600">
            Showing {filteredVendors.length} of {vendors.length} vendors
          </div>
        </CardContent>
      </Card>

      {/* Vendor List */}
      <div className="grid gap-6">
        {filteredVendors.map((vendor) => (
          <Card 
            key={vendor.id} 
            className={`transition-all duration-200 hover:shadow-lg ${
              isRecommended(vendor) ? 'ring-2 ring-blue-200 bg-blue-50/30' : ''
            } ${!isWithinRange(vendor) ? 'opacity-75' : ''}`}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-lg">{vendor.name}</CardTitle>
                    {vendor.verified && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Verified
                      </Badge>
                    )}
                    {isRecommended(vendor) && (
                      <Badge variant="default" className="bg-blue-100 text-blue-800">
                        Recommended
                      </Badge>
                    )}
                    {!isWithinRange(vendor) && (
                      <Badge variant="outline" className="text-orange-600 border-orange-300">
                        Out of Range
                      </Badge>
                    )}
                  </div>
                  
                  <CardDescription className="text-base">
                    {vendor.description}
                  </CardDescription>
                </div>

                <div className="flex items-center gap-2">
                  {getAvailabilityIcon(vendor.availability)}
                  <span className="text-sm text-gray-600">
                    {getAvailabilityText(vendor.availability)}
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Services */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Services</h4>
                <div className="flex flex-wrap gap-2">
                  {vendor.services.map((service, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Pricing</h4>
                <div className="flex items-center gap-2 text-lg font-semibold text-green-600">
                  <Euro className="w-4 h-4" />
                  {formatPricing(vendor)}
                </div>
              </div>

              {/* Location and Distance */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">
                    {vendor.location.city}, {vendor.location.country}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {vendor.distance ? `${vendor.distance.toFixed(1)} km away` : 'Distance unknown'}
                </div>
              </div>

              {/* Rating */}
              {vendor.rating && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(vendor.rating!) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {vendor.rating.toFixed(1)} ({vendor.reviewCount} reviews)
                  </span>
                </div>
              )}

              {/* Experience and Specialties */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Experience</h4>
                  <p className="text-sm text-gray-600">{vendor.experience} years</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Specialties</h4>
                  <div className="flex flex-wrap gap-1">
                    {vendor.specialties.slice(0, 3).map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                    {vendor.specialties.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{vendor.specialties.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-700 mb-2">Contact</h4>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${vendor.contact.email}`} className="hover:text-blue-600">
                      {vendor.contact.email}
                    </a>
                  </div>
                  {vendor.contact.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <a href={`tel:${vendor.contact.phone}`} className="hover:text-blue-600">
                        {vendor.contact.phone}
                      </a>
                    </div>
                  )}
                  {vendor.contact.website && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Globe className="w-4 h-4" />
                      <a 
                        href={vendor.contact.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-blue-600"
                      >
                        Website
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  onClick={() => onContact(vendor)}
                  className="flex-1"
                  disabled={vendor.availability === 'unavailable'}
                >
                  Contact Vendor
                </Button>
                <Button variant="outline" className="flex-1">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredVendors.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No vendors found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or filters to find more vendors.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
