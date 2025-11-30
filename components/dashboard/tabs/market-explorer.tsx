"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, ExternalLink, Filter, X, Search, Loader2 } from "lucide-react"
import { useFilterOptions } from "@/hooks/use-filter-options"
import { searchCars, type SearchCarsResponse } from "@/lib/api"

function formatPrice(price: number): string {
  if (price >= 10000000) {
    return `PKR ${(price / 10000000).toFixed(1)}Cr`
  } else if (price >= 100000) {
    return `PKR ${(price / 100000).toFixed(1)}L`
  }
  return `PKR ${price.toLocaleString()}`
}

const STATIC_CAR_RESULTS = [
  {
    make: "Toyota",
    model: "Corolla",
    year: 2022,
    mileage: 25000,
    price: 5200000,
    transmission: "Automatic",
    fuel_type: "Petrol",
    city: "Lahore",
    url: "#",
  },
  {
    make: "Honda",
    model: "City",
    year: 2021,
    mileage: 35000,
    price: 4100000,
    transmission: "Automatic",
    fuel_type: "Petrol",
    city: "Karachi",
    url: "#",
  },
  {
    make: "Toyota",
    model: "Yaris",
    year: 2023,
    mileage: 15000,
    price: 4800000,
    transmission: "Automatic",
    fuel_type: "Petrol",
    city: "Islamabad",
    url: "#",
  },
  {
    make: "Suzuki",
    model: "Alto",
    year: 2022,
    mileage: 20000,
    price: 2200000,
    transmission: "Manual",
    fuel_type: "Petrol",
    city: "Lahore",
    url: "#",
  },
  {
    make: "Honda",
    model: "Civic",
    year: 2020,
    mileage: 45000,
    price: 5500000,
    transmission: "Automatic",
    fuel_type: "Petrol",
    city: "Karachi",
    url: "#",
  },
  {
    make: "KIA",
    model: "Sportage",
    year: 2022,
    mileage: 30000,
    price: 8500000,
    transmission: "Automatic",
    fuel_type: "Petrol",
    city: "Lahore",
    url: "#",
  },
  {
    make: "Hyundai",
    model: "Tucson",
    year: 2021,
    mileage: 40000,
    price: 7800000,
    transmission: "Automatic",
    fuel_type: "Petrol",
    city: "Islamabad",
    url: "#",
  },
  {
    make: "Toyota",
    model: "Fortuner",
    year: 2020,
    mileage: 55000,
    price: 12500000,
    transmission: "Automatic",
    fuel_type: "Diesel",
    city: "Karachi",
    url: "#",
  },
  {
    make: "Suzuki",
    model: "Swift",
    year: 2023,
    mileage: 10000,
    price: 3500000,
    transmission: "Automatic",
    fuel_type: "Petrol",
    city: "Lahore",
    url: "#",
  },
  {
    make: "Honda",
    model: "BR-V",
    year: 2022,
    mileage: 28000,
    price: 4900000,
    transmission: "Automatic",
    fuel_type: "Petrol",
    city: "Karachi",
    url: "#",
  },
  {
    make: "Toyota",
    model: "Hilux",
    year: 2021,
    mileage: 50000,
    price: 9800000,
    transmission: "Automatic",
    fuel_type: "Diesel",
    city: "Peshawar",
    url: "#",
  },
  {
    make: "MG",
    model: "HS",
    year: 2023,
    mileage: 12000,
    price: 7200000,
    transmission: "Automatic",
    fuel_type: "Petrol",
    city: "Lahore",
    url: "#",
  },
]

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
    page: 1,
    limit: 12,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchCarsResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { filterOptions } = useFilterOptions()

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }))
    setHasSearched(false)
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
      page: 1,
      limit: 12,
    })
    setHasSearched(false)
    setSearchResults(null)
  }

  const handleSearch = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await searchCars(filters)
      setSearchResults(result)
      setHasSearched(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search cars")
      console.error("Error searching cars:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = async (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }))
    setIsLoading(true)
    setError(null)
    try {
      const result = await searchCars({ ...filters, page: newPage })
      setSearchResults(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search cars")
      console.error("Error searching cars:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const activeFiltersCount = Object.entries(filters).filter(
    ([key, value]) => value && key !== "page" && key !== "limit" && value !== "",
  ).length

  const paginatedResults = searchResults?.cars || []
  const totalPages = searchResults?.pagination.total_pages || 0
  const currentPage = searchResults?.pagination.page || filters.page

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
                  {filterOptions.makes.map((make) => (
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
                  {filterOptions.transmissions.map((t) => (
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
                  {filterOptions.fuel_types.map((f) => (
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

            {/* Search Button */}
            <Button onClick={handleSearch} className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search Cars
                </>
              )}
            </Button>
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
            {hasSearched && searchResults
              ? `${searchResults.pagination.total_count} cars found`
              : "Click Search to find cars"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
        )}

        {/* Car Grid */}
        {!hasSearched ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Set your filters and click "Search Cars" to find vehicles
            </CardContent>
          </Card>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : paginatedResults.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No cars found matching your criteria. Try adjusting your filters.
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {paginatedResults.map((car, i) => (
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
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1 || isLoading}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-muted-foreground px-4">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages || isLoading}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
