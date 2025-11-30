"use client"

import { MetricCard } from "@/components/dashboard/metric-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, DollarSign, TrendingUp, Users } from "lucide-react"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts"

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"]

const STATIC_STATS = {
  total_cars: 11134,
  price_stats: {
    min: 150000,
    max: 171000000,
    average: 5221849,
    median: 3550000,
  },
  year_stats: {
    min: 1965,
    max: 2025,
  },
  mileage_stats: {
    min: 1,
    max: 1000000,
    average: 89252,
  },
  top_makes: {
    Toyota: 3476,
    Suzuki: 2733,
    Honda: 2146,
    Daihatsu: 556,
    Nissan: 410,
    KIA: 338,
    Hyundai: 306,
    Changan: 160,
    Haval: 151,
    Mitsubishi: 119,
  },
  top_models: {
    Corolla: 1108,
    Civic: 623,
    Alto: 615,
    Cultus: 532,
    Mehran: 507,
    City: 341,
    Raize: 317,
    "Wagon R": 284,
    "City 5th (GM2) Generation": 261,
    Swift: 255,
  },
  top_cities: {
    Lahore: 2807,
    Karachi: 2624,
    Islamabad: 2033,
    Rawalpindi: 700,
    Faisalabad: 382,
    Peshawar: 354,
    Multan: 302,
    Gujranwala: 249,
    Sialkot: 155,
    Sargodha: 98,
  },
  transmission_distribution: {
    Automatic: 7604,
    Manual: 3530,
  },
  fuel_type_distribution: {
    Petrol: 9365,
    Hybrid: 1074,
    Diesel: 474,
    Electric: 141,
    CNG: 65,
  },
  seller_type_distribution: {
    Individual: 6092,
    Featured: 5042,
  },
}

function formatPrice(price: number): string {
  if (price >= 10000000) {
    return `PKR ${(price / 10000000).toFixed(1)}Cr`
  } else if (price >= 100000) {
    return `PKR ${(price / 100000).toFixed(1)}L`
  }
  return `PKR ${price.toLocaleString()}`
}

export function DashboardHome() {
  const stats = STATIC_STATS

  const topMakesData = Object.entries(stats.top_makes)
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }))

  const transmissionData = Object.entries(stats.transmission_distribution).map(([name, value]) => ({
    name,
    value,
  }))

  const fuelTypeData = Object.entries(stats.fuel_type_distribution).map(([name, value]) => ({
    name,
    value,
  }))

  const topCitiesData = Object.entries(stats.top_cities)
    .slice(0, 6)
    .map(([name, value]) => ({ name, value }))

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Cars Listed"
          value={stats.total_cars.toLocaleString()}
          icon={Car}
          loading={false}
          delay={0}
        />
        <MetricCard
          title="Average Price"
          value={formatPrice(stats.price_stats.average)}
          subtitle={`Median: ${formatPrice(stats.price_stats.median)}`}
          icon={DollarSign}
          loading={false}
          delay={100}
        />
        <MetricCard
          title="Top Make"
          value={Object.keys(stats.top_makes)[0]}
          subtitle={`${Object.values(stats.top_makes)[0].toLocaleString()} listings`}
          icon={TrendingUp}
          loading={false}
          delay={200}
        />
        <MetricCard
          title="Year Range"
          value={`${stats.year_stats.min} - ${stats.year_stats.max}`}
          subtitle="Available models"
          icon={Users}
          loading={false}
          delay={300}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Makes Bar Chart */}
        <Card className="animate-fade-in stagger-1">
          <CardHeader>
            <CardTitle className="text-lg">Top Makes by Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topMakesData} layout="vertical">
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
                  <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Cities */}
        <Card className="animate-fade-in stagger-2">
          <CardHeader>
            <CardTitle className="text-lg">Listings by City</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topCitiesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e1e1e",
                      border: "1px solid #333",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pie Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Transmission Distribution */}
        <Card className="animate-fade-in stagger-3">
          <CardHeader>
            <CardTitle className="text-lg">Transmission Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={transmissionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
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

        {/* Fuel Type Distribution */}
        <Card className="animate-fade-in stagger-4">
          <CardHeader>
            <CardTitle className="text-lg">Fuel Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={fuelTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {fuelTypeData.map((entry, index) => (
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

      {/* Top Models Table */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="text-lg">Top Models by Listings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(stats.top_models)
              .slice(0, 10)
              .map(([model, count], index) => (
                <div
                  key={model}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded bg-primary/20 text-primary text-sm flex items-center justify-center font-medium">
                      {index + 1}
                    </span>
                    <span className="font-medium">{model}</span>
                  </div>
                  <span className="text-muted-foreground">{count.toLocaleString()} listings</span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
