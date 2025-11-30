"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { DashboardHome } from "@/components/dashboard/tabs/dashboard-home"
import { MarketExplorer } from "@/components/dashboard/tabs/market-explorer"
import { PriceIntelligence } from "@/components/dashboard/tabs/price-intelligence"
import { SimilarCars } from "@/components/dashboard/tabs/similar-cars"
import { BestValue } from "@/components/dashboard/tabs/best-value"
import { MarketTrends } from "@/components/dashboard/tabs/market-trends"
import { CompareModels } from "@/components/dashboard/tabs/compare-models"
import { AnalyticsHub } from "@/components/dashboard/tabs/analytics-hub"

const tabConfig: Record<string, { title: string; subtitle: string }> = {
  dashboard: {
    title: "Dashboard",
    subtitle: "Overview of the car market",
  },
  "market-explorer": {
    title: "Market Explorer",
    subtitle: "Search and filter car listings",
  },
  "price-intelligence": {
    title: "Price Intelligence",
    subtitle: "AI-powered price analysis",
  },
  "similar-cars": {
    title: "Similar Cars Finder",
    subtitle: "Find alternatives based on specifications",
  },
  "best-value": {
    title: "Best Value Deals",
    subtitle: "Discover underpriced cars",
  },
  "market-trends": {
    title: "Market Trends",
    subtitle: "Analyze market dynamics",
  },
  compare: {
    title: "Compare Models",
    subtitle: "Head-to-head model comparison",
  },
  analytics: {
    title: "Analytics Hub",
    subtitle: "Deep dive into market data",
  },
}

function DashboardContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tabParam = searchParams.get("tab")
  const [activeTab, setActiveTab] = useState(tabParam || "dashboard")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam)
    }
  }, [tabParam, activeTab])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    router.push(`/dashboard?tab=${tab}`, { scroll: false })
  }

  const { title, subtitle } = tabConfig[activeTab] || tabConfig.dashboard

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardHome />
      case "market-explorer":
        return <MarketExplorer />
      case "price-intelligence":
        return <PriceIntelligence />
      case "similar-cars":
        return <SimilarCars />
      case "best-value":
        return <BestValue />
      case "market-trends":
        return <MarketTrends />
      case "compare":
        return <CompareModels />
      case "analytics":
        return <AnalyticsHub />
      default:
        return <DashboardHome />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="hidden lg:block">
        <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 lg:hidden transform transition-transform duration-300 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            handleTabChange(tab)
            setMobileMenuOpen(false)
          }}
        />
      </div>

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header title={title} subtitle={subtitle} onMenuClick={() => setMobileMenuOpen(true)} />
        <div className="flex-1 overflow-auto p-6">{renderContent()}</div>
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  )
}
