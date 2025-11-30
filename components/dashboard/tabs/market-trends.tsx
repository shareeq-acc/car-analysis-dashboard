"use client"

import { useState } from "react"
import useSWR from "swr"
import { api, type FilterOptions } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"]

function formatPrice(price: number): string {
  if (price >= 10000000) {
    return `PKR ${(price / 10000000).toFixed(2)}Cr`
  } else if (price >= 100000) {
    return `PKR ${(price / 100000).toFixed(2)}L`
  }
  return `PKR ${price.toLocaleString()}`
}

export function MarketTrends() {
  const { data: filterOptions } = useSWR<FilterOptions>("filters", () => api.getFilters())

  const [make, setMake] = useState("All makes")
  const [model, setModel] = useState("")

  const {
    data: trends,
    isLoading,
    error,
  } = useSWR(["market-trend", make, model], () =>
    api.getMarketTrend({ make: make === "All makes" ? undefined : make, model: model || undefined }),
  )

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
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Make (optional)</Label>
              <Select value={make} onValueChange={setMake}>
                <SelectTrigger>
                  <SelectValue placeholder="All makes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All makes">All makes</SelectItem>
                  {filterOptions?.makes.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Model (optional)</Label>
              <Input placeholder="e.g. City, Corolla" value={model} onChange={(e) => setModel(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <Card>
          <CardContent className="py-12 text-center text-destructive">
            Failed to load market trends. Please try again.
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
