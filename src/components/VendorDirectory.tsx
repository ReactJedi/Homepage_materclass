'use client'

import React, { useState } from 'react'
import { Vendor, VendorWithDistance } from '../types/vendor'
import { User } from '../types/user'
import { calculateVendorDistances, getRecommendedVendors } from '../lib/distance'
import VendorMap from './VendorMap'
import VendorList from './VendorList'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Map, List, User as UserIcon } from 'lucide-react'

interface VendorDirectoryProps {
  user: User
  vendors: Vendor[]
}

export default function VendorDirectory({ user, vendors }: VendorDirectoryProps) {
  const [activeTab, setActiveTab] = useState('map')
  const [showUserProfile, setShowUserProfile] = useState(false)

  // Calculate distances and get recommended vendors
  const vendorsWithDistances = calculateVendorDistances(user, vendors)
  const recommendedVendors = getRecommendedVendors(user, vendors)

  const handleContactVendor = (vendor: VendorWithDistance) => {
    // This would integrate with the multi-serv contact system
    console.log('Contacting vendor:', vendor.name)
    // You could open a modal, navigate to contact page, etc.
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Vendor Directory</h1>
              <p className="text-sm sm:text-base text-gray-600">Find and connect with service providers near you</p>
            </div>
            
            <div className="flex items-center space-x-4 w-full sm:w-auto justify-end">
              <Button
                variant="outline"
                onClick={() => setShowUserProfile(!showUserProfile)}
                className="flex items-center gap-2 text-sm"
              >
                <UserIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Profile Section */}
        {showUserProfile && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                Your Profile
              </CardTitle>
              <CardDescription>
                Manage your preferences and location settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-700">Contact Info</h3>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-gray-600">{user.firstName} {user.lastName}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-700">Location</h3>
                  <p className="text-gray-600">
                    {user.location?.city}, {user.location?.country}
                  </p>
                  <p className="text-gray-600">
                    Max Distance: {user.preferences.maxDistance}km
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-700">Preferences</h3>
                  <p className="text-gray-600">
                    Budget: {user.preferences.budgetRange.currency}{user.preferences.budgetRange.min}-{user.preferences.budgetRange.max}/hr
                  </p>
                  <p className="text-gray-600">
                    Plan: {user.subscription.plan}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="map" className="flex items-center gap-2 text-sm">
              <Map className="w-4 h-4" />
              <span className="hidden sm:inline">Map View</span>
              <span className="sm:hidden">Map</span>
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2 text-sm">
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">List View</span>
              <span className="sm:hidden">List</span>
            </TabsTrigger>
          </TabsList>

          {/* Map Tab */}
          <TabsContent value="map" className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Vendor Proximity Map
              </h2>
              <VendorMap user={user} vendors={vendors} />
            </div>
          </TabsContent>

          {/* List Tab */}
          <TabsContent value="list" className="space-y-6">
            <VendorList
              vendors={vendorsWithDistances}
              user={user}
              recommendedVendors={recommendedVendors}
              onContact={handleContactVendor}
            />
          </TabsContent>
        </Tabs>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="text-lg sm:text-2xl font-bold text-blue-600">{vendors.length}</div>
              <div className="text-xs sm:text-sm text-gray-600">Total Vendors</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="text-lg sm:text-2xl font-bold text-green-600">{recommendedVendors.length}</div>
              <div className="text-xs sm:text-sm text-gray-600">Recommended</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="text-lg sm:text-2xl font-bold text-orange-600">
                {vendorsWithDistances.length > 0 
                  ? Math.round(Math.min(...vendorsWithDistances.map(v => v.distance || 0)))
                  : 0}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Closest (km)</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="text-lg sm:text-2xl font-bold text-purple-600">
                {vendorsWithDistances.length > 0 
                  ? Math.round(Math.max(...vendorsWithDistances.map(v => v.distance || 0)))
                  : 0}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Farthest (km)</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

