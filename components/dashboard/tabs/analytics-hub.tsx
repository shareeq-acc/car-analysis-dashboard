"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { PieChartIcon } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { STATIC_FILTERS } from "@/lib/static-data"

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"]

export function AnalyticsHub() {
  const filterOptions = STATIC_FILTERS

  const [selectedFilter, setSelectedFilter] = useState("makes")

  const makesData = filterOptions.makes.slice(0, 15).map((make, i) => ({
    name: make,
    value: 100 - i * 5,
  }))

  const transmissionData = filterOptions.transmissions.map((t) => ({
    name: t,
    value: t === "Automatic" ? 60 : 40,
  }))

  const fuelData = filterOptions.fuel_types.map((f, i) => ({
    name: f,
    value: [50, 25, 15, 7, 3][i] || 5,
  }))

  return (
    <div className="space-y-6">
      {/* Filter Options Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="w-5 h-5" />
            Analytics Hub
          </CardTitle>
          <CardDescription>Explore available filter options and data distributions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Select Data to View</Label>
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="makes">Makes Distribution</SelectItem>
                <SelectItem value="transmissions">Transmission Types</SelectItem>
                <SelectItem value="fuel_types">Fuel Types</SelectItem>
                <SelectItem value="ranges">Data Ranges</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Makes Distribution */}
      {selectedFilter === "makes" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Available Makes ({filterOptions.makes.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-6">
              {filterOptions.makes.map((make) => (
                <Badge key={make} variant="secondary">
                  {make}
                </Badge>
              ))}
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={makesData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis type="number" stroke="#888" />
                  <YAxis dataKey="name" type="category" width={100} stroke="#888" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e1e1e",
                      border: "1px solid #333",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transmission Types */}
      {selectedFilter === "transmissions" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Transmission Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-6">
              {filterOptions.transmissions.map((t) => (
                <Badge key={t} variant="secondary">
                  {t}
                </Badge>
              ))}
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={transmissionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
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
      )}

      {/* Fuel Types */}
      {selectedFilter === "fuel_types" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Fuel Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-6">
              {filterOptions.fuel_types.map((f) => (
                <Badge key={f} variant="secondary">
                  {f}
                </Badge>
              ))}
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={fuelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
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
      )}

      {/* Data Ranges */}
      {selectedFilter === "ranges" && (
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Year Range</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-4xl font-bold text-primary">
                  {filterOptions.year_range.min} - {filterOptions.year_range.max}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {filterOptions.year_range.max - filterOptions.year_range.min} years of data
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Price Range</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">Min</p>
                <p className="text-2xl font-bold">PKR {(filterOptions.price_range.min / 100000).toFixed(1)}L</p>
                <p className="text-sm text-muted-foreground mt-4">Max</p>
                <p className="text-2xl font-bold text-primary">
                  PKR {(filterOptions.price_range.max / 10000000).toFixed(1)}Cr
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Mileage Range</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">Min</p>
                <p className="text-2xl font-bold">{filterOptions.mileage_range.min.toLocaleString()} km</p>
                <p className="text-sm text-muted-foreground mt-4">Max</p>
                <p className="text-2xl font-bold text-primary">{filterOptions.mileage_range.max.toLocaleString()} km</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Seller Types */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Seller Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {filterOptions.seller_types.map((s) => (
              <div key={s} className="flex-1 min-w-[150px] p-4 rounded-lg bg-secondary text-center">
                <p className="font-semibold">{s}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
