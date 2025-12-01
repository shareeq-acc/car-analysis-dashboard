"use client"

import { useEffect, useRef, useState } from "react"

interface StatProps {
  value: number
  suffix: string
  label: string
  delay: number
}

function AnimatedStat({ value, suffix, label, delay }: StatProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.5 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const timeout = setTimeout(() => {
      const duration = 2000
      const steps = 60
      const increment = value / steps
      let current = 0

      const interval = setInterval(() => {
        current += increment
        if (current >= value) {
          setCount(value)
          clearInterval(interval)
        } else {
          setCount(Math.floor(current))
        }
      }, duration / steps)

      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timeout)
  }, [isVisible, value, delay])

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="text-muted-foreground">{label}</div>
    </div>
  )
}

export function StatsSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <AnimatedStat value={20000} suffix="+" label="Cars Analyzed" delay={0} />
          <AnimatedStat value={54} suffix="+" label="Brands Covered" delay={200} />
          <AnimatedStat value={15} suffix="+" label="Cities Tracked" delay={400} />
          <AnimatedStat value={99} suffix="%" label="Accuracy Rate" delay={600} />
        </div>
      </div>
    </section>
  )
}
