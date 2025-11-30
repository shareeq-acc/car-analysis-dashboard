export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export const API_ENDPOINTS = {
  statistics: "/statistics",
  filters: "/filters",
  estimatePrice: "/ml/estimate-price",
  pricePrediction: "/price-prediction",
  priceAnalysis: "/price-analysis",
  cars: "/cars",
  similarCars: "/ml/similar-cars",
  bestValue: "/ml/best-value",
  marketTrend: "/ml/market-trend",
  compare: "/compare",
} as const
