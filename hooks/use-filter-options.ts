import { useFilters } from "@/contexts/filters-context"
import { STATIC_FILTERS } from "@/lib/static-data"

export function useFilterOptions() {
  const { filters, loading } = useFilters()

  // Return API filters if available, otherwise fallback to static filters
  return {
    filterOptions: filters || STATIC_FILTERS,
    loading,
  }
}
