"use client"

import { useState } from "react"
import useSWR from "swr"
import { api, type FilterOptions } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, ExternalLink, Filter, X } from "lucide-react"
import { Skeleton } from "@/components/dashboard/loading-skeleton"

function formatPrice(price: number): string {
  if (price >= 10000000) {
    return `PKR ${(price / 10000000).toFixed(1)}Cr`
  } else if (price >= 100000) {
    return `PKR ${(price / 100000).toFixed(1)}L`
  }
  return `PKR ${price.toLocaleString()}`
}

export function MarketExplorer() {
  const [showFilters, setShowFilters] = useState(true)
  const [filters, setFilters] = useState({
    make: "",
    model: "",
    year_min: undefined as number | undefined,
    year_max: undefined as number | undefined,
    price_min: undefined as number | undefined,
    price_max: undefined as number | undefined,
    mileage_min: undefined as number | undefined,
    mileage_max: undefined as number | undefined,
    transmission: "",
    fuel_type: "",
    city: "",
    seller_type: "",
    page: 1,
    limit: 12,
  })

  const { data: filterOptions } = useSWR<FilterOptions>("filters", () => api.getFilters())

  const { data: results, isLoading } = useSWR(["cars", filters], () => api.searchCars(filters), {
    keepPreviousData: true,
  })

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }))
  }

  const clearFilters = () => {
    setFilters({
      make: "",
      model: "",
      year_min: undefined,
      year_max: undefined,
      price_min: undefined,
      price_max: undefined,
      mileage_min: undefined,
      mileage_max: undefined,
      transmission: "",
      fuel_type: "",
      city: "",
      seller_type: "",
      page: 1,
      limit: 12,
    })
  }

  const activeFiltersCount = Object.entries(filters).filter(
    ([key, value]) => value && key !== "page" && key !== "limit" && value !== "",
  ).length

  return (
    <div className="flex gap-6">
      {/* Filters Panel */}
      {showFilters && (
        <Card className="w-72 flex-shrink-0 h-fit sticky top-0">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
                {activeFiltersCount > 0 && <Badge variant="secondary">{activeFiltersCount}</Badge>}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Make */}
            <div className="space-y-2">
              <Label>Make</Label>
              <Select value={filters.make} onValueChange={(v) => handleFilterChange("make", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Makes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Makes</SelectItem>
                  {filterOptions?.makes.map((make) => (
                    <SelectItem key={make} value={make}>
                      {make}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Model */}
            <div className="space-y-2">
              <Label>Model</Label>
              <Input
                placeholder="Enter model..."
                value={filters.model}
                onChange={(e) => handleFilterChange("model", e.target.value)}
              />
            </div>

            {/* Year Range */}
            <div className="space-y-2">
              <Label>Year Range</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.year_min || ""}
                  onChange={(e) =>
                    handleFilterChange("year_min", e.target.value ? Number.parseInt(e.target.value) : undefined)
                  }
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.year_max || ""}
                  onChange={(e) =>
                    handleFilterChange("year_max", e.target.value ? Number.parseInt(e.target.value) : undefined)
                  }
                />
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <Label>Price Range (PKR)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.price_min || ""}
                  onChange={(e) =>
                    handleFilterChange("price_min", e.target.value ? Number.parseInt(e.target.value) : undefined)
                  }
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.price_max || ""}
                  onChange={(e) =>
                    handleFilterChange("price_max", e.target.value ? Number.parseInt(e.target.value) : undefined)
                  }
                />
              </div>
            </div>

            {/* Transmission */}
            <div className="space-y-2">
              <Label>Transmission</Label>
              <Select value={filters.transmission} onValueChange={(v) => handleFilterChange("transmission", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {filterOptions?.transmissions.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fuel Type */}
            <div className="space-y-2">
              <Label>Fuel Type</Label>
              <Select value={filters.fuel_type} onValueChange={(v) => handleFilterChange("fuel_type", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {filterOptions?.fuel_types.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label>City</Label>
              <Input
                placeholder="Enter city..."
                value={filters.city}
                onChange={(e) => handleFilterChange("city", e.target.value)}
              />
            </div>

            {/* Seller Type */}
            <div className="space-y-2">
              <Label>Seller Type</Label>
              <Select value={filters.seller_type} onValueChange={(v) => handleFilterChange("seller_type", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {filterOptions?.seller_types.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      <div className="flex-1">
        {/* Toggle filters button */}
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? (
              <>
                <X className="w-4 h-4 mr-2" /> Hide Filters
              </>
            ) : (
              <>
                <Filter className="w-4 h-4 mr-2" /> Show Filters
              </>
            )}
          </Button>
          <p className="text-sm text-muted-foreground">
            {results?.pagination.total_count.toLocaleString() || 0} cars found
          </p>
        </div>

        {/* Car Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-40" />
                  <CardContent className="p-4 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-6 w-1/3" />
                  </CardContent>
                </Card>
              ))
            : results?.cars.map((car, i) => (
                <Card key={i} className="overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg group">
                  <div className="h-40 bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
                    <div className="text-4xl font-bold text-muted-foreground/30">{car.make.charAt(0)}</div>
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
                    <p className="text-xl font-bold text-primary mb-3">{formatPrice(car.price)}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{car.transmission}</Badge>
                      <Badge variant="secondary">{car.fuel_type}</Badge>
                      <Badge variant="outline">{car.city}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>

        {/* Pagination */}
        {results && results.pagination.total_pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              disabled={filters.page === 1}
              onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-muted-foreground px-4">
              Page {filters.page} of {results.pagination.total_pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={filters.page === results.pagination.total_pages}
              onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
