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
import { Badge } from "@/components/ui/badge"
import { GitCompare, Loader2, TrendingUp, Users, Percent, Settings, Lightbulb, CheckCircle } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

function formatPrice(price: number): string {
  if (price >= 10000000) {
    return `PKR ${(price / 10000000).toFixed(2)}Cr`
  } else if (price >= 100000) {
    return `PKR ${(price / 100000).toFixed(2)}L`
  }
  return `PKR ${price.toLocaleString()}`
}

export function CompareModels() {
  const { data: filterOptions } = useSWR<FilterOptions>("filters", () => api.getFilters())

  const [model1, setModel1] = useState("")
  const [model2, setModel2] = useState("")
  const [make1, setMake1] = useState("")
  const [make2, setMake2] = useState("")
  const [metric, setMetric] = useState("price")
  const [yearsToUse, setYearsToUse] = useState(7)
  const [submitted, setSubmitted] = useState(false)

  const {
    data: comparison,
    isLoading,
    error,
  } = useSWR(submitted && model1 && model2 ? ["compare", model1, model2, make1, make2, metric, yearsToUse] : null, () =>
    api.compareModels({
      model1,
      model2,
      make1: make1 || undefined,
      make2: make2 || undefined,
      metric,
      years_to_use: yearsToUse,
    }),
  )

  const handleCompare = () => {
    if (model1 && model2) {
      setSubmitted(true)
    }
  }

  // Prepare chart data for price comparison
  const priceChartData =
    comparison?.metric === "price" && comparison.comparison
      ? (() => {
          const model1Data =
            comparison.comparison[model1.toLowerCase()] || comparison.comparison[Object.keys(comparison.comparison)[0]]
          const model2Data =
            comparison.comparison[model2.toLowerCase()] || comparison.comparison[Object.keys(comparison.comparison)[1]]

          if (!model1Data || !model2Data) return []

          const allYears = new Set<number>()
          model1Data.historical_data?.forEach((d: any) => allYears.add(d.year))
          model2Data.historical_data?.forEach((d: any) => allYears.add(d.year))
          model1Data.future_predictions?.forEach((d: any) => allYears.add(d.year))
          model2Data.future_predictions?.forEach((d: any) => allYears.add(d.year))

          return Array.from(allYears)
            .sort()
            .map((year) => {
              const m1Hist = model1Data.historical_data?.find((d: any) => d.year === year)
              const m1Pred = model1Data.future_predictions?.find((d: any) => d.year === year)
              const m2Hist = model2Data.historical_data?.find((d: any) => d.year === year)
              const m2Pred = model2Data.future_predictions?.find((d: any) => d.year === year)

              return {
                year,
                [model1]: m1Hist?.price || m1Pred?.price || null,
                [model2]: m2Hist?.price || m2Pred?.price || null,
                [`${model1}_type`]: m1Pred ? "predicted" : "historical",
                [`${model2}_type`]: m2Pred ? "predicted" : "historical",
              }
            })
        })()
      : []

  return (
    <div className="space-y-6">
      {/* Selection Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCompare className="w-5 h-5" />
            Compare Models
          </CardTitle>
          <CardDescription>Compare two car models head-to-head on various metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Model 1 */}
            <div className="space-y-4 p-4 rounded-lg bg-secondary/50">
              <h3 className="font-semibold">Model 1</h3>
              <div className="space-y-2">
                <Label>Model *</Label>
                <Input
                  placeholder="e.g. City"
                  value={model1}
                  onChange={(e) => {
                    setModel1(e.target.value)
                    setSubmitted(false)
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Make (optional)</Label>
                <Select
                  value={make1}
                  onValueChange={(v) => {
                    setMake1(v)
                    setSubmitted(false)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All makes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All makes</SelectItem>
                    {filterOptions?.makes.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Model 2 */}
            <div className="space-y-4 p-4 rounded-lg bg-secondary/50">
              <h3 className="font-semibold">Model 2</h3>
              <div className="space-y-2">
                <Label>Model *</Label>
                <Input
                  placeholder="e.g. Corolla"
                  value={model2}
                  onChange={(e) => {
                    setModel2(e.target.value)
                    setSubmitted(false)
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Make (optional)</Label>
                <Select
                  value={make2}
                  onValueChange={(v) => {
                    setMake2(v)
                    setSubmitted(false)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All makes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All makes</SelectItem>
                    {filterOptions?.makes.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Metric Selection */}
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label>Comparison Metric</Label>
              <Select
                value={metric}
                onValueChange={(v) => {
                  setMetric(v)
                  setSubmitted(false)
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="depreciation">Depreciation</SelectItem>
                  <SelectItem value="features">Features</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {metric === "price" && (
              <div className="space-y-2">
                <Label>Years to use: {yearsToUse}</Label>
                <Slider
                  value={[yearsToUse]}
                  min={3}
                  max={20}
                  step={1}
                  onValueChange={(v) => {
                    setYearsToUse(v[0])
                    setSubmitted(false)
                  }}
                />
              </div>
            )}
          </div>

          <Button onClick={handleCompare} disabled={!model1 || !model2 || isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Comparing...
              </>
            ) : (
              "Compare Models"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Error */}
      {error && (
        <Card>
          <CardContent className="py-12 text-center text-destructive">
            Failed to compare models. Please try different models.
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {comparison && !isLoading && (
        <>
          {/* Price Comparison */}
          {comparison.metric === "price" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Price Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={priceChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="year" stroke="#888" />
                        <YAxis stroke="#888" tickFormatter={(v) => formatPrice(v).replace("PKR ", "")} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1e1e1e",
                            border: "1px solid #333",
                            borderRadius: "8px",
                          }}
                          formatter={(value: number) => formatPrice(value)}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey={model1}
                          stroke="#10b981"
                          strokeWidth={2}
                          dot={{ fill: "#10b981" }}
                        />
                        <Line
                          type="monotone"
                          dataKey={model2}
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ fill: "#3b82f6" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Price Metrics */}
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(comparison.comparison).map(([key, data]: [string, any]) => (
                  <Card key={key} className="border-primary/30">
                    <CardHeader>
                      <CardTitle className="text-lg capitalize">
                        {data.make ? `${data.make} ` : ""}
                        {key}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 rounded bg-secondary">
                          <p className="text-xs text-muted-foreground mb-1">Current Price</p>
                          <p className="font-semibold text-primary">{formatPrice(data.current_price)}</p>
                        </div>
                        <div className="text-center p-3 rounded bg-secondary">
                          <p className="text-xs text-muted-foreground mb-1">3Y Predicted</p>
                          <p className="font-semibold">{formatPrice(data.predicted_price_3y)}</p>
                        </div>
                        <div className="col-span-2 text-center p-3 rounded bg-primary/10">
                          <p className="text-xs text-muted-foreground mb-1">Growth Rate</p>
                          <p className="font-semibold text-primary">{data.growth_rate?.toFixed(1)}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* Popularity Comparison */}
          {comparison.metric === "popularity" && (
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(comparison.comparison).map(([key, data]: [string, any]) => (
                <Card key={key}>
                  <CardHeader>
                    <CardTitle className="text-lg capitalize flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {data.make ? `${data.make} ` : ""}
                      {key}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center p-4 rounded bg-secondary">
                        <p className="text-sm text-muted-foreground mb-1">Total Listings</p>
                        <p className="text-3xl font-bold">{data.total_listings}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 rounded bg-secondary">
                          <p className="text-xs text-muted-foreground mb-1">Recent Listings</p>
                          <p className="font-semibold">{data.recent_listings}</p>
                        </div>
                        <div className="text-center p-3 rounded bg-primary/10">
                          <p className="text-xs text-muted-foreground mb-1">Market Share</p>
                          <p className="font-semibold text-primary">{data.market_share?.toFixed(1)}%</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Depreciation Comparison */}
          {comparison.metric === "depreciation" && (
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(comparison.comparison).map(([key, data]: [string, any]) => (
                <Card key={key}>
                  <CardHeader>
                    <CardTitle className="text-lg capitalize flex items-center gap-2">
                      <Percent className="w-4 h-4" />
                      {data.make ? `${data.make} ` : ""}
                      {key}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center p-4 rounded bg-secondary">
                        <p className="text-sm text-muted-foreground mb-1">Value Retention</p>
                        <p className="text-3xl font-bold text-primary">{data.value_retention?.toFixed(1)}%</p>
                      </div>
                      <div className="text-center p-3 rounded bg-destructive/10">
                        <p className="text-xs text-muted-foreground mb-1">Annual Depreciation</p>
                        <p className="font-semibold text-destructive">{data.annual_depreciation_rate?.toFixed(1)}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Features Comparison */}
          {comparison.metric === "features" && (
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(comparison.comparison).map(([key, data]: [string, any]) => (
                <Card key={key}>
                  <CardHeader>
                    <CardTitle className="text-lg capitalize flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      {data.make ? `${data.make} ` : ""}
                      {key}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 rounded bg-secondary">
                          <p className="text-xs text-muted-foreground mb-1">Avg Engine</p>
                          <p className="font-semibold">{data.avg_engine_capacity}cc</p>
                        </div>
                        <div className="text-center p-3 rounded bg-secondary">
                          <p className="text-xs text-muted-foreground mb-1">Automatic %</p>
                          <p className="font-semibold">{data.automatic_percentage?.toFixed(1)}%</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Fuel Types:</p>
                        <div className="flex flex-wrap gap-2">
                          {data.fuel_types &&
                            Object.entries(data.fuel_types).map(([fuel, count]: [string, any]) => (
                              <Badge key={fuel} variant="secondary">
                                {fuel}: {count}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Insights */}
          {comparison.insights && comparison.insights.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {comparison.insights.map((insight, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Recommendation */}
          {comparison.recommendation && (
            <Card className="border-primary/50 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Recommendation</p>
                    <p className="font-semibold">{comparison.recommendation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {!submitted && !isLoading && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Enter two models above and select a metric to compare them
          </CardContent>
        </Card>
      )}
    </div>
  )
}
