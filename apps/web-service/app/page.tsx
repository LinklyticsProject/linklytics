import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LinkIcon, BarChart3, Zap, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <LinkIcon className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">LinkShort</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link href="/register">
              <Button>Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Shorten URLs. Track clicks. Grow faster.
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty leading-relaxed">
            Create short, memorable links and get detailed analytics on every click. Perfect for marketers, developers,
            and businesses.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8">
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/analytics">
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                View Analytics
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto">
          <div className="p-6 rounded-lg bg-card border border-border">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Lightning fast</h3>
            <p className="text-muted-foreground leading-relaxed">
              Create short links instantly and redirect users in milliseconds with our optimized infrastructure.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-card border border-border">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Detailed analytics</h3>
            <p className="text-muted-foreground leading-relaxed">
              Track every click with comprehensive analytics including location, device, and referrer data.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-card border border-border">
            <div className="w-12 h-12 rounded-lg bg-chart-3/10 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-chart-3" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Secure & reliable</h3>
            <p className="text-muted-foreground leading-relaxed">
              Your links are protected with enterprise-grade security and 99.9% uptime guarantee.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
