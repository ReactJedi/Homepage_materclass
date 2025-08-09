'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const websiteSections = [
  { name: 'About Us', description: 'Learn about our story', color: 'bg-blue-500', href: '/about' },
  { name: 'Services', description: 'What we offer', color: 'bg-green-500', href: '/services' },
  { name: 'Portfolio', description: 'Our work showcase', color: 'bg-purple-500', href: '/portfolio' },
  { name: 'Contact', description: 'Get in touch', color: 'bg-orange-500', href: '/contact' },
  { name: 'Blog', description: 'Latest insights', color: 'bg-pink-500', href: '/blog' },
  { name: 'Team', description: 'Meet our experts', color: 'bg-indigo-500', href: '/team' },
  { name: 'Pricing', description: 'Our plans', color: 'bg-teal-500', href: '/pricing' },
  { name: 'FAQ', description: 'Common questions', color: 'bg-red-500', href: '/faq' }
]

export default function HomePage() {
  const wheelRef = useRef<HTMLDivElement>(null)
  const centerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!wheelRef.current) return

    // Create the wheel segments
    const wheel = wheelRef.current
    const segmentCount = websiteSections.length
    const angleStep = 360 / segmentCount
    const radius = 120 // Distance from center

    // Clear existing content
    wheel.innerHTML = ''

    websiteSections.forEach((section, index) => {
      const segment = document.createElement('div')
      const angle = index * angleStep
      
      // Calculate position using trigonometry
      const x = Math.cos((angle - 90) * Math.PI / 180) * radius
      const y = Math.sin((angle - 90) * Math.PI / 180) * radius

      segment.className = `absolute w-28 h-28 ${section.color} rounded-full flex items-center justify-center text-white font-bold text-xs text-center cursor-pointer wheel-segment shadow-lg hover:shadow-xl`
      segment.style.left = `calc(50% + ${x}px - 56px)` // 56px = w-28/2
      segment.style.top = `calc(50% + ${y}px - 56px)` // 56px = h-28/2
      segment.innerHTML = `
        <div class="transform" style="transform: rotate(${-angle}deg)">
          <div class="font-semibold leading-tight">${section.name}</div>
          <div class="text-xs opacity-80 leading-tight">${section.description}</div>
        </div>
      `

      // Add click event for navigation
      segment.addEventListener('click', () => {
        // Add click animation
        gsap.to(segment, {
          scale: 1.2,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: 'power2.out'
        })
        
        // Navigate to section (you can replace with actual navigation)
        console.log(`Navigating to ${section.href}`)
        // window.location.href = section.href
      })

      wheel.appendChild(segment)
    })

    // Continuous rotation animation
    const tl = gsap.timeline({ repeat: -1 })
    tl.to(wheel, {
      rotation: 360,
      duration: 60, // 60 seconds for one full rotation
      ease: 'none'
    })

    // Add hover effects for segments
    const segments = wheel.querySelectorAll('div')
    segments.forEach(segment => {
      segment.addEventListener('mouseenter', () => {
        gsap.to(segment, {
          scale: 1.1,
          duration: 0.3,
          ease: 'power2.out'
        })
      })

      segment.addEventListener('mouseleave', () => {
        gsap.to(segment, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        })
      })
    })

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-8">
      {/* Header */}
      <div className="text-center mb-12 z-10">
        <h1 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent gradient-text">
          Welcome to Our Universe
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Spin the wheel of fortune to discover the different sections of our website. 
          Each segment holds a new adventure waiting to be explored.
        </p>
      </div>

      {/* Wheel of Fortune Container */}
      <div className="relative mb-16">
        {/* Center point */}
        <div 
          ref={centerRef}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full z-20 wheel-center"
        />
        
        {/* Wheel */}
        <div 
          ref={wheelRef}
          className="relative w-80 h-80 wheel-container"
        />
        
        {/* Outer rings */}
        <div className="absolute top-0 left-0 w-80 h-80 border-4 border-purple-400/30 rounded-full outer-ring" />
        <div className="absolute top-2 left-2 w-76 h-76 border-2 border-pink-400/20 rounded-full outer-ring" />
      </div>

      {/* Instructions */}
      <Card className="max-w-md bg-white/10 backdrop-blur-sm border-white/20 text-white">
        <CardHeader>
          <CardTitle className="text-center">How to Use</CardTitle>
          <CardDescription className="text-center text-gray-300">
            Click on any segment to navigate to that section
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-gray-300 mb-4">
            The wheel rotates continuously, creating an engaging experience. 
            Hover over segments to see them highlight, and click to explore!
          </p>
          <Button 
            variant="outline" 
            className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white transition-all duration-300"
            onClick={() => {
              if (wheelRef.current) {
                gsap.to(wheelRef.current, {
                  rotation: '+=180',
                  duration: 2,
                  ease: 'power2.inOut'
                })
              }
            }}
          >
            Give it a Spin!
          </Button>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="mt-12 text-center text-gray-400">
        <p>Built with Next.js, GSAP, and shadcn/ui</p>
      </div>
    </div>
  )
}
