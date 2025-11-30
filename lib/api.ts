const API_BASE = "http://localhost:8000"

export interface Car {
  make: string
  model: string
  year: number
  price: number
  mileage: number
  transmission: string
  fuel_type: string
  engine_capacity: number
  city: string
  seller_type: string
  url: string
}

export interface Pagination {
  page: number
  limit: number
  total_count: number
  total_pages: number
}

export interface Statistics {
  total_cars: number
  price_stats: {
    min: number
    max: number
    average: number
    median: number
  }
  year_stats: {
    min: number
    max: number
  }
  mileage_stats: {
    min: number
    max: number
    average: number
  }
  top_makes: Record<string, number>
  top_models: Record<string, number>
  top_cities: Record<string, number>
  transmission_distribution: Record<string, number>
  fuel_type_distribution: Record<string, number>
  seller_type_distribution: Record<string, number>
}

export interface FilterOptions {
  makes: string[]
  transmissions: string[]
  fuel_types: string[]
  seller_types: string[]
  year_range: { min: number; max: number }
  price_range: { min: number; max: number }
  mileage_range: { min: number; max: number }
}

export interface PriceEstimate {
  input: {
    make: string
    model: string
    year: number
    mileage: number
    transmission: string
    fuel_type: string
  }
  estimated_price: number
  ml_predicted_price: number
  price_range: {
    min: number
    max: number
    avg: number
  }
  similar_cars_count: number
  note: string
}

export interface PricePrediction {
  model: string
  make: string | null
  data: Array<{
    year: number
    price: number
    type: "historical" | "predicted"
  }>
  model_stats: {
    slope: number
    intercept: number
    total_data_points: number
    training_data_points: number
    years_used_for_training: number
    latest_year: number
  }
}

export interface PriceAnalysis {
  group_by: string
  filters: {
    make: string | null
    model: string | null
    year: number | null
  }
  analysis: Array<{
    [key: string]: string | number
    average_price: number
    min_price: number
    max_price: number
    count: number
  }>
}

export interface SimilarCar {
  make: string
  model: string
  year: number
  engine_capacity: number
  average_price: number
  price_range: {
    min: number
    max: number
  }
  count: number
  avg_mileage: number
  similarity_score: number
}

export interface BestValueCar extends Car {
  value_score?: number
}

export interface MarketTrend {
  make: string | null
  model: string | null
  total_listings: number
  price_trend: {
    current_avg: number
    year_over_year_growth: number
    yearly_data: Array<{
      year: number
      avg_price: number
      count: number
      avg_mileage: number
    }>
  }
  popular_cities: Record<string, number>
  transmission_preference: Record<string, number>
  fuel_type_preference: Record<string, number>
  avg_mileage: number
}

export interface CompareResult {
  metric: string
  comparison: Record<string, any>
  insights: string[]
  recommendation?: string
}

async function fetchApi<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
  const url = new URL(`${API_BASE}${endpoint}`)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.append(key, String(value))
      }
    })
  }
  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }
  return response.json()
}

export const api = {
  // General
  health: () => fetchApi<{ status: string }>("/health"),

  // Car Data
  getMakes: () => fetchApi<{ makes: string[]; count: number }>("/makes"),
  getModels: (
    make: string,
    params?: {
      year_min?: number
      year_max?: number
      price_min?: number
      price_max?: number
      page?: number
      limit?: number
    },
  ) => fetchApi<{ make: string; models: string[]; pagination: Pagination }>("/models", { make, ...params }),

  searchCars: (params: {
    make?: string
    model?: string
    year_min?: number
    year_max?: number
    price_min?: number
    price_max?: number
    mileage_min?: number
    mileage_max?: number
    transmission?: string
    fuel_type?: string
    city?: string
    seller_type?: string
    page?: number
    limit?: number
  }) => fetchApi<{ cars: Car[]; pagination: Pagination }>("/cars", params),

  getStatistics: () => fetchApi<Statistics>("/statistics"),
  getFilters: () => fetchApi<FilterOptions>("/filters"),

  getPriceAnalysis: (params: {
    group_by?: string
    make?: string
    model?: string
    year?: number
  }) => fetchApi<PriceAnalysis>("/price-analysis", params),

  getPricePrediction: (params: {
    model: string
    make?: string
    years_to_use?: number
  }) => fetchApi<PricePrediction>("/price-prediction", params),

  // ML Endpoints
  estimatePrice: (params: {
    make: string
    model: string
    year: number
    mileage: number
    transmission: string
    fuel_type: string
  }) => fetchApi<PriceEstimate>("/ml/estimate-price", params),

  findSimilarCars: (params: {
    make: string
    model: string
    year: number
    price?: number
    engine_capacity?: number
    limit?: number
  }) => fetchApi<{ reference: any; similar_cars: SimilarCar[]; count: number }>("/ml/similar-cars", params),

  getBestValue: (params: {
    budget_min: number
    budget_max: number
    year_min?: number
    limit?: number
  }) =>
    fetchApi<{ budget_range: { min: number; max: number }; best_value_cars: BestValueCar[]; count: number }>(
      "/ml/best-value",
      params,
    ),

  getMarketTrend: (params?: {
    make?: string
    model?: string
  }) => fetchApi<MarketTrend>("/ml/market-trend", params),

  // Comparison
  compareModels: (params: {
    model1: string
    model2: string
    metric?: string
    make1?: string
    make2?: string
    years_to_use?: number
  }) => fetchApi<CompareResult>("/compare/", params),
}
