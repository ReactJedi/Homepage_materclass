'use client'

import React from 'react'
import { VendorWithDistance } from '../types/vendor'
import { User } from '../types/user'
import { formatDistance, formatPricing } from '../lib/mapUtils'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Star, MapPin, Clock, DollarSign, CheckCircle, XCircle } from 'lucide-react'

interface VendorCardProps {
  vendor: VendorWithDistance
  user: User
  isRecommended?: boolean
  onContact?: (vendor: VendorWithDistance) => void
}

export default function VendorCard({ vendor, user, isRecommended = false, onContact }: VendorCardProps) {
  const isWithinRange = (vendor.distance || 0) <= (user.preferences?.maxDistance || 50)
  const isInBudget = vendor.pricing.hourly 
    ? vendor.pricing.hourly >= user.preferences.budgetRange.min && 
      vendor.pricing.hourly <= user.preferences.budgetRange.max
    : true

  const getStatusColor = () => {
    if (vendor.availability === 'available') return 'text-green-600 bg-green-100'
    if (vendor.availability === 'busy') return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getStatusIcon = () => {
    if (vendor.availability === 'available') return <CheckCircle className="w-4 h-4" />
    if (vendor.availability === 'busy') return <Clock className="w-4 h-4" />
    return <XCircle className="w-4 h-4" />
  }

  return (
    <Card className={`h-full transition-all duration-200 hover:shadow-lg ${
      isRecommended 
        ? 'border-green-200 bg-green-50/50' 
        : isWithinRange 
        ? 'border-blue-200 bg-blue-50/50' 
        : 'border-gray-200'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              {vendor.name}
              {vendor.verified && (
                <CheckCircle className="w-5 h-5 text-blue-600" />
              )}
            </CardTitle>
            <CardDescription className="text-gray-600 mt-1">
              {vendor.description || `${vendor.services.join(', ')} services`}
            </CardDescription>
          </div>
          
          {/* Status Badge */}
          <Badge className={`${getStatusColor()} flex items-center gap-1`}>
            {getStatusIcon()}
            {vendor.availability}
          </Badge>
        </div>

        {/* Rating */}
        {vendor.rating && (
          <div className="flex items-center gap-1 mt-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(vendor.rating!) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-1">
              {vendor.rating.toFixed(1)} ({vendor.reviewCount || 0} reviews)
            </span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Services */}
        <div className="flex flex-wrap gap-1">
          {vendor.services.slice(0, 3).map((service, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {service}
            </Badge>
          ))}
          {vendor.services.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{vendor.services.length - 3} more
            </Badge>
          )}
        </div>

        {/* Pricing */}
        <div className="flex items-center gap-2 text-gray-700">
          <DollarSign className="w-4 h-4" />
          <span className="font-medium">{formatPricing(vendor)}</span>
        </div>

        {/* Location & Distance */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{vendor.location.city}, {vendor.location.country}</span>
          </div>
          <Badge variant={isWithinRange ? "default" : "secondary"} className="text-xs">
            {formatDistance(vendor.distance || 0)}
          </Badge>
        </div>

        {/* Experience & Specialties */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{vendor.experience} years experience</span>
          <div className="flex items-center gap-1">
            {vendor.specialties.slice(0, 2).map((specialty, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <Button 
          className={`w-full ${
            isRecommended 
              ? 'bg-green-600 hover:bg-green-700' 
              : isWithinRange && isInBudget
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
          disabled={!isWithinRange || !isInBudget}
          onClick={() => onContact?.(vendor)}
        >
          {isRecommended ? 'Contact Recommended Vendor' : 
           isWithinRange ? 'Contact Vendor' : 'Out of Range'}
        </Button>
      </CardFooter>

      {/* Recommended Badge */}
      {isRecommended && (
        <div className="absolute top-2 right-2">
          <Badge className="bg-green-600 text-white text-xs">
            Recommended
          </Badge>
        </div>
      )}
    </Card>
  )
}

