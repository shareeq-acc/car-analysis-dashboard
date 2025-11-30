"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, ChevronLeft, ChevronRight } from "lucide-react"
import { useFilterOptions } from "@/hooks/use-filter-options"
import { fetchSimilarCars, type SimilarCarsResponse } from "@/lib/api"

function formatPrice(price: number): string {
  if (price >= 10000000) {
    return `PKR ${(price / 10000000).toFixed(2)}Cr`
  } else if (price >= 100000) {
    return `PKR ${(price / 100000).toFixed(2)}L`
  }
  return `PKR ${price.toLocaleString()}`
}

const STATIC_SIMILAR_CARS_RESPONSE = {
  reference: {
    make: "Honda",
    model: "City",
    year: 2020,
    price: 3500000,
    engine_capacity: 1500,
  },
  similar_cars: [
    {
      make: "Honda",
      model: "City",
      year: 2019,
      engine_capacity: 1500,
      average_price: 3200000,
      count: 45,
      price_range: { min: 2800000, max: 3600000 },
      similarity_score: 0.95,
    },
    {
      make: "Honda",
      model: "City",
      year: 2021,
      engine_capacity: 1500,
      average_price: 3800000,
      count: 52,
      price_range: { min: 3400000, max: 4200000 },
      similarity_score: 0.93,
    },
    {
      make: "Toyota",
      model: "Yaris",
      year: 2020,
      engine_capacity: 1500,
      average_price: 3400000,
      count: 38,
      price_range: { min: 3000000, max: 3800000 },
      similarity_score: 0.85,
    },
    {
      make: "Toyota",
      model: "Yaris",
      year: 2021,
      engine_capacity: 1500,
      average_price: 3700000,
      count: 41,
      price_range: { min: 3300000, max: 4100000 },
      similarity_score: 0.82,
    },
    {
      make: "Honda",
      model: "Civic",
      year: 2018,
      engine_capacity: 1800,
      average_price: 3900000,
      count: 28,
      price_range: { min: 3500000, max: 4300000 },
      similarity_score: 0.78,
    },
    {
      make: "Hyundai",
      model: "Elantra",
      year: 2020,
      engine_capacity: 1600,
      average_price: 3600000,
      count: 22,
      price_range: { min: 3200000, max: 4000000 },
      similarity_score: 0.75,
    },
    {
      make: "KIA",
      model: "Cerato",
      year: 2020,
      engine_capacity: 1600,
      average_price: 3500000,
      count: 18,
      price_range: { min: 3100000, max: 3900000 },
      similarity_score: 0.72,
    },
    {
      make: "Toyota",
      model: "Corolla",
      year: 2019,
      engine_capacity: 1800,
      average_price: 3800000,
      count: 65,
      price_range: { min: 3400000, max: 4200000 },
      similarity_score: 0.7,
    },
    {
      make: "Suzuki",
      model: "Ciaz",
      year: 2020,
      engine_capacity: 1400,
      average_price: 2900000,
      count: 15,
      price_range: { min: 2500000, max: 3300000 },
      similarity_score: 0.68,
    },
    {
      make: "Honda",
      model: "City",
      year: 2018,
      engine_capacity: 1300,
      average_price: 2700000,
      count: 32,
      price_range: { min: 2300000, max: 3100000 },
      similarity_score: 0.65,
    },
  ],
  total_similar: 10,
}

export function SimilarCars() {
  const { filterOptions } = useFilterOptions()

  const [form, setForm] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    price: undefined as number | undefined,
    engine_capacity: undefined as number | undefined,
    limit: 10,
  })

  const [results, setResults] = useState<SimilarCarsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const handleSubmit = async () => {
    if (form.make && form.model) {
      setIsLoading(true)
      setCurrentPage(1)
      setError(null)
      try {
        const result = await fetchSimilarCars({
          make: form.make,
          model: form.model,
          year: form.year,
          price: form.price,
          engine_capacity: form.engine_capacity,
          limit: form.limit,
        })
        setResults(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch similar cars")
        console.error("Error fetching similar cars:", err)
      } finally {
        setIsLoading(false)
      }
    }
  }

  // Pagination
  const totalPages = results ? Math.ceil(results.similar_cars.length / itemsPerPage) : 0
  const paginatedResults =
    results?.similar_cars.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) || []

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Find Similar Cars
          </CardTitle>
          <CardDescription>Enter your car details to find similar alternatives</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <Label>Make *</Label>
              <Select
                value={form.make}
                onValueChange={(v) => {
                  setForm((p) => ({ ...p, make: v }))
                  setResults(null)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select make" />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.makes.map((make) => (
                    <SelectItem key={make} value={make}>
                      {make}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Model *</Label>
              <Input
                placeholder="e.g. City"
                value={form.model}
                onChange={(e) => {
                  setForm((p) => ({ ...p, model: e.target.value }))
                  setResults(null)
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>Year *</Label>
              <Input
                type="number"
                value={form.year}
                onChange={(e) => {
                  setForm((p) => ({ ...p, year: Number.parseInt(e.target.value) }))
                  setResults(null)
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>Price (optional)</Label>
              <Input
                type="number"
                placeholder="e.g. 3500000"
                value={form.price || ""}
                onChange={(e) => {
                  setForm((p) => ({
                    ...p,
                    price: e.target.value ? Number.parseInt(e.target.value) : undefined,
                  }))
                  setResults(null)
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>Engine CC (optional)</Label>
              <Input
                type="number"
                placeholder="e.g. 1500"
                value={form.engine_capacity || ""}
                onChange={(e) => {
                  setForm((p) => ({
                    ...p,
                    engine_capacity: e.target.value ? Number.parseInt(e.target.value) : undefined,
                  }))
                  setResults(null)
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>Results: {form.limit}</Label>
              <Slider
                value={[form.limit]}
                min={5}
                max={50}
                step={5}
                onValueChange={(v) => {
                  setForm((p) => ({ ...p, limit: v[0] }))
                  setResults(null)
                }}
              />
            </div>
          </div>

          <Button onClick={handleSubmit} disabled={!form.make || !form.model || isLoading} className="mt-4">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Finding...
              </>
            ) : (
              "Find Similar Cars"
            )}
          </Button>
        </CardContent>
      </Card>

      {error && <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}

      {/* Reference Card */}
      {results?.reference && (
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle className="text-lg">Reference Vehicle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Badge variant="secondary" className="text-base px-3 py-1">
                {results.reference.make} {results.reference.model}
              </Badge>
              <Badge variant="outline" className="text-base px-3 py-1">
                {results.reference.year}
              </Badge>
              {results.reference.price && (
                <Badge variant="outline" className="text-base px-3 py-1">
                  {formatPrice(results.reference.price)}
                </Badge>
              )}
              {results.reference.engine_capacity && (
                <Badge variant="outline" className="text-base px-3 py-1">
                  {results.reference.engine_capacity}cc
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Grid */}
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {results && results.similar_cars.length > 0 && (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedResults.map((car, i) => (
              <Card key={i} className="hover:border-primary/50 transition-all hover:shadow-lg">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {car.make} {car.model}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {car.year} • {car.engine_capacity}cc
                      </p>
                    </div>
                    <Badge
                      variant={
                        car.similarity_score > 0.8 ? "default" : car.similarity_score > 0.6 ? "secondary" : "outline"
                      }
                    >
                      {(car.similarity_score * 100).toFixed(0)}% match
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Similarity Score</span>
                        <span>{(car.similarity_score * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={car.similarity_score * 100} />
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="text-center p-2 rounded bg-secondary">
                        <p className="text-xs text-muted-foreground">Avg Price</p>
                        <p className="font-semibold text-primary">{formatPrice(car.average_price)}</p>
                      </div>
                      <div className="text-center p-2 rounded bg-secondary">
                        <p className="text-xs text-muted-foreground">Listings</p>
                        <p className="font-semibold">{car.count}</p>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground text-center">
                      Price Range: {formatPrice(car.price_range.min)} - {formatPrice(car.price_range.max)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
                {Math.min(currentPage * itemsPerPage, results.similar_cars.length)} of {results.similar_cars.length}
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

      {results && results.similar_cars.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No similar cars found. Try adjusting your search criteria.
          </CardContent>
        </Card>
      )}

      {!results && !isLoading && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Enter car details above and click "Find Similar Cars" to see alternatives
          </CardContent>
        </Card>
      )}
    </div>
  )
}
