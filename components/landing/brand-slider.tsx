"use client"

import { useEffect, useRef } from "react"

const BRANDS = [
  "Toyota",
  "Honda",
  "Suzuki",
  "BMW",
  "Mercedes",
  "Audi",
  "Hyundai",
  "KIA",
  "Nissan",
  "Mazda",
  "Ford",
  "Chevrolet",
  "Volkswagen",
  "Porsche",
  "Lexus",
  "Mitsubishi",
  "Subaru",
  "Jaguar",
  "Jeep",
  "Tesla",
  "BYD",
  "MG",
  "Haval",
  "Changan",
  "Daihatsu",
  "MINI",
  "Peugeot",
]

function BrandLogo({ brand }: { brand: string }) {
  return (
    <div className="flex items-center justify-center px-8 py-4 mx-4 rounded-xl bg-card/50 border border-border/50 hover:border-primary/50 hover:bg-card transition-all duration-300 min-w-[140px]">
      <span className="text-lg font-semibold text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
        {brand}
      </span>
    </div>
  )
}

export function BrandSlider() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let animationId: number
    let scrollPosition = 0
    const speed = 0.5

    const animate = () => {
      scrollPosition += speed

      // Reset scroll position when we've scrolled half the content (since content is duplicated)
      const halfWidth = scrollContainer.scrollWidth / 2
      if (scrollPosition >= halfWidth) {
        scrollPosition = 0
      }

      scrollContainer.scrollLeft = scrollPosition
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    // Pause on hover
    const handleMouseEnter = () => cancelAnimationFrame(animationId)
    const handleMouseLeave = () => {
      animationId = requestAnimationFrame(animate)
    }

    scrollContainer.addEventListener("mouseenter", handleMouseEnter)
    scrollContainer.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      cancelAnimationFrame(animationId)
      scrollContainer.removeEventListener("mouseenter", handleMouseEnter)
      scrollContainer.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <section className="py-16 bg-background relative overflow-hidden">
      {/* Section Header */}
      <div className="container mx-auto px-4 mb-10">
        <p className="text-center text-muted-foreground text-sm uppercase tracking-widest mb-2">
          Trusted by car enthusiasts
        </p>
        <h3 className="text-center text-xl font-semibold text-foreground">Analyzing 54+ Popular Brands</h3>
      </div>

      {/* Slider Container */}
      <div className="relative">
        {/* Left blur gradient */}
        <div className="absolute left-0 top-0 bottom-0 w-32 md:w-48 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none" />

        {/* Right blur gradient */}
        <div className="absolute right-0 top-0 bottom-0 w-32 md:w-48 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none" />

        {/* Scrolling content */}
        <div ref={scrollRef} className="flex overflow-x-hidden scrollbar-hide" style={{ scrollBehavior: "auto" }}>
          {/* First set of brands */}
          {BRANDS.map((brand, index) => (
            <BrandLogo key={`first-${index}`} brand={brand} />
          ))}
          {/* Duplicate for seamless loop */}
          {BRANDS.map((brand, index) => (
            <BrandLogo key={`second-${index}`} brand={brand} />
          ))}
        </div>
      </div>
    </section>
  )
}
