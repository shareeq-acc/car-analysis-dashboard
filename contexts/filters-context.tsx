"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { fetchFilters, type FiltersResponse } from "@/lib/api"

interface FiltersContextType {
  filters: FiltersResponse | null
  loading: boolean
  error: string | null
}

const FiltersContext = createContext<FiltersContextType | undefined>(undefined)

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FiltersResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadFilters() {
      try {
        setLoading(true)
        const data = await fetchFilters()
        setFilters(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load filters")
        console.error("Error fetching filters:", err)
      } finally {
        setLoading(false)
      }
    }

    loadFilters()
  }, [])

  return <FiltersContext.Provider value={{ filters, loading, error }}>{children}</FiltersContext.Provider>
}

export function useFilters() {
  const context = useContext(FiltersContext)
  if (context === undefined) {
    throw new Error("useFilters must be used within a FiltersProvider")
  }
  return context
}
