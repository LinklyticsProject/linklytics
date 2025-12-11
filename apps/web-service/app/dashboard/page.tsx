"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { LinkIcon, Copy, Trash2, BarChart3, ExternalLink } from "lucide-react"
import NextLink from "next/link"
import { useShortLink } from "@/hooks/useShortLink"

export default function DashboardPage() {
  const [url, setUrl] = useState("")
  const [title, setTitle] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // ✅ ใช้ Custom Hook แทนการเขียน logic เอง
  const { links, createLink, deleteLink, isLoading, error } = useShortLink()

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await createLink(url, title)
      
      // ล้างฟอร์มเมื่อสร้างสำเร็จ
      setUrl("")
      setTitle("")
      
    } catch (error) {
      alert("Error creating link. Please try again.")
      console.error(error)
    }
  }

  const handleCopy = (shortCode: string, linkId: string) => {
    // ใช้ window.location.origin หรือกำหนด base URL ตายตัว
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
    const shortUrl = `${baseUrl}/${shortCode}` 
    navigator.clipboard.writeText(shortUrl)
    setCopiedId(linkId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDelete = async (linkId: string) => {
    if (confirm("Are you sure you want to delete this link?")) {
      deleteLink(linkId)
      // TODO: อย่าลืมทำ API Delete ที่ Backend + Service ด้วยนะครับ
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <NextLink href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <LinkIcon className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">LinkShort</span>
          </NextLink>
          <div className="flex items-center gap-4">
            <NextLink href="/dashboard/analytics">
              <Button variant="ghost" size="sm">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </NextLink>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-5xl">
        {/* แสดง Error ถ้ามี */}
        {error && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive/50 rounded-lg text-destructive">
            <p className="text-sm font-medium">Error: {error}</p>
          </div>
        )}

        {/* Create Link Form */}
        <Card className="p-6 mb-8 bg-card border-border">
          <h2 className="text-2xl font-bold text-foreground mb-4">Create Short Link</h2>
          <form onSubmit={handleCreateLink} className="space-y-4">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-foreground mb-2">
                Destination URL
              </label>
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/very-long-url"
                required
                className="bg-secondary border-border"
              />
            </div>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                Title (optional)
              </label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Campaign Link"
                className="bg-secondary border-border"
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? "Creating..." : "Create Short Link"}
            </Button>
          </form>
        </Card>

        {/* Links List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground">Your Links</h2>
            <span className="text-sm text-muted-foreground">{links.length} total</span>
          </div>

          {isLoading && links.length === 0 ? (
            <Card className="p-12 text-center bg-card border-border">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-muted-foreground">Loading your links...</p>
            </Card>
          ) : links.length === 0 ? (
            <Card className="p-12 text-center bg-card border-border">
              <LinkIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No links yet. Create your first short link above!</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {links.map((link) => (
                <Card key={link.id} className="p-4 bg-card border-border hover:border-primary/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {link.title && <h3 className="font-semibold text-foreground mb-1">{link.title}</h3>}
                      <div className="flex items-center gap-2 mb-2">
                        <code className="text-sm font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                          {process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/{link.shortCode}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(link.shortCode, link.id)}
                          className="h-7 px-2"
                        >
                          <Copy className="w-3 h-3" />
                          {copiedId === link.id && <span className="ml-1 text-xs">Copied!</span>}
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ExternalLink className="w-3 h-3" />
                        <span className="truncate">{link.originalUrl}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>{link.clicks} clicks</span>
                        <span>Created {new Date(link.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <NextLink href={`/dashboard/analytics?link=${link.id}`}>
                        <Button variant="ghost" size="sm">
                          <BarChart3 className="w-4 h-4" />
                        </Button>
                      </NextLink>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(link.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}