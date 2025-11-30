"use client"

import { useState } from "react"
import useSWR from "swr"
import { api } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Loader2, Target } from "lucide-react"

function formatPrice(price: number): string {
  if (price >= 10000000) {
    return `PKR ${(price / 10000000).toFixed(2)}Cr`
  } else if (price >= 100000) {
    return `PKR ${(price / 100000).toFixed(2)}L`
  }
  return `PKR ${price.toLocaleString()}`
}

export function BestValue() {
  const [budgetMin, setBudgetMin] = useState(1000000)
  const [budgetMax, setBudgetMax] = useState(5000000)
  const [yearMin, setYearMin] = useState(2015)
  const [limit, setLimit] = useState(20)
  const [submitted, setSubmitted] = useState(false)

  const {
    data: results,
    isLoading,
    error,
  } = useSWR(submitted ? ["best-value", budgetMin, budgetMax, yearMin, limit] : null, () =>
    api.getBestValue({ budget_min: budgetMin, budget_max: budgetMax, year_min: yearMin, limit }),
  )

  const handleSearch = () => {
    setSubmitted(true)
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Best Value Finder
          </CardTitle>
          <CardDescription>Discover underpriced cars with the best value score</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label>Min Budget: {formatPrice(budgetMin)}</Label>
              <Slider
                value={[budgetMin]}
                min={100000}
                max={50000000}
                step={100000}
                onValueChange={(v) => {
                  setBudgetMin(v[0])
                  setSubmitted(false)
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Max Budget: {formatPrice(budgetMax)}</Label>
              <Slider
                value={[budgetMax]}
                min={100000}
                max={50000000}
                step={100000}
                onValueChange={(v) => {
                  setBudgetMax(v[0])
                  setSubmitted(false)
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Min Year: {yearMin}</Label>
              <Slider
                value={[yearMin]}
                min={2000}
                max={new Date().getFullYear()}
                step={1}
                onValueChange={(v) => {
                  setYearMin(v[0])
                  setSubmitted(false)
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Results: {limit}</Label>
              <Slider
                value={[limit]}
                min={10}
                max={100}
                step={10}
                onValueChange={(v) => {
                  setLimit(v[0])
                  setSubmitted(false)
                }}
              />
            </div>
          </div>
          <Button onClick={handleSearch} disabled={isLoading} className="mt-4">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Finding Deals...
              </>
            ) : (
              "Find Best Value Cars"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Budget Summary */}
      {results && (
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">Budget Range</p>
              <p className="text-lg font-semibold">
                {formatPrice(results.budget_range.min)} - {formatPrice(results.budget_range.max)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">Cars Found</p>
              <p className="text-lg font-semibold text-primary">{results.count}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">Min Year</p>
              <p className="text-lg font-semibold">{yearMin}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Results */}
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <Card>
          <CardContent className="py-12 text-center text-destructive">
            Failed to find best value cars. Please try again.
          </CardContent>
        </Card>
      )}

      {results && results.best_value_cars.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.best_value_cars.map((car, i) => (
            <Card key={i} className="overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg group">
              <div className="h-32 bg-gradient-to-br from-primary/20 to-chart-2/20 flex items-center justify-center relative">
                <div className="text-5xl font-bold text-foreground/10">{car.make.charAt(0)}</div>
                {i < 3 && <Badge className="absolute top-3 left-3 bg-primary">#{i + 1} Best Value</Badge>}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {car.make} {car.model}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {car.year} • {car.mileage?.toLocaleString() || "N/A"} km
                    </p>
                  </div>
                  {car.url && (
                    <a
                      href={car.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-primary" />
                    </a>
                  )}
                </div>

                <p className="text-2xl font-bold text-primary mb-3">{formatPrice(car.price)}</p>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{car.transmission}</Badge>
                  <Badge variant="secondary">{car.fuel_type}</Badge>
                  {car.engine_capacity && <Badge variant="outline">{car.engine_capacity}cc</Badge>}
                  <Badge variant="outline">{car.city}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {results && results.best_value_cars.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No cars found in this budget range. Try adjusting your filters.
          </CardContent>
        </Card>
      )}

      {!submitted && !isLoading && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Set your budget and preferences above to find the best value cars
          </CardContent>
        </Card>
      )}
    </div>
  )
}
