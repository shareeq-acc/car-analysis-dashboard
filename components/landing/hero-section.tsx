"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, Car, Sparkles, TrendingUp } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-chart-2/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div
          className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-8">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Market Intelligence</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-balance mb-6 tracking-tight">
            Intelligent Car
            <span className="block text-primary">Market Analysis</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground text-pretty max-w-2xl mx-auto mb-10">
            AI-powered insights for smart car buying decisions. Analyze prices, compare models, and find the best deals
            in the market.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8 py-6 group">
                Explore Dashboard
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/dashboard?tab=price-intelligence">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
                Try Price Estimator
              </Button>
            </Link>
          </div>

          {/* Feature icons */}
          <div className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto">
            {[
              { icon: TrendingUp, label: "Price Trends" },
              { icon: BarChart3, label: "Market Analytics" },
              { icon: Car, label: "Smart Comparisons" },
            ].map((item, i) => (
              <div
                key={item.label}
                className={`flex flex-col items-center gap-3 transition-all duration-700 delay-${(i + 1) * 200} ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                }`}
                style={{ transitionDelay: `${(i + 1) * 200}ms` }}
              >
                <div className="w-14 h-14 rounded-xl bg-card border border-border flex items-center justify-center">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
