/**
 * Map utility functions for positioning vendors around user location
 */

import { Vendor, VendorWithDistance } from '../types/vendor'
import { User } from '../types/user'

export interface Coordinates {
  lat: number
  lng: number
}

export interface MapPosition {
  x: number
  y: number
  angle: number
  distance: number
}

/**
 * Calculate the bearing (direction) from user to vendor
 * @param userCoords - User coordinates
 * @param vendorCoords - Vendor coordinates
 * @returns Bearing in degrees (0-360)
 */
export function calculateBearing(userCoords: Coordinates, vendorCoords: Coordinates): number {
  const userLat = toRadians(userCoords.lat)
  const userLng = toRadians(userCoords.lng)
  const vendorLat = toRadians(vendorCoords.lat)
  const vendorLng = toRadians(vendorCoords.lng)

  const dLng = vendorLng - userLng

  const y = Math.sin(dLng) * Math.cos(vendorLat)
  const x = Math.cos(userLat) * Math.sin(vendorLat) -
            Math.sin(userLat) * Math.cos(vendorLat) * Math.cos(dLng)

  let bearing = toDegrees(Math.atan2(y, x))

  // Normalize to 0-360
  bearing = (bearing + 360) % 360

  return bearing
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Convert radians to degrees
 */
function toDegrees(radians: number): number {
  return radians * (180 / Math.PI)
}

/**
 * Calculate map positions for vendors around user
 * @param user - User object with coordinates
 * @param vendors - Array of vendors with distances
 * @param mapRadius - Radius of the map in pixels
 * @returns Array of vendors with map positions
 */
export function calculateMapPositions(
  user: User,
  vendors: VendorWithDistance[],
  mapRadius: number = 300
): (VendorWithDistance & MapPosition)[] {
  if (!user.location?.coordinates) {
    return vendors.map(vendor => ({
      ...vendor,
      x: 0,
      y: 0,
      angle: 0,
      distance: 0
    }))
  }

  const maxDistance = Math.max(...vendors.map(v => v.distance || 0))

  return vendors.map(vendor => {
    const distance = vendor.distance || 0
    const bearing = calculateBearing(user.location.coordinates!, vendor.location.coordinates)

    // Scale distance to fit within map radius
    const scaledDistance = (distance / maxDistance) * mapRadius * 0.8

    // Convert polar coordinates to Cartesian
    const angle = toRadians(bearing - 90) // -90 to align North with top
    const x = Math.cos(angle) * scaledDistance
    const y = Math.sin(angle) * scaledDistance

    return {
      ...vendor,
      x,
      y,
      angle: bearing,
      distance
    }
  })
}

/**
 * Get compass direction from bearing
 * @param bearing - Bearing in degrees
 * @returns Compass direction string
 */
export function getCompassDirection(bearing: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const index = Math.round(bearing / 45) % 8
  return directions[index]
}

/**
 * Calculate distance scale for map legend
 * @param maxDistance - Maximum distance in kilometers
 * @returns Array of scale values
 */
export function getDistanceScale(maxDistance: number): number[] {
  const scales = []
  const step = maxDistance / 4

  for (let i = 1; i <= 4; i++) {
    scales.push(Math.round(step * i))
  }

  return scales
}

/**
 * Get vendor color based on distance and user preferences
 * @param vendor - Vendor with distance
 * @param userMaxDistance - User's maximum preferred distance
 * @returns CSS color class
 */
export function getVendorColor(vendor: VendorWithDistance, userMaxDistance: number): string {
  const distance = vendor.distance || 0

  if (distance <= userMaxDistance * 0.3) {
    return 'text-green-600 bg-green-100' // Very close
  } else if (distance <= userMaxDistance * 0.6) {
    return 'text-blue-600 bg-blue-100' // Close
  } else if (distance <= userMaxDistance) {
    return 'text-orange-600 bg-orange-100' // Within range
  } else {
    return 'text-gray-600 bg-gray-100' // Out of range
  }
}

/**
 * Format distance for display
 * @param distance - Distance in kilometers
 * @returns Formatted distance string
 */
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`
  } else if (distance < 10) {
    return `${distance.toFixed(1)}km`
  } else {
    return `${Math.round(distance)}km`
  }
}

/**
 * Format pricing for display
 * @param vendor - Vendor object
 * @returns Formatted pricing string
 */
export function formatPricing(vendor: Vendor): string {
  if (vendor.pricing.hourly) {
    return `${vendor.pricing.currency}${vendor.pricing.hourly}/hr`
  } else if (vendor.pricing.daily) {
    return `${vendor.pricing.currency}${vendor.pricing.daily}/day`
  } else if (vendor.pricing.project) {
    return `${vendor.pricing.currency}${vendor.pricing.project}/project`
  } else {
    return 'Contact for pricing'
  }
}
