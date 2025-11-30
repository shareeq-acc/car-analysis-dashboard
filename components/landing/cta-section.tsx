"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-background to-chart-2/10" />
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-chart-2/20 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-balance">Ready to Make Smarter Car Decisions?</h2>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-pretty">
          Start analyzing the market now with our comprehensive dashboard and AI-powered tools.
        </p>
        <Link href="/dashboard">
          <Button size="lg" className="text-lg px-10 py-6 group">
            Start Analyzing Now
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </section>
  )
}
