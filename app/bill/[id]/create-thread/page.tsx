"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Upload, FileText, Music, Palette, CheckCircle, X, AlertCircle } from "lucide-react"
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
  const [error, setError] = useState("")
  const [uploadedFile, setUploadedFile] = useState<{
    url: string
    fileName: string
    fileType: string
  } | null>(null)
  const [uploading, setUploading] = useState(false)

  const threadTypes = [
    { value: "zine", label: "Zine", icon: FileText, description: "Digital magazine or publication" },
    { value: "art", label: "Protest Art", icon: Palette, description: "Visual art, posters, graphics" },
    { value: "music", label: "Protest Music", icon: Music, description: "Songs, audio content" },
    { value: "blog", label: "Blog Post", icon: FileText, description: "Written analysis or opinion" },
  ]

  // Clear error when user starts typing
  useEffect(() => {
    if (error) {
      setError("")
    }
  }, [title, description, threadType])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB")
      return
    }

    setUploading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setUploadedFile({
          url: data.url,
          fileName: data.fileName,
          fileType: data.fileType,
        })
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to upload file")
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      setError("Failed to upload file. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!user) {
      setError("Please sign in to create a thread")
      return
    }

    if (!threadType || !title.trim() || !description.trim()) {
      setError("Please fill in all required fields")
      return
    }

    setLoading(true)
    try {
      const threadData = {
        title: title.trim(),
        content: description.trim(),
        type: threadType,
        bill_id: params.id as string,
        author_id: user.id,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        file_url: uploadedFile?.url || null,
        preview_url: uploadedFile?.fileType.startsWith("image/") ? uploadedFile.url : null,
      }

      console.log("Submitting thread data:", threadData)

      const response = await fetch("/api/threads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(threadData),
      })

      const responseData = await response.json()
      console.log("API response:", responseData)

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push(`/bill/${params.id}`)
        }, 2000)
      } else {
        throw new Error(responseData.error || `HTTP ${response.status}: Failed to create thread`)
      }
    } catch (error) {
      console.error("Error creating thread:", error)
      setError(`Failed to create thread: ${error instanceof Error ? error.message : "Unknown error"}`)
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

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
            <p className="text-red-400">{error}</p>
          </div>
        )}

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
                <label className="block text-white font-medium mb-3">Content Type*</label>
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
                <label className="block text-white font-medium mb-2">Title*</label>
                <Input
                  placeholder="Give your thread a compelling title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  required
                  maxLength={200}
                />
                <p className="text-xs text-gray-500 mt-1">{title.length}/200 characters</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-white font-medium mb-2">Description*</label>
                <Textarea
                  placeholder="Describe your content and how it relates to the bill..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  required
                  maxLength={2000}
                />
                <p className="text-xs text-gray-500 mt-1">{description.length}/2000 characters</p>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-white font-medium mb-2">Upload Content</label>
                {uploadedFile ? (
                  <div className="border-2 border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-advoline-orange/20 rounded-lg flex items-center justify-center">
                          <FileText className="h-6 w-6 text-advoline-orange" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{uploadedFile.fileName}</p>
                          <p className="text-gray-400 text-sm">{uploadedFile.fileType}</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeFile}
                        className="text-gray-400 hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-gray-600 transition-colors">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 mb-2">Drag and drop your files here, or click to browse</p>
                    <p className="text-gray-500 text-sm mb-4">
                      Supports images, PDFs, audio files, and videos (max 10MB)
                    </p>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept="image/*,application/pdf,audio/*,video/*"
                      disabled={uploading}
                    />
                    <label htmlFor="file-upload">
                      <Button
                        type="button"
                        className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-600"
                        disabled={uploading}
                        asChild
                      >
                        <span>{uploading ? "Uploading..." : "Choose Files"}</span>
                      </Button>
                    </label>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-white font-medium mb-2">Tags</label>
                <Input
                  placeholder="Add tags separated by commas (e.g., climate, activism, art)..."
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-advoline-orange hover:bg-advoline-orange/90 text-black font-bold"
                  disabled={!threadType || !title.trim() || !description.trim() || loading || uploading}
                >
                  {loading ? "Publishing..." : "Publish Thread"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-600 text-gray-400 hover:text-white bg-transparent"
                  disabled={loading}
                  onClick={() => router.push(`/bill/${params.id}`)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
