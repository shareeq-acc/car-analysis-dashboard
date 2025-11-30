"use client"

import { useEffect, useRef, useState } from "react"
import { Calculator, GitCompare, Search, Sparkles, Target, TrendingUp } from "lucide-react"

const features = [
  {
    icon: Calculator,
    title: "Price Estimator",
    description: "Get accurate price estimates using machine learning models trained on thousands of listings.",
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
  },
  {
    icon: TrendingUp,
    title: "Market Trends",
    description: "Track price trends, market dynamics, and regional preferences with real-time data analysis.",
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
  },
  {
    icon: GitCompare,
    title: "Smart Comparisons",
    description: "Compare models head-to-head on price, popularity, depreciation, and features.",
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },
  {
    icon: Search,
    title: "Market Explorer",
    description: "Search and filter through thousands of listings with advanced filters and sorting.",
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
  },
  {
    icon: Target,
    title: "Best Value Finder",
    description: "Discover underpriced cars and the best deals within your budget using our value scoring algorithm.",
    color: "text-chart-5",
    bgColor: "bg-chart-5/10",
  },
  {
    icon: Sparkles,
    title: "Similar Cars",
    description: "Find alternatives based on specifications with intelligent similarity scoring.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
]

export function FeaturesSection() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-24 bg-card/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Powerful Features for Smart Decisions</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Everything you need to analyze the car market and make informed buying decisions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`group p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-lg hover:shadow-primary/5 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div
                className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
