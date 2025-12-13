"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { LinkIcon, ArrowLeft, TrendingUp, MousePointerClick, Calendar, ExternalLink } from "lucide-react"
import NextLink from "next/link"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

const mockLinks = [
  {
    id: "1",
    shortCode: "abc123",
    originalUrl: "https://example.com/very-long-url",
    title: "Example Link",
    clicks: 156,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    shortCode: "xyz789",
    originalUrl: "https://github.com/vercel/next.js",
    title: "Next.js Repository",
    clicks: 89,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

const mockAnalytics = [
  { timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() },
  { timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  { timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
  { timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  { timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  { timestamp: new Date().toISOString() },
]

export default function AnalyticsPage() {
  const searchParams = useSearchParams()
  const linkId = searchParams.get("link")

  const [links] = useState(mockLinks)
  const [selectedLink, setSelectedLink] = useState(mockLinks[0])
  const [analytics] = useState(mockAnalytics)

  useEffect(() => {
    if (linkId) {
      const link = links.find((l) => l.id === linkId)
      if (link) {
        setSelectedLink(link)
      }
    }
  }, [linkId, links])

  const stats = useMemo(() => {
    if (!selectedLink) return { totalClicks: 0, avgClicksPerDay: 0, lastClick: null }

    const totalClicks = selectedLink.clicks
    const daysSinceCreation = Math.max(
      1,
      Math.floor((Date.now() - new Date(selectedLink.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
    )
    const avgClicksPerDay = (totalClicks / daysSinceCreation).toFixed(1)

    const lastClick = analytics.length > 0 ? analytics[analytics.length - 1].timestamp : null

    return { totalClicks, avgClicksPerDay, lastClick }
  }, [selectedLink, analytics])

  const chartData = useMemo(() => {
    if (!analytics.length) return []

    const clicksByDay = analytics.reduce(
      (acc, event) => {
        const date = new Date(event.timestamp).toLocaleDateString()
        acc[date] = (acc[date] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(clicksByDay)
      .map(([date, clicks]) => ({ date, clicks }))
      .slice(-7)
  }, [analytics])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <NextLink href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </NextLink>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <LinkIcon className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">Analytics</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-6xl">
        {links.length === 0 ? (
          <Card className="p-12 text-center bg-card border-border">
            <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No links to analyze yet.</p>
            <NextLink href="/dashboard">
              <Button>Create your first link</Button>
            </NextLink>
          </Card>
        ) : (
          <>
            {/* Link Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">Select Link</label>
              <select
                value={selectedLink?.id || ""}
                onChange={(e) => {
                  const link = links.find((l) => l.id === e.target.value)
                  if (link) {
                    setSelectedLink(link)
                  }
                }}
                className="w-full px-4 py-2 bg-secondary border border-border rounded-md text-foreground"
              >
                {links.map((link) => (
                  <option key={link.id} value={link.id}>
                    {link.title || link.shortCode} - {link.originalUrl}
                  </option>
                ))}
              </select>
            </div>

            {selectedLink && (
              <>
                {/* Link Info */}
                <Card className="p-6 mb-6 bg-card border-border">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {selectedLink.title && (
                        <h2 className="text-xl font-bold text-foreground mb-2">{selectedLink.title}</h2>
                      )}
                      <div className="flex items-center gap-2 mb-2">
                        <code className="text-sm font-mono text-primary bg-primary/10 px-3 py-1 rounded">
                          {typeof window !== "undefined" && `${window.location.origin}/${selectedLink.shortCode}`}
                        </code>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ExternalLink className="w-3 h-3" />
                        <span className="truncate">{selectedLink.originalUrl}</span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <Card className="p-6 bg-card border-border">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <MousePointerClick className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Clicks</p>
                        <p className="text-2xl font-bold text-foreground">{stats.totalClicks}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-card border-border">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Avg. Clicks/Day</p>
                        <p className="text-2xl font-bold text-foreground">{stats.avgClicksPerDay}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-card border-border">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-chart-3" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Last Click</p>
                        <p className="text-lg font-semibold text-foreground">
                          {stats.lastClick ? new Date(stats.lastClick).toLocaleDateString() : "Never"}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Chart */}
                <Card className="p-6 bg-card border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Clicks Over Time (Last 7 Days)</h3>
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Line type="monotone" dataKey="clicks" stroke="hsl(var(--primary))" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      No click data available yet
                    </div>
                  )}
                </Card>
              </>
            )}
          </>
        )}
      </main>
    </div>
  )
}
