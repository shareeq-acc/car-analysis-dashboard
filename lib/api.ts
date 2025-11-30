import { API_BASE_URL, API_ENDPOINTS } from "./api-config"

export interface StatisticsResponse {
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

export interface FiltersResponse {
  makes: string[]
  transmissions: string[]
  fuel_types: string[]
  seller_types: string[]
  year_range: {
    min: number
    max: number
  }
  price_range: {
    min: number
    max: number
  }
  mileage_range: {
    min: number
    max: number
  }
}

export async function fetchStatistics(): Promise<StatisticsResponse> {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.statistics}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch statistics: ${response.statusText}`)
  }

  return response.json()
}

export async function fetchFilters(): Promise<FiltersResponse> {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.filters}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch filters: ${response.statusText}`)
  }

  return response.json()
}

export interface PriceEstimateParams {
  make: string
  model: string
  year: number
  mileage: number
  transmission: string
  fuel_type: string
}

export interface PriceEstimateResponse {
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

export async function estimatePrice(params: PriceEstimateParams): Promise<PriceEstimateResponse> {
  const queryParams = new URLSearchParams({
    make: params.make.toLowerCase(),
    model: params.model.toLowerCase(),
    year: params.year.toString(),
    mileage: params.mileage.toString(),
    transmission: params.transmission.toLowerCase(),
    fuel_type: params.fuel_type.toLowerCase(),
  })

  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.estimatePrice}?${queryParams}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Failed to estimate price: ${response.statusText}`)
  }

  return response.json()
}

export interface PricePredictionParams {
  model: string
  make?: string
}

export interface PricePredictionResponse {
  model: string
  make: string
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

export async function fetchPricePrediction(params: PricePredictionParams): Promise<PricePredictionResponse> {
  const queryParams = new URLSearchParams({
    model: params.model.toLowerCase(),
  })

  if (params.make && params.make !== "all") {
    queryParams.append("make", params.make.toLowerCase())
  }

  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.pricePrediction}?${queryParams}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch price prediction: ${response.statusText}`)
  }

  return response.json()
}

export interface PriceAnalysisParams {
  group_by?: "make" | "model" | "year" | "city"
  make?: string
  model?: string
  year?: number
}

export interface PriceAnalysisResponse {
  group_by: string
  filters: {
    make: string | null
    model: string | null
    year: number | null
  }
  analysis: Array<{
    [key: string]: any
    average_price: number
    min_price: number
    max_price: number
    count: number
  }>
}

export async function fetchPriceAnalysis(params: PriceAnalysisParams): Promise<PriceAnalysisResponse> {
  const queryParams = new URLSearchParams()

  if (params.group_by) {
    queryParams.append("group_by", params.group_by)
  }

  if (params.make && params.make !== "all") {
    queryParams.append("make", params.make.toLowerCase())
  }

  if (params.model) {
    queryParams.append("model", params.model.toLowerCase())
  }

  if (params.year) {
    queryParams.append("year", params.year.toString())
  }

  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.priceAnalysis}?${queryParams}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch price analysis: ${response.statusText}`)
  }

  return response.json()
}

export interface SearchCarsParams {
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
  page?: number
  limit?: number
}

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

export interface SearchCarsResponse {
  cars: Car[]
  pagination: {
    page: number
    limit: number
    total_count: number
    total_pages: number
  }
}

export async function searchCars(params: SearchCarsParams): Promise<SearchCarsResponse> {
  const queryParams = new URLSearchParams()

  if (params.make && params.make !== "all") {
    queryParams.append("make", params.make.toLowerCase())
  }

  if (params.model) {
    queryParams.append("model", params.model.toLowerCase())
  }

  if (params.year_min) {
    queryParams.append("year_min", params.year_min.toString())
  }

  if (params.year_max) {
    queryParams.append("year_max", params.year_max.toString())
  }

  if (params.price_min) {
    queryParams.append("price_min", params.price_min.toString())
  }

  if (params.price_max) {
    queryParams.append("price_max", params.price_max.toString())
  }

  if (params.mileage_min) {
    queryParams.append("mileage_min", params.mileage_min.toString())
  }

  if (params.mileage_max) {
    queryParams.append("mileage_max", params.mileage_max.toString())
  }

  if (params.transmission && params.transmission !== "all") {
    queryParams.append("transmission", params.transmission.toLowerCase())
  }

  if (params.fuel_type && params.fuel_type !== "all") {
    queryParams.append("fuel_type", params.fuel_type.toLowerCase())
  }

  if (params.city) {
    queryParams.append("city", params.city.toLowerCase())
  }

  if (params.page) {
    queryParams.append("page", params.page.toString())
  }

  if (params.limit) {
    queryParams.append("limit", params.limit.toString())
  }

  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.cars}?${queryParams}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Failed to search cars: ${response.statusText}`)
  }

  return response.json()
}

export interface SimilarCarsParams {
  make: string
  model: string
  year: number
  price?: number
  engine_capacity?: number
  limit?: number
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

export interface SimilarCarsResponse {
  reference: {
    make: string
    model: string
    year: number
    price?: number
    engine_capacity?: number
  }
  similar_cars: SimilarCar[]
  count: number
}

export async function fetchSimilarCars(params: SimilarCarsParams): Promise<SimilarCarsResponse> {
  const queryParams = new URLSearchParams({
    make: params.make.toLowerCase(),
    model: params.model.toLowerCase(),
    year: params.year.toString(),
  })

  if (params.price) {
    queryParams.append("price", params.price.toString())
  }

  if (params.engine_capacity) {
    queryParams.append("engine_capacity", params.engine_capacity.toString())
  }

  if (params.limit) {
    queryParams.append("limit", params.limit.toString())
  }

  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.similarCars}?${queryParams}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch similar cars: ${response.statusText}`)
  }

  return response.json()
}

export interface BestValueParams {
  budget_min: number
  budget_max: number
  year_min?: number
  limit?: number
}

export interface BestValueCar {
  make: string
  model: string
  year: number
  price: number
  mileage: number
  transmission: string
  fuel_type: string
  engine_capacity: number
  city: string
  url: string
}

export interface BestValueResponse {
  budget_range: {
    min: number
    max: number
  }
  best_value_cars: BestValueCar[]
  count: number
}

export async function fetchBestValue(params: BestValueParams): Promise<BestValueResponse> {
  const queryParams = new URLSearchParams({
    budget_min: params.budget_min.toString(),
    budget_max: params.budget_max.toString(),
  })

  if (params.year_min) {
    queryParams.append("year_min", params.year_min.toString())
  }

  if (params.limit) {
    queryParams.append("limit", params.limit.toString())
  }

  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.bestValue}?${queryParams}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch best value cars: ${response.statusText}`)
  }

  return response.json()
}

export interface MarketTrendParams {
  make?: string
  model?: string
}

export interface MarketTrendResponse {
  make?: string
  model?: string
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

export async function fetchMarketTrend(params: MarketTrendParams): Promise<MarketTrendResponse> {
  const queryParams = new URLSearchParams()

  if (params.make) {
    queryParams.append("make", params.make.toLowerCase())
  }

  if (params.model) {
    queryParams.append("model", params.model.toLowerCase())
  }

  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.marketTrend}?${queryParams}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch market trend: ${response.statusText}`)
  }

  return response.json()
}

export interface CompareModelsParams {
  model1: string
  model2: string
  metric?: "price" | "popularity" | "depreciation" | "features"
  make1?: string
  make2?: string
  years_to_use?: number
}

export interface CompareModelsResponse {
  metric: string
  comparison: {
    [key: string]: any
  }
  insights: string[]
  recommendation: string
}

export async function compareModels(params: CompareModelsParams): Promise<CompareModelsResponse> {
  const queryParams = new URLSearchParams({
    model1: params.model1.toLowerCase(),
    model2: params.model2.toLowerCase(),
  })

  if (params.metric) {
    queryParams.append("metric", params.metric)
  }

  if (params.make1) {
    queryParams.append("make1", params.make1.toLowerCase())
  }

  if (params.make2) {
    queryParams.append("make2", params.make2.toLowerCase())
  }

  if (params.years_to_use) {
    queryParams.append("years_to_use", params.years_to_use.toString())
  }

  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.compare}?${queryParams}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Failed to compare models: ${response.statusText}`)
  }

  return response.json()
}
