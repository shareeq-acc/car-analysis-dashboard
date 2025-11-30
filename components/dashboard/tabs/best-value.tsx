"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Loader2, Target, ChevronLeft, ChevronRight } from "lucide-react"

function formatPrice(price: number): string {
  if (price >= 10000000) {
    return `PKR ${(price / 10000000).toFixed(2)}Cr`
  } else if (price >= 100000) {
    return `PKR ${(price / 100000).toFixed(2)}L`
  }
  return `PKR ${price.toLocaleString()}`
}

const STATIC_BEST_VALUE_RESPONSE = {
  budget_range: { min: 1000000, max: 5000000 },
  count: 20,
  best_value_cars: [
    {
      make: "Suzuki",
      model: "Alto",
      year: 2022,
      mileage: 15000,
      price: 2100000,
      transmission: "Manual",
      fuel_type: "Petrol",
      engine_capacity: 660,
      city: "Lahore",
      url: "#",
    },
    {
      make: "Suzuki",
      model: "Wagon R",
      year: 2021,
      mileage: 25000,
      price: 2400000,
      transmission: "Automatic",
      fuel_type: "Petrol",
      engine_capacity: 1000,
      city: "Karachi",
      url: "#",
    },
    {
      make: "Toyota",
      model: "Vitz",
      year: 2019,
      mileage: 35000,
      price: 2800000,
      transmission: "Automatic",
      fuel_type: "Petrol",
      engine_capacity: 1000,
      city: "Islamabad",
      url: "#",
    },
    {
      make: "Suzuki",
      model: "Cultus",
      year: 2022,
      mileage: 20000,
      price: 2600000,
      transmission: "Automatic",
      fuel_type: "Petrol",
      engine_capacity: 1000,
      city: "Lahore",
      url: "#",
    },
    {
      make: "Honda",
      model: "City",
      year: 2018,
      mileage: 55000,
      price: 2900000,
      transmission: "Manual",
      fuel_type: "Petrol",
      engine_capacity: 1300,
      city: "Karachi",
      url: "#",
    },
    {
      make: "Suzuki",
      model: "Swift",
      year: 2020,
      mileage: 30000,
      price: 3200000,
      transmission: "Automatic",
      fuel_type: "Petrol",
      engine_capacity: 1200,
      city: "Lahore",
      url: "#",
    },
    {
      make: "Toyota",
      model: "Passo",
      year: 2018,
      mileage: 45000,
      price: 2500000,
      transmission: "Automatic",
      fuel_type: "Petrol",
      engine_capacity: 1000,
      city: "Rawalpindi",
      url: "#",
    },
    {
      make: "Daihatsu",
      model: "Mira",
      year: 2019,
      mileage: 40000,
      price: 1800000,
      transmission: "Automatic",
      fuel_type: "Petrol",
      engine_capacity: 660,
      city: "Faisalabad",
      url: "#",
    },
    {
      make: "Honda",
      model: "Fit",
      year: 2017,
      mileage: 60000,
      price: 2700000,
      transmission: "Automatic",
      fuel_type: "Hybrid",
      engine_capacity: 1500,
      city: "Lahore",
      url: "#",
    },
    {
      make: "Suzuki",
      model: "Bolan",
      year: 2023,
      mileage: 10000,
      price: 1500000,
      transmission: "Manual",
      fuel_type: "Petrol",
      engine_capacity: 800,
      city: "Multan",
      url: "#",
    },
    {
      make: "KIA",
      model: "Picanto",
      year: 2021,
      mileage: 22000,
      price: 3100000,
      transmission: "Automatic",
      fuel_type: "Petrol",
      engine_capacity: 1000,
      city: "Karachi",
      url: "#",
    },
    {
      make: "Hyundai",
      model: "Santro",
      year: 2022,
      mileage: 18000,
      price: 2800000,
      transmission: "Manual",
      fuel_type: "Petrol",
      engine_capacity: 1000,
      city: "Islamabad",
      url: "#",
    },
    {
      make: "Prince",
      model: "Pearl",
      year: 2022,
      mileage: 12000,
      price: 1400000,
      transmission: "Manual",
      fuel_type: "Petrol",
      engine_capacity: 800,
      city: "Lahore",
      url: "#",
    },
    {
      make: "United",
      model: "Bravo",
      year: 2023,
      mileage: 8000,
      price: 1600000,
      transmission: "Manual",
      fuel_type: "Petrol",
      engine_capacity: 800,
      city: "Peshawar",
      url: "#",
    },
    {
      make: "Changan",
      model: "Karvaan",
      year: 2022,
      mileage: 20000,
      price: 2200000,
      transmission: "Manual",
      fuel_type: "Petrol",
      engine_capacity: 1000,
      city: "Karachi",
      url: "#",
    },
    {
      make: "FAW",
      model: "V2",
      year: 2021,
      mileage: 28000,
      price: 2000000,
      transmission: "Manual",
      fuel_type: "Petrol",
      engine_capacity: 1300,
      city: "Lahore",
      url: "#",
    },
    {
      make: "DFSK",
      model: "Glory",
      year: 2022,
      mileage: 15000,
      price: 3500000,
      transmission: "Manual",
      fuel_type: "Petrol",
      engine_capacity: 1500,
      city: "Rawalpindi",
      url: "#",
    },
    {
      make: "Proton",
      model: "Saga",
      year: 2022,
      mileage: 18000,
      price: 3300000,
      transmission: "Automatic",
      fuel_type: "Petrol",
      engine_capacity: 1300,
      city: "Karachi",
      url: "#",
    },
    {
      make: "Suzuki",
      model: "Mehran",
      year: 2018,
      mileage: 70000,
      price: 1100000,
      transmission: "Manual",
      fuel_type: "Petrol",
      engine_capacity: 800,
      city: "Quetta",
      url: "#",
    },
    {
      make: "Toyota",
      model: "Aqua",
      year: 2017,
      mileage: 55000,
      price: 3400000,
      transmission: "Automatic",
      fuel_type: "Hybrid",
      engine_capacity: 1500,
      city: "Islamabad",
      url: "#",
    },
  ],
}

export function BestValue() {
  const [budgetMin, setBudgetMin] = useState(1000000)
  const [budgetMax, setBudgetMax] = useState(5000000)
  const [yearMin, setYearMin] = useState(2015)
  const [limit, setLimit] = useState(20)
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<typeof STATIC_BEST_VALUE_RESPONSE | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const handleSearch = () => {
    setIsLoading(true)
    setCurrentPage(1)
    setTimeout(() => {
      setResults(STATIC_BEST_VALUE_RESPONSE)
      setIsLoading(false)
    }, 500)
  }

  // Pagination
  const totalPages = results ? Math.ceil(results.best_value_cars.length / itemsPerPage) : 0
  const paginatedResults =
    results?.best_value_cars.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) || []

  // Get original index for "Best Value" badge
  const getOriginalIndex = (pageIndex: number) => (currentPage - 1) * itemsPerPage + pageIndex

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
                  setResults(null)
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
                  setResults(null)
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
                  setResults(null)
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
                  setResults(null)
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

      {results && results.best_value_cars.length > 0 && (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedResults.map((car, i) => {
              const originalIndex = getOriginalIndex(i)
              return (
                <Card key={i} className="overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg group">
                  <div className="h-32 bg-gradient-to-br from-primary/20 to-chart-2/20 flex items-center justify-center relative">
                    <div className="text-5xl font-bold text-foreground/10">{car.make.charAt(0)}</div>
                    {originalIndex < 3 && (
                      <Badge className="absolute top-3 left-3 bg-primary">#{originalIndex + 1} Best Value</Badge>
                    )}
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
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground px-4">
                Page {currentPage} of {totalPages} • Showing {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, results.best_value_cars.length)} of{" "}
                {results.best_value_cars.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}

      {results && results.best_value_cars.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No cars found in this budget range. Try adjusting your filters.
          </CardContent>
        </Card>
      )}

      {!results && !isLoading && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Set your budget and preferences above to find the best value cars
          </CardContent>
        </Card>
      )}
    </div>
  )
}
