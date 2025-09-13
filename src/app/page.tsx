import React from 'react'
import VendorDirectory from '../components/VendorDirectory'
import { sampleUser, sampleVendors } from '../data/sampleData'

export default function HomePage() {
  return (
    <VendorDirectory user={sampleUser} vendors={sampleVendors} />
  )
}

