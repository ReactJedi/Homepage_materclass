'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { 
  calculateMapPositions, 
  getCompassDirection, 
  getDistanceScale, 
  formatDistance,
  formatPricing
} from '../lib/mapUtils'
import { calculateVendorDistances } from '../lib/distance'
import { Vendor } from '../types/vendor'
import { User } from '../types/user'

interface VendorMapProps {
  user: User
  vendors: Vendor[]
}

export default function VendorMap({ user, vendors }: VendorMapProps) {
  const [zoom, setZoom] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })

  const vendorsWithDistances = calculateVendorDistances(user, vendors)
  const mapPositions = calculateMapPositions(user, vendorsWithDistances, 300 * zoom)
  const maxDistance = vendorsWithDistances.length > 0 
    ? Math.max(...vendorsWithDistances.map(v => v.distance || 0))
    : 50 // Default max distance if no vendors
  const distanceScales = getDistanceScale(maxDistance)

  // Refs for GSAP animations
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const vendorMarkersRef = useRef<HTMLDivElement[]>([])
  const userMarkerRef = useRef<HTMLDivElement>(null)
  const connectionLinesRef = useRef<SVGLineElement[]>([])
  const distanceRingsRef = useRef<HTMLDivElement[]>([])

  // Initialize GSAP animations on component mount
  useEffect(() => {
    if (mapContainerRef.current) {
      // Animate map container entrance
      gsap.fromTo(mapContainerRef.current, 
        { 
          opacity: 0, 
          scale: 0.95,
          y: 20
        },
        { 
          opacity: 1, 
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out"
        }
      )

      // Animate user marker
      if (userMarkerRef.current) {
        gsap.fromTo(userMarkerRef.current,
          {
            scale: 0,
            rotation: 180
          },
          {
            scale: 1,
            rotation: 0,
            duration: 1,
            ease: "back.out(1.7)",
            delay: 0.3
          }
        )
      }
    }
  }, [])

  // Animate vendor markers when they change
  useEffect(() => {
    vendorMarkersRef.current.forEach((marker, index) => {
      if (marker) {
        gsap.fromTo(marker,
          {
            opacity: 0,
            scale: 0,
            y: -20
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.6,
            ease: "back.out(1.7)",
            delay: index * 0.1 + 0.5
          }
        )
      }
    })

    // Animate connection lines
    connectionLinesRef.current.forEach((line, index) => {
      if (line) {
        gsap.fromTo(line,
          {
            scaleX: 0,
            transformOrigin: "0% 50%"
          },
          {
            scaleX: 1,
            duration: 0.8,
            ease: "power2.out",
            delay: index * 0.05 + 0.8
          }
        )
      }
    })

    // Animate distance rings
    distanceRingsRef.current.forEach((ring, index) => {
      if (ring) {
        gsap.fromTo(ring,
          {
            scale: 0,
            opacity: 0
          },
          {
            scale: 1,
            opacity: 0.2,
            duration: 1,
            ease: "power2.out",
            delay: index * 0.1 + 1
          }
        )
      }
    })
  }, [vendors])

  // Animate zoom changes
  useEffect(() => {
    const animateZoom = () => {
      vendorMarkersRef.current.forEach(marker => {
        if (marker) {
          gsap.to(marker, {
            scale: zoom,
            duration: 0.3,
            ease: "power2.out"
          })
        }
      })

      connectionLinesRef.current.forEach(line => {
        if (line) {
          gsap.to(line, {
            strokeWidth: 1 / zoom,
            duration: 0.3,
            ease: "power2.out"
          })
        }
      })

      distanceRingsRef.current.forEach((ring, index) => {
        if (ring) {
          const ratio = [0.25, 0.5, 0.75, 1][index]
          gsap.to(ring, {
            width: `${(ratio * 300 * 1.6 * zoom)}px`,
            height: `${(ratio * 300 * 1.6 * zoom)}px`,
            duration: 0.3,
            ease: "power2.out"
          })
        }
      })
    }

    animateZoom()
  }, [zoom])

  // Animate pan changes
  useEffect(() => {
    const animatePan = () => {
      vendorMarkersRef.current.forEach(marker => {
        if (marker) {
          gsap.to(marker, {
            x: panOffset.x,
            y: panOffset.y,
            duration: 0.2,
            ease: "power2.out"
          })
        }
      })

      if (userMarkerRef.current) {
        gsap.to(userMarkerRef.current, {
          x: panOffset.x,
          y: panOffset.y,
          duration: 0.2,
          ease: "power2.out"
        })
      }

      connectionLinesRef.current.forEach(line => {
        if (line) {
          gsap.to(line, {
            x: panOffset.x,
            y: panOffset.y,
            duration: 0.2,
            ease: "power2.out"
          })
        }
      })
    }

    animatePan()
  }, [panOffset])

  // Zoom functions with smooth animations
  const handleZoomIn = useCallback(() => {
    const newZoom = Math.min(zoom * 1.2, 5)
    setZoom(newZoom)
    
    // Add a subtle bounce effect
    if (mapContainerRef.current) {
      gsap.to(mapContainerRef.current, {
        scale: 1.02,
        duration: 0.1,
        ease: "power2.out",
        yoyo: true,
        repeat: 1
      })
    }
  }, [zoom])

  const handleZoomOut = useCallback(() => {
    const newZoom = Math.max(zoom / 1.2, 0.3)
    setZoom(newZoom)
    
    // Add a subtle bounce effect
    if (mapContainerRef.current) {
      gsap.to(mapContainerRef.current, {
        scale: 0.98,
        duration: 0.1,
        ease: "power2.out",
        yoyo: true,
        repeat: 1
      })
    }
  }, [zoom])

  const handleZoomReset = useCallback(() => {
    // Animate zoom and pan reset
    gsap.to({ zoom: zoom, x: panOffset.x, y: panOffset.y }, {
      zoom: 1,
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "power2.out",
      onUpdate: function() {
        setZoom(this.targets()[0].zoom)
        setPanOffset({ x: this.targets()[0].x, y: this.targets()[0].y })
      }
    })
  }, [zoom, panOffset])


  useEffect(() => {
    const container = mapContainerRef.current
    if (!container) return

    const handleWheelEvent = (e: WheelEvent) => {
      e.preventDefault()
      e.stopPropagation()
      e.stopImmediatePropagation()
      
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      setZoom(prev => Math.max(Math.min(prev * delta, 5), 0.3))
    }

    container.addEventListener('wheel', handleWheelEvent, { passive: false })
    
    return () => {
      container.removeEventListener('wheel', handleWheelEvent)
    }
  }, [])

  // Pan functionality
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y })
  }, [panOffset])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }, [isDragging, dragStart])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Touch events for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0]
      setIsDragging(true)
      setDragStart({ x: touch.clientX - panOffset.x, y: touch.clientY - panOffset.y })
    }
  }, [panOffset])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      const touch = e.touches[0]
      setPanOffset({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      })
    }
  }, [isDragging, dragStart])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Vendor marker hover animations
  const handleVendorHover = useCallback((index: number, isHovering: boolean) => {
    const marker = vendorMarkersRef.current[index]
    if (marker) {
      if (isHovering) {
        gsap.to(marker, {
          scale: zoom * 1.2,
          duration: 0.2,
          ease: "power2.out"
        })
      } else {
        gsap.to(marker, {
          scale: zoom,
          duration: 0.2,
          ease: "power2.out"
        })
      }
    }
  }, [zoom])

  return (
    <div 
      className="bg-white rounded-lg shadow-lg p-3 sm:p-6"
      onWheel={(e) => e.preventDefault()}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
          Vendor Proximity Map
        </h3>
        
        {/* Zoom Controls */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 font-bold transition-colors"
            title="Zoom Out"
          >
            −
          </button>
            <span className="text-sm text-gray-600 min-w-[50px] sm:min-w-[60px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 font-bold transition-colors"
            title="Zoom In"
          >
            +
          </button>
          </div>
          <button
            onClick={handleZoomReset}
            className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs rounded-lg transition-colors"
            title="Reset View"
          >
            Reset
          </button>
        </div>
      </div>
      
      {/* Map Container */}
      <div 
        className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border-2 border-gray-200 overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ 
          overscrollBehavior: 'none',
          touchAction: 'none',
          userSelect: 'none'
        }}
        ref={mapContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Compass Rose */}
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full shadow-md flex items-center justify-center z-10">
          <div className="text-xs font-bold text-gray-700">N</div>
        </div>
        
        {/* Distance Scale */}
        <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-white rounded-lg p-2 sm:p-3 shadow-md z-10">
          <div className="text-xs font-semibold text-gray-700 mb-1 sm:mb-2">Distance Scale</div>
          <div className="space-y-1">
            {distanceScales.slice(0, 3).map((scale, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                  style={{
                    backgroundColor: `hsl(${200 + index * 40}, 70%, ${60 + index * 10}%)`,
                    width: `${(scale / maxDistance) * 20 * zoom}px`,
                    height: `${(scale / maxDistance) * 20 * zoom}px`
                  }}
                ></div>
                <span className="text-xs text-gray-600 hidden sm:inline">{scale}km</span>
              </div>
            ))}
          </div>
        </div>

        {/* User Center - Moves with the map */}
        <div 
          ref={userMarkerRef}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
          style={{
            left: '50%',
            top: '50%'
          }}
        >
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-500 rounded-full border-2 sm:border-4 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-200">
            <span className="text-white text-xs font-bold">U</span>
          </div>
          <div className="text-xs text-gray-700 text-center mt-1 font-medium hidden sm:block">
            You ({user.location?.city || 'Unknown'})
          </div>
        </div>

        {/* Vendor Markers - Scale with zoom and pan */}
        {mapPositions.map((vendor, index) => (
          <div
            key={vendor.id}
            ref={(el) => {
              if (el) vendorMarkersRef.current[index] = el
            }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
            style={{
              left: `calc(50% + ${vendor.x}px)`,
              top: `calc(50% + ${vendor.y}px)`
            }}
          >
            {/* Vendor Dot */}
            <div 
              className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white shadow-md transition-all duration-200 ${
              vendor.distance && vendor.distance <= (user.preferences?.maxDistance || 50) 
                ? 'bg-green-500' 
                : 'bg-gray-400'
              }`}
              onMouseEnter={() => handleVendorHover(index, true)}
              onMouseLeave={() => handleVendorHover(index, false)}
            ></div>
            
            {/* Vendor Label */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="bg-white rounded-lg shadow-lg p-2 sm:p-3 border border-gray-200 min-w-[150px] sm:min-w-[200px] max-w-[250px] z-30">
                <div className="text-sm font-semibold text-gray-800 mb-1">
                  {vendor.name}
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div><span className="font-medium">Services:</span> {vendor.services.slice(0, 2).join(', ')}</div>
                  <div><span className="font-medium">Pricing:</span> {formatPricing(vendor)}</div>
                  <div><span className="font-medium">Distance:</span> {formatDistance(vendor.distance || 0)}</div>
                  <div className="hidden sm:block"><span className="font-medium">Direction:</span> {getCompassDirection(vendor.angle || 0)}</div>
                  <div><span className="font-medium">Location:</span> {vendor.location.city}, {vendor.location.country}</div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Connection Lines - Scale with zoom and pan */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {mapPositions.map((vendor, index) => (
            <line
              key={`line-${vendor.id}`}
              ref={(el) => {
                if (el) connectionLinesRef.current[index] = el
              }}
              x1="50%"
              y1="50%"
              x2={`calc(50% + ${vendor.x}px)`}
              y2={`calc(50% + ${vendor.y}px)`}
              stroke={vendor.distance && vendor.distance <= (user.preferences?.maxDistance || 50) ? "#10b981" : "#9ca3af"}
              strokeWidth={1}
              strokeDasharray="3,3"
              opacity="0.3"
            />
          ))}
        </svg>

        {/* Distance Rings - Scale with zoom */}
        {[0.25, 0.5, 0.75, 1].map((ratio, index) => (
          <div
            key={index}
            ref={(el) => {
              if (el) distanceRingsRef.current[index] = el
            }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-300"
            style={{
              width: `${(ratio * 300 * 1.6)}px`,
              height: `${(ratio * 300 * 1.6)}px`
            }}
          ></div>
        ))}

        {/* Zoom Instructions */}
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-white/90 rounded-lg p-2 text-xs text-gray-600 z-10">
          <div className="hidden sm:block">🖱️ Scroll to zoom</div>
          <div className="hidden sm:block">🖱️ Drag to pan</div>
          <div className="sm:hidden">👆 Pinch to zoom</div>
          <div className="sm:hidden">👆 Drag to pan</div>
        </div>
      </div>

      {/* Map Legend */}
      <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-xs sm:text-sm text-gray-700">Your Location</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-xs sm:text-sm text-gray-700">Within Range</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
          <span className="text-xs sm:text-sm text-gray-700">Out of Range</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-xs sm:text-sm text-gray-700">Recommended</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-center">
        <div className="bg-blue-50 rounded-lg p-2 sm:p-3">
          <div className="text-base sm:text-lg font-bold text-blue-600">{vendorsWithDistances.length}</div>
          <div className="text-xs text-blue-600">Total Vendors</div>
        </div>
        <div className="bg-green-50 rounded-lg p-2 sm:p-3">
          <div className="text-base sm:text-lg font-bold text-green-600">
            {vendorsWithDistances.filter(v => (v.distance || 0) <= (user.preferences?.maxDistance || 50)).length}
          </div>
          <div className="text-xs text-green-600">Within Range</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-2 sm:p-3">
          <div className="text-base sm:text-lg font-bold text-orange-600">
            {Math.round(Math.min(...vendorsWithDistances.map(v => v.distance || 0)))}
          </div>
          <div className="text-xs text-orange-600">Closest (km)</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-2 sm:p-3">
          <div className="text-base sm:text-lg font-bold text-purple-600">
            {Math.round(Math.max(...vendorsWithDistances.map(v => v.distance || 0)))}
          </div>
          <div className="text-xs text-purple-600">Farthest (km)</div>
        </div>
      </div>
    </div>
  )
}
