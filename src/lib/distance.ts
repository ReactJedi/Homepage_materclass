/**
 * Utility functions for calculating distances between geographic coordinates
 */

import { Vendor, VendorWithDistance } from '../types/vendor'
import { User } from '../types/user'

export interface Coordinates {
  lat: number
  lng: number
}

/**
 * Calculate the distance between two points using the Haversine formula
 * @param coord1 - First coordinate point
 * @param coord2 - Second coordinate point
 * @returns Distance in kilometers
 */
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = toRadians(coord2.lat - coord1.lat)
  const dLng = toRadians(coord2.lng - coord1.lng)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.lat)) * Math.cos(toRadians(coord2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return Math.round(distance * 100) / 100 // Round to 2 decimal places
}

/**
 * Convert degrees to radians
 * @param degrees - Angle in degrees
 * @returns Angle in radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Calculate distances from user to all vendors
 * @param user - User object with coordinates
 * @param vendors - Array of vendor objects
 * @returns Array of vendors with calculated distances
 */
export function calculateVendorDistances(user: User, vendors: Vendor[]): VendorWithDistance[] {
  if (!user.location?.coordinates) {
    return vendors.map(vendor => ({ ...vendor, distance: undefined }))
  }

  return vendors.map(vendor => ({
    ...vendor,
    distance: calculateDistance(user.location.coordinates!, vendor.location.coordinates)
  }))
}

/**
 * Filter vendors by maximum distance from user
 * @param vendors - Array of vendors with distances
 * @param maxDistance - Maximum distance in kilometers
 * @returns Filtered array of vendors within the specified distance
 */
export function filterVendorsByDistance(vendors: VendorWithDistance[], maxDistance: number): VendorWithDistance[] {
  return vendors.filter(vendor => (vendor.distance || 0) <= maxDistance)
}

/**
 * Sort vendors by distance (closest first)
 * @param vendors - Array of vendors with distances
 * @returns Sorted array of vendors
 */
export function sortVendorsByDistance(vendors: VendorWithDistance[]): VendorWithDistance[] {
  return [...vendors].sort((a, b) => (a.distance || 0) - (b.distance || 0))
}

/**
 * Get vendors within user's preferred distance and budget range
 * @param user - User object with preferences
 * @param vendors - Array of vendor objects
 * @returns Filtered and sorted vendors matching user preferences
 */
export function getRecommendedVendors(user: User, vendors: Vendor[]): VendorWithDistance[] {
  // Calculate distances for all vendors
  const vendorsWithDistances = calculateVendorDistances(user, vendors)

  // Filter by distance and budget
  const filteredVendors = vendorsWithDistances.filter(vendor => {
    const distanceOk = (vendor.distance || 0) <= user.preferences.maxDistance
    
    // Check if vendor has hourly pricing within budget
    const priceOk = vendor.pricing.hourly 
      ? vendor.pricing.hourly >= user.preferences.budgetRange.min && 
        vendor.pricing.hourly <= user.preferences.budgetRange.max
      : true // If no hourly pricing, include anyway

    return distanceOk && priceOk
  })

  // Sort by distance
  return sortVendorsByDistance(filteredVendors)
}

/**
 * Format distance for display
 * @param distance - Distance in kilometers
 * @returns Formatted distance string
 */
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  } else if (distance < 10) {
    return `${distance.toFixed(1)}km`;
  } else {
    return `${Math.round(distance)}km`;
  }
}
