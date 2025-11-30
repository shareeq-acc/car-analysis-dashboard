"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Calculator, LineChart, BarChart3, Loader2 } from "lucide-react"
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from "recharts"
import { STATIC_FILTERS } from "@/lib/static-data"

function formatPrice(price: number): string {
  if (price >= 10000000) {
    return `PKR ${(price / 10000000).toFixed(2)}Cr`
  } else if (price >= 100000) {
    return `PKR ${(price / 100000).toFixed(2)}L`
  }
  return `PKR ${price.toLocaleString()}`
}

const STATIC_ESTIMATE = {
  input: {
    make: "honda",
    model: "city",
    year: 2018,
    mileage: 100000,
    transmission: "auto",
    fuel_type: "petrol",
  },
  estimated_price: 3540000,
  ml_predicted_price: 4520000,
  price_range: {
    min: 2750000,
    max: 4670000,
    avg: 3627387,
  },
  similar_cars_count: 217,
  note: "Estimated price adjusted for typical listing vs actual price difference",
}

const STATIC_PREDICTION_DATA = {
  historical: [
    { year: 2018, price: 2800000 },
    { year: 2019, price: 3100000 },
    { year: 2020, price: 3400000 },
    { year: 2021, price: 3800000 },
    { year: 2022, price: 4100000 },
    { year: 2023, price: 4400000 },
    { year: 2024, price: 4700000 },
  ],
  predicted: [
    { year: 2025, price: 5000000 },
    { year: 2026, price: 5300000 },
    { year: 2027, price: 5600000 },
  ],
  model_stats: {
    training_data_points: 958,
    total_data_points: 1245,
    latest_year: 2024,
    slope: 285000,
  },
}

const STATIC_ANALYSIS = {
  analysis: [
    { make: "Toyota", average_price: 6200000, min_price: 2100000, max_price: 15500000, count: 3476 },
    { make: "Honda", average_price: 4800000, min_price: 1800000, max_price: 12000000, count: 2891 },
    { make: "Suzuki", average_price: 2900000, min_price: 850000, max_price: 6500000, count: 2145 },
    { make: "Hyundai", average_price: 5100000, min_price: 2200000, max_price: 9800000, count: 892 },
    { make: "KIA", average_price: 5800000, min_price: 2800000, max_price: 11500000, count: 756 },
    { make: "Mercedes", average_price: 18500000, min_price: 8500000, max_price: 45000000, count: 234 },
    { make: "BMW", average_price: 16200000, min_price: 7200000, max_price: 38000000, count: 198 },
    { make: "MG", average_price: 6800000, min_price: 4500000, max_price: 9200000, count: 412 },
    { make: "Changan", average_price: 4200000, min_price: 2800000, max_price: 6500000, count: 156 },
    { make: "Audi", average_price: 14500000, min_price: 6800000, max_price: 32000000, count: 145 },
  ],
}

function PriceEstimator() {
  const filterOptions = STATIC_FILTERS

  const [form, setForm] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    mileage: 50000,
    transmission: "Automatic",
    fuel_type: "Petrol",
  })

  const [estimate, setEstimate] = useState<typeof STATIC_ESTIMATE | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!form.make || !form.model) {
      setError("Please fill in all required fields")
      return
    }
    setLoading(true)
    setError(null)
    setTimeout(() => {
      setEstimate(STATIC_ESTIMATE)
      setLoading(false)
    }, 500)
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Price Estimator
          </CardTitle>
          <CardDescription>Get an AI-powered price estimate for any car</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Make *</Label>
              <Select value={form.make} onValueChange={(v) => setForm((p) => ({ ...p, make: v }))}>
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
                placeholder="e.g. City, Corolla"
                value={form.model}
                onChange={(e) => setForm((p) => ({ ...p, model: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Year: {form.year}</Label>
              <Slider
                value={[form.year]}
                min={2000}
                max={new Date().getFullYear()}
                step={1}
                onValueChange={(v) => setForm((p) => ({ ...p, year: v[0] }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Mileage: {form.mileage.toLocaleString()} km</Label>
              <Slider
                value={[form.mileage]}
                min={0}
                max={300000}
                step={5000}
                onValueChange={(v) => setForm((p) => ({ ...p, mileage: v[0] }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Transmission</Label>
              <Select value={form.transmission} onValueChange={(v) => setForm((p) => ({ ...p, transmission: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.transmissions.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Fuel Type</Label>
              <Select value={form.fuel_type} onValueChange={(v) => setForm((p) => ({ ...p, fuel_type: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.fuel_types.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Estimating...
              </>
            ) : (
              "Get Estimate"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Result */}
      <Card className={estimate ? "border-primary/50" : ""}>
        <CardHeader>
          <CardTitle>Estimated Price</CardTitle>
          <CardDescription>Based on {estimate?.similar_cars_count || 0} similar listings</CardDescription>
        </CardHeader>
        <CardContent>
          {estimate ? (
            <div className="space-y-6">
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground mb-2">Estimated Market Value</p>
                <p className="text-5xl font-bold text-primary">{formatPrice(estimate.estimated_price)}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  ML Prediction: {formatPrice(estimate.ml_predicted_price)}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-lg bg-secondary">
                  <p className="text-xs text-muted-foreground mb-1">Min</p>
                  <p className="font-semibold">{formatPrice(estimate.price_range.min)}</p>
                </div>
                <div className="p-4 rounded-lg bg-primary/10">
                  <p className="text-xs text-muted-foreground mb-1">Average</p>
                  <p className="font-semibold text-primary">{formatPrice(estimate.price_range.avg)}</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary">
                  <p className="text-xs text-muted-foreground mb-1">Max</p>
                  <p className="font-semibold">{formatPrice(estimate.price_range.max)}</p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center">{estimate.note}</p>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Enter car details to get an estimate
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function PricePredictions() {
  const filterOptions = STATIC_FILTERS

  const [model, setModel] = useState("")
  const [make, setMake] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [prediction, setPrediction] = useState<typeof STATIC_PREDICTION_DATA | null>(null)

  const handleAnalyze = () => {
    if (!model) return
    setIsLoading(true)
    setTimeout(() => {
      setPrediction(STATIC_PREDICTION_DATA)
      setIsLoading(false)
    }, 500)
  }

  const chartData = prediction
    ? [
        ...prediction.historical.map((d) => ({
          year: d.year,
          historical: d.price,
          predicted: null,
        })),
        // Add the last historical point to predicted for continuity
        {
          year: prediction.historical[prediction.historical.length - 1].year,
          historical: null,
          predicted: prediction.historical[prediction.historical.length - 1].price,
        },
        ...prediction.predicted.map((d) => ({
          year: d.year,
          historical: null,
          predicted: d.price,
        })),
      ]
    : []

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="w-5 h-5" />
            Price Predictions
          </CardTitle>
          <CardDescription>Predict future prices using Linear Regression</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <Label>Model *</Label>
              <Input placeholder="e.g. City, Corolla" value={model} onChange={(e) => setModel(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Make (optional)</Label>
              <Select value={make} onValueChange={setMake}>
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
            <div className="flex items-end">
              <Button onClick={handleAnalyze} disabled={!model || isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Predictions"
                )}
              </Button>
            </div>
          </div>

          {isLoading && (
            <div className="h-80 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {prediction && !isLoading && (
            <>
              <div className="flex items-center justify-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-emerald-500"></div>
                  <span className="text-sm text-muted-foreground">Historical Data</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-blue-500 border-dashed border-t-2 border-blue-500"></div>
                  <span className="text-sm text-muted-foreground">Predicted (2025+)</span>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={chartData}>
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
                        value ? formatPrice(value) : null,
                        name === "historical" ? "Historical" : "Predicted",
                      ]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="historical"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ fill: "#10b981" }}
                      name="Historical"
                      connectNulls={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="predicted"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: "#3b82f6" }}
                      name="Predicted"
                      connectNulls={true}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {!model && !isLoading && !prediction && (
            <div className="h-80 flex items-center justify-center text-muted-foreground">
              Enter a model name to see price predictions
            </div>
          )}
        </CardContent>
      </Card>

      {prediction && (
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">Training Points</p>
              <p className="text-2xl font-bold">{prediction.model_stats.training_data_points}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">Total Data Points</p>
              <p className="text-2xl font-bold">{prediction.model_stats.total_data_points}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">Latest Year</p>
              <p className="text-2xl font-bold">{prediction.model_stats.latest_year}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">Annual Growth</p>
              <p className="text-2xl font-bold text-primary">{formatPrice(prediction.model_stats.slope)}/yr</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

function PriceAnalysisTab() {
  const filterOptions = STATIC_FILTERS

  const [groupBy, setGroupBy] = useState("make")
  const [make, setMake] = useState("")
  const [model, setModel] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [analysis, setAnalysis] = useState<typeof STATIC_ANALYSIS | null>(null)

  const handleAnalyze = () => {
    setIsLoading(true)
    setTimeout(() => {
      setAnalysis(STATIC_ANALYSIS)
      setIsLoading(false)
    }, 500)
  }

  const chartData =
    analysis?.analysis.slice(0, 15).map((item: any) => ({
      name: item[groupBy as string] || "Unknown",
      average: item.average_price,
      min: item.min_price,
      max: item.max_price,
      count: item.count,
    })) || []

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Price Analysis
          </CardTitle>
          <CardDescription>Analyze prices by make, model, year, or city</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <Label>Group By</Label>
              <Select value={groupBy} onValueChange={setGroupBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="make">Make</SelectItem>
                  <SelectItem value="model">Model</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                  <SelectItem value="city">City</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Filter by Make</Label>
              <Select value={make} onValueChange={setMake}>
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
              <Label>Filter by Model</Label>
              <Input placeholder="e.g. City" value={model} onChange={(e) => setModel(e.target.value)} />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAnalyze} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Prices"
                )}
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="h-80 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : analysis ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis type="number" stroke="#888" tickFormatter={(v) => formatPrice(v).replace("PKR ", "")} />
                  <YAxis dataKey="name" type="category" width={100} stroke="#888" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e1e1e",
                      border: "1px solid #333",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => formatPrice(value)}
                  />
                  <Bar dataKey="average" fill="#10b981" name="Average Price" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-muted-foreground">
              Click "Analyze Prices" to see the analysis
            </div>
          )}
        </CardContent>
      </Card>

      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                      {groupBy.charAt(0).toUpperCase() + groupBy.slice(1)}
                    </th>
                    <th className="text-right p-3 text-sm font-medium text-muted-foreground">Count</th>
                    <th className="text-right p-3 text-sm font-medium text-muted-foreground">Min</th>
                    <th className="text-right p-3 text-sm font-medium text-muted-foreground">Average</th>
                    <th className="text-right p-3 text-sm font-medium text-muted-foreground">Max</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.analysis.slice(0, 15).map((item: any, i: number) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-secondary/50">
                      <td className="p-3 font-medium">{item[groupBy as string] || "Unknown"}</td>
                      <td className="p-3 text-right text-muted-foreground">{item.count}</td>
                      <td className="p-3 text-right">{formatPrice(item.min_price)}</td>
                      <td className="p-3 text-right text-primary font-medium">{formatPrice(item.average_price)}</td>
                      <td className="p-3 text-right">{formatPrice(item.max_price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export function PriceIntelligence() {
  return (
    <Tabs defaultValue="estimator" className="space-y-6">
      <TabsList className="grid w-full max-w-md grid-cols-3">
        <TabsTrigger value="estimator">Estimator</TabsTrigger>
        <TabsTrigger value="predictions">Predictions</TabsTrigger>
        <TabsTrigger value="analysis">Analysis</TabsTrigger>
      </TabsList>

      <TabsContent value="estimator">
        <PriceEstimator />
      </TabsContent>
      <TabsContent value="predictions">
        <PricePredictions />
      </TabsContent>
      <TabsContent value="analysis">
        <PriceAnalysisTab />
      </TabsContent>
    </Tabs>
  )
}
