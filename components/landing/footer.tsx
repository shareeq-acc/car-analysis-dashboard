import { Car } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="py-12 border-t border-border bg-card/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Car className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">CarAnalytics</span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/dashboard?tab=market-explorer" className="hover:text-foreground transition-colors">
              Market Explorer
            </Link>
            <Link href="/dashboard?tab=price-intelligence" className="hover:text-foreground transition-colors">
              Price Intelligence
            </Link>
            <Link href="/dashboard?tab=compare" className="hover:text-foreground transition-colors">
              Compare Models
            </Link>
          </nav>

          <p className="text-sm text-muted-foreground">© 2025 CarAnalytics. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
