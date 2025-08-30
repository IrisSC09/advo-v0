"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Upload, FileText, Music, Palette, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"

export default function CreateThreadPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [threadType, setThreadType] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const threadTypes = [
    { value: "zine", label: "Zine", icon: FileText, description: "Digital magazine or publication" },
    { value: "art", label: "Protest Art", icon: Palette, description: "Visual art, posters, graphics" },
    { value: "music", label: "Protest Music", icon: Music, description: "Songs, audio content" },
    { value: "blog", label: "Blog Post", icon: FileText, description: "Written analysis or opinion" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      alert("Please sign in to create a thread")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/threads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content: description,
          type: threadType,
          bill_id: params.id,
          author_id: user.id,
          tags: tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        }),
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push(`/bill/${params.id}`)
        }, 2000)
      } else {
        throw new Error("Failed to create thread")
      }
    } catch (error) {
      console.error("Error creating thread:", error)
      alert("Failed to create thread. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Sign In Required</h2>
            <p className="text-gray-400 mb-6">You need to be signed in to create a thread.</p>
            <Link href={`/bill/${params.id}`}>
              <Button className="bg-advoline-orange hover:bg-advoline-orange/90 text-black font-bold">
                Back to Bill
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-black pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Thread Created Successfully!</h2>
            <p className="text-gray-400 mb-6">Your thread has been published and will appear on the bill page.</p>
            <Link href={`/bill/${params.id}`}>
              <Button className="bg-advoline-orange hover:bg-advoline-orange/90 text-black font-bold">View Bill</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href={`/bill/${params.id}`} className="inline-flex items-center text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Bill
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-4">
            CREATE <span className="text-neon-purple neon-glow font-extralight">THREAD</span>
          </h1>
          <p className="text-gray-400 text-lg font-light">
            Share your creative content to help others understand and engage with this legislation.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">New Thread</CardTitle>
              <CardDescription className="text-gray-400">
                Create content to help advocate for or against this bill
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Thread Type Selection */}
              <div>
                <label className="block text-white font-medium mb-3">Content Type</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {threadTypes.map((type) => {
                    const Icon = type.icon
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setThreadType(type.value)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          threadType === type.value
                            ? "border-advoline-orange bg-advoline-orange/10"
                            : "border-gray-700 hover:border-gray-600"
                        }`}
                      >
                        <Icon
                          className={`h-6 w-6 mx-auto mb-2 ${
                            threadType === type.value ? "text-advoline-orange" : "text-gray-400"
                          }`}
                        />
                        <div
                          className={`text-sm font-medium ${
                            threadType === type.value ? "text-advoline-orange" : "text-white"
                          }`}
                        >
                          {type.label}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">{type.description}</div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-white font-medium mb-2">Title</label>
                <Input
                  placeholder="Give your thread a compelling title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-white font-medium mb-2">Description</label>
                <Textarea
                  placeholder="Describe your content and how it relates to the bill..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  required
                />
              </div>

              {/* File Upload Placeholder */}
              <div>
                <label className="block text-white font-medium mb-2">Upload Content (Coming Soon)</label>
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center opacity-50">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 mb-2">File upload feature coming soon</p>
                  <p className="text-gray-500 text-sm">For now, include links in your description</p>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-white font-medium mb-2">Tags</label>
                <Input
                  placeholder="Add tags separated by commas (e.g., climate, activism, art)..."
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-advoline-orange hover:bg-advoline-orange/90 text-black font-bold"
                  disabled={!threadType || !title || !description || loading}
                >
                  {loading ? "Publishing..." : "Publish Thread"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-600 text-gray-400 hover:text-white bg-transparent"
                  disabled={loading}
                >
                  Save Draft
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
