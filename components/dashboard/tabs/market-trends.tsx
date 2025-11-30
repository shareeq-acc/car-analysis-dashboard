"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, TrendingUp, TrendingDown, Minus, MapPin, Settings, Fuel } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { useFilterOptions } from "@/hooks/use-filter-options"
import { fetchMarketTrend, type MarketTrendResponse } from "@/lib/api"

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"]

function formatPrice(price: number): string {
  if (price >= 10000000) {
    return `PKR ${(price / 10000000).toFixed(2)}Cr`
  } else if (price >= 100000) {
    return `PKR ${(price / 100000).toFixed(2)}L`
  }
  return `PKR ${price.toLocaleString()}`
}

const STATIC_MARKET_TRENDS = {
  make: "Honda",
  model: "Civic",
  total_listings: 958,
  recent_listings: 124,
  avg_mileage: 67500,
  price_trend: {
    current_avg: 4180000,
    year_over_year_growth: 9.78,
    yearly_data: [
      { year: 2018, avg_price: 2850000, count: 145 },
      { year: 2019, avg_price: 3120000, count: 168 },
      { year: 2020, avg_price: 3450000, count: 185 },
      { year: 2021, avg_price: 3720000, count: 198 },
      { year: 2022, avg_price: 3980000, count: 142 },
      { year: 2023, avg_price: 4180000, count: 120 },
    ],
  },
  popular_cities: {
    Karachi: 285,
    Lahore: 312,
    Islamabad: 156,
    Rawalpindi: 89,
    Faisalabad: 52,
    Multan: 34,
    Peshawar: 18,
    Quetta: 12,
  },
  transmission_preference: {
    Automatic: 623,
    Manual: 335,
  },
  fuel_type_preference: {
    Petrol: 812,
    CNG: 98,
    Hybrid: 38,
    Diesel: 10,
  },
}

export function MarketTrends() {
  const { filterOptions } = useFilterOptions()

  const [make, setMake] = useState("")
  const [model, setModel] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [trends, setTrends] = useState<MarketTrendResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const params: any = {}
      if (make && make !== "all") params.make = make
      if (model) params.model = model

      const result = await fetchMarketTrend(params)
      setTrends(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch market trend")
      console.error("Error fetching market trend:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const priceData = trends?.price_trend.yearly_data || []
  const citiesData = trends
    ? Object.entries(trends.popular_cities)
        .slice(0, 8)
        .map(([name, value]) => ({ name, value }))
    : []
  const transmissionData = trends
    ? Object.entries(trends.transmission_preference).map(([name, value]) => ({
        name,
        value,
      }))
    : []
  const fuelData = trends
    ? Object.entries(trends.fuel_type_preference).map(([name, value]) => ({
        name,
        value,
      }))
    : []

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Market Trend Analysis
          </CardTitle>
          <CardDescription>Analyze market dynamics for specific makes and models</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Make (optional)</Label>
              <Select
                value={make}
                onValueChange={(v) => {
                  setMake(v)
                  setTrends(null)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All makes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All makes</SelectItem>
                  {filterOptions.makes.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Model (optional)</Label>
              <Input
                placeholder="e.g. City, Corolla"
                value={model}
                onChange={(e) => {
                  setModel(e.target.value)
                  setTrends(null)
                }}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAnalyze} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Trends"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}

      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {!trends && !isLoading && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Select filters and click "Analyze Trends" to see market insights
          </CardContent>
        </Card>
      )}

      {trends && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">Total Listings</p>
                <p className="text-2xl font-bold">{trends.total_listings.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">Current Avg Price</p>
                <p className="text-2xl font-bold text-primary">{formatPrice(trends.price_trend.current_avg)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">YoY Growth</p>
                <div className="flex items-center justify-center gap-1">
                  {trends.price_trend.year_over_year_growth > 0 ? (
                    <TrendingUp className="w-5 h-5 text-chart-1" />
                  ) : trends.price_trend.year_over_year_growth < 0 ? (
                    <TrendingDown className="w-5 h-5 text-destructive" />
                  ) : (
                    <Minus className="w-5 h-5 text-muted-foreground" />
                  )}
                  <p
                    className={`text-2xl font-bold ${
                      trends.price_trend.year_over_year_growth > 0
                        ? "text-chart-1"
                        : trends.price_trend.year_over_year_growth < 0
                          ? "text-destructive"
                          : ""
                    }`}
                  >
                    {trends.price_trend.year_over_year_growth.toFixed(1)}%
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">Avg Mileage</p>
                <p className="text-2xl font-bold">{trends.avg_mileage.toLocaleString()} km</p>
              </CardContent>
            </Card>
          </div>

          {/* Price Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Price Trend Over Years</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="year" stroke="#888" />
                    <YAxis stroke="#888" tickFormatter={(v) => formatPrice(v).replace("PKR ", "")} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e1e1e",
                        border: "1px solid #333",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number, name: string) => [
                        name === "avg_price" ? formatPrice(value) : value,
                        name === "avg_price" ? "Avg Price" : name === "count" ? "Listings" : name,
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="avg_price"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ fill: "#10b981" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Charts Row */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Popular Cities */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Popular Cities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={citiesData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis type="number" stroke="#888" />
                      <YAxis dataKey="name" type="category" width={80} stroke="#888" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e1e1e",
                          border: "1px solid #333",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Transmission Preference */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Transmission Preference
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={transmissionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {transmissionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e1e1e",
                          border: "1px solid #333",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Fuel Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Fuel className="w-4 h-4" />
                Fuel Type Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={fuelData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {fuelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e1e1e",
                        border: "1px solid #333",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
