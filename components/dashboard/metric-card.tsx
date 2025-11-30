"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ArrowDown, ArrowUp, Minus } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: number
  icon?: LucideIcon
  loading?: boolean
  className?: string
  delay?: number
}

export function MetricCard({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  loading,
  className,
  delay = 0,
}: MetricCardProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  if (loading) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardContent className="p-6">
          <div className="animate-shimmer h-4 w-24 bg-muted rounded mb-4" />
          <div className="animate-shimmer h-8 w-32 bg-muted rounded mb-2" />
          <div className="animate-shimmer h-3 w-20 bg-muted rounded" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-500 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30",
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className,
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {(subtitle || trend !== undefined) && (
              <div className="flex items-center gap-2 mt-2">
                {trend !== undefined && (
                  <span
                    className={cn(
                      "flex items-center gap-0.5 text-sm font-medium",
                      trend > 0 ? "text-chart-1" : trend < 0 ? "text-destructive" : "text-muted-foreground",
                    )}
                  >
                    {trend > 0 ? (
                      <ArrowUp className="w-3 h-3" />
                    ) : trend < 0 ? (
                      <ArrowDown className="w-3 h-3" />
                    ) : (
                      <Minus className="w-3 h-3" />
                    )}
                    {Math.abs(trend)}%
                  </span>
                )}
                {subtitle && <span className="text-sm text-muted-foreground">{subtitle}</span>}
              </div>
            )}
          </div>
          {Icon && (
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
