'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const websiteSections = [
  { name: 'About Us', description: 'Learn about our story', color: 'bg-blue-500', href: '/about', distance: 280 },
  { name: 'Services', description: 'What we offer', color: 'bg-green-500', href: '/services', distance: 320 },
  { name: 'Portfolio', description: 'Our work showcase', color: 'bg-purple-500', href: '/portfolio', distance: 240 },
  { name: 'Contact', description: 'Get in touch', color: 'bg-orange-500', href: '/contact', distance: 360 },
  { name: 'Blog', description: 'Latest insights', color: 'bg-pink-500', href: '/blog', distance: 200 },
  { name: 'Team', description: 'Meet our experts', color: 'bg-indigo-500', href: '/team', distance: 300 },
  { name: 'Pricing', description: 'Our plans', color: 'bg-teal-500', href: '/pricing', distance: 260 },
  { name: 'FAQ', description: 'Common questions', color: 'bg-red-500', href: '/faq', distance: 340 }
]

export default function HomePage() {
  const radarRef = useRef<HTMLDivElement>(null)
  const scannerRef = useRef<HTMLDivElement>(null)
  const blipsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!scannerRef.current || !blipsRef.current) return

    // Scanner rotation (counter-clockwise) - like in the photo
    gsap.to(scannerRef.current, {
      rotation: -360,
      duration: 4,
      ease: 'none',
      repeat: -1,
      transformOrigin: 'center center'
    })

    // Navigation points rotation (counter-clockwise) - very slow
    gsap.to(blipsRef.current, {
      rotation: -360,
      duration: 25, // Even slower for solar system effect
      ease: 'none',
      repeat: -1,
      transformOrigin: 'center center'
    })

    // Add pulsing effect to individual blips
    const blipElements = blipsRef.current.querySelectorAll('.radar-blip')
    blipElements.forEach((blip, index) => {
      gsap.to(blip, {
        scale: 1.15,
        opacity: 0.9,
        duration: 4,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
        delay: index * 0.5
      })
    })

    return () => {
      gsap.killTweensOf(scannerRef.current)
      gsap.killTweensOf(blipsRef.current)
    }
  }, [])

  const handleBlipClick = (href: string) => {
    console.log(`Navigating to ${href}`)
    // Add click animation
    // You can replace this with actual navigation
    // window.location.href = href
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 flex flex-col items-center justify-center p-8 overflow-hidden">
      {/* Header */}
      <div className="text-center mb-12 z-30">
        <h1 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent gradient-text">
          Solar System Radar
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Explore our website sections as planets in a solar system. 
          The green scanner sweeps counter-clockwise while navigation points orbit at different distances!
        </p>
      </div>

      {/* Solar System Radar Container */}
      <div className="relative mb-16">
        <div 
          ref={radarRef}
          className="relative w-[800px] h-[800px] rounded-full bg-gradient-to-br from-green-900 to-green-800 border-4 border-green-400 shadow-2xl shadow-green-500/50"
        >
          {/* Concentric circles for orbit paths */}
          <div className="absolute top-1/2 left-1/2 w-[700px] h-[700px] rounded-full border border-green-400/30 transform -translate-x-1/2 -translate-y-1/2 radar-circle"></div>
          <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] rounded-full border border-green-400/25 transform -translate-x-1/2 -translate-y-1/2 radar-circle"></div>
          <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] rounded-full border border-green-400/20 transform -translate-x-1/2 -translate-y-1/2 radar-circle"></div>
          <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full border border-green-400/15 transform -translate-x-1/2 -translate-y-1/2 radar-circle"></div>
          <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full border border-green-400/10 transform -translate-x-1/2 -translate-y-1/2 radar-circle"></div>
          <div className="absolute top-1/2 left-1/2 w-[200px] h-[200px] rounded-full border border-green-400/20 transform -translate-x-1/2 -translate-y-1/2 radar-circle"></div>

          {/* Grid lines for solar system coordinates */}
          <div className="absolute top-1/2 left-1/2 w-full h-px bg-green-400/25 transform -translate-x-1/2 -translate-y-1/2 radar-grid-line"></div>
          <div className="absolute top-1/2 left-1/2 w-full h-px bg-green-400/25 transform -translate-x-1/2 -translate-y-1/2 rotate-90 radar-grid-line"></div>
          <div className="absolute top-1/2 left-1/2 w-full h-px bg-green-400/20 transform -translate-x-1/2 -translate-y-1/2 rotate-45 radar-grid-line"></div>
          <div className="absolute top-1/2 left-1/2 w-full h-px bg-green-400/20 transform -translate-x-1/2 -translate-y-1/2 -rotate-45 radar-grid-line"></div>

          {/* Center sun */}
          <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-2xl shadow-yellow-400/50 radar-center"></div>

          {/* Green scanner sweep (counter-clockwise rotation) */}
          <div 
            ref={scannerRef}
            className="absolute top-1/2 left-1/2 w-1/2 h-full origin-left radar-scanner"
            style={{ transformOrigin: 'center center' }}
          >
            <div className="w-full h-full bg-gradient-to-r from-transparent via-green-400/30 to-green-400/50 rounded-r-full"></div>
          </div>

          {/* Navigation points container (counter-clockwise rotation) - Solar System Planets */}
          <div 
            ref={blipsRef}
            className="absolute inset-0"
            style={{ transformOrigin: 'center center' }}
          >
            {websiteSections.map((section, index) => {
              const angle = (index * 360) / websiteSections.length
              const radius = section.distance // Varying distances like solar system
              
              return (
                <div
                  key={section.name}
                  className="absolute radar-blip cursor-pointer transition-all duration-300 hover:scale-150"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${radius}px)`
                  }}
                  onClick={() => handleBlipClick(section.href)}
                  title={`${section.name}: ${section.description}`}
                >
                  {/* Planet with ring effect */}
                  <div className="relative">
                    <div 
                      className={`w-10 h-10 ${section.color} rounded-full shadow-lg border-2 border-white/30 relative z-10`}
                    ></div>
                    {/* Planet ring */}
                    <div className="absolute top-1/2 left-1/2 w-16 h-16 border border-white/20 rounded-full transform -translate-x-1/2 -translate-y-1/2 -z-10"></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Outer glow effect */}
        <div className="absolute top-0 left-0 w-[800px] h-[800px] rounded-full border-2 border-green-400/20 outer-ring"></div>
      </div>

      {/* Instructions */}
      <Card className="max-w-md bg-white/10 backdrop-blur-sm border-white/20 text-white z-30">
        <CardHeader>
          <CardTitle className="text-center">How to Use</CardTitle>
          <CardDescription className="text-center text-gray-300">
            Click on any planet to navigate to that section
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-gray-300 mb-4">
            Each planet orbits at a different distance from the center sun. 
            The green scanner sweeps counter-clockwise while planets move slowly in their orbits!
          </p>
          <Button 
            variant="outline" 
            className="border-green-400 text-green-400 hover:bg-green-400 hover:text-white transition-all duration-300"
            onClick={() => {
              if (scannerRef.current && blipsRef.current) {
                // Add extra rotation on button click
                gsap.to(scannerRef.current, {
                  rotation: '-=180',
                  duration: 1,
                  ease: 'power2.inOut'
                })
                gsap.to(blipsRef.current, {
                  rotation: '-=90',
                  duration: 1,
                  ease: 'power2.inOut'
                })
              }
            }}
          >
            Boost Solar System!
          </Button>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="mt-12 text-center text-gray-400 z-30">
        <p>Built with Next.js, GSAP, and shadcn/ui</p>
      </div>
    </div>
  )
}
