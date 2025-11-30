"use client"

import { useState } from "react"
import useSWR from "swr"
import { api, type FilterOptions } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles } from "lucide-react"

function formatPrice(price: number): string {
  if (price >= 10000000) {
    return `PKR ${(price / 10000000).toFixed(2)}Cr`
  } else if (price >= 100000) {
    return `PKR ${(price / 100000).toFixed(2)}L`
  }
  return `PKR ${price.toLocaleString()}`
}

export function SimilarCars() {
  const { data: filterOptions } = useSWR<FilterOptions>("filters", () => api.getFilters())

  const [form, setForm] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    price: undefined as number | undefined,
    engine_capacity: undefined as number | undefined,
    limit: 10,
  })

  const [submitted, setSubmitted] = useState(false)

  const {
    data: results,
    isLoading,
    error,
  } = useSWR(submitted && form.make && form.model ? ["similar-cars", form] : null, () =>
    api.findSimilarCars(form as any),
  )

  const handleSubmit = () => {
    if (form.make && form.model) {
      setSubmitted(true)
    }
  }

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
                  setSubmitted(false)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select make" />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions?.makes.map((make) => (
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
                  setSubmitted(false)
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
                  setSubmitted(false)
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
                  setSubmitted(false)
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
                  setSubmitted(false)
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
                  setSubmitted(false)
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

      {error && (
        <Card>
          <CardContent className="py-12 text-center text-destructive">
            Failed to find similar cars. Please try again.
          </CardContent>
        </Card>
      )}

      {results && results.similar_cars.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.similar_cars.map((car, i) => (
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
      )}

      {results && results.similar_cars.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No similar cars found. Try adjusting your search criteria.
          </CardContent>
        </Card>
      )}

      {!submitted && !isLoading && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Enter car details above and click "Find Similar Cars" to see alternatives
          </CardContent>
        </Card>
      )}
    </div>
  )
}
