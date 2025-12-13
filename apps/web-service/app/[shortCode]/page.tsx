"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { LinkIcon, ExternalLink } from "lucide-react"

export default function RedirectPage() {
  const params = useParams()
  const router = useRouter()
  const shortCode = params.shortCode as string
  const [error, setError] = useState(false)

  useEffect(() => {
    // In a real app, this would look up the short code and redirect
    setError(true)
  }, [shortCode])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md p-8 bg-card border-border text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <LinkIcon className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Link Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The short link <code className="text-primary">/{shortCode}</code> does not exist or has been deleted.
          </p>
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Go to Homepage
          </button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8 bg-card border-border text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
          <ExternalLink className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Redirecting...</h1>
        <p className="text-muted-foreground">Please wait while we redirect you to your destination.</p>
      </Card>
    </div>
  )
}
