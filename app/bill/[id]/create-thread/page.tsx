"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Upload, FileText, Music, Palette } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState } from "react"

export default function CreateThreadPage() {
  const params = useParams()
  const [threadType, setThreadType] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const threadTypes = [
    { value: "zine", label: "Zine", icon: FileText, description: "Digital magazine or publication" },
    { value: "art", label: "Protest Art", icon: Palette, description: "Visual art, posters, graphics" },
    { value: "music", label: "Protest Music", icon: Music, description: "Songs, audio content" },
    { value: "blog", label: "Blog Post", icon: FileText, description: "Written analysis or opinion" },
  ]

  const getTypeIcon = (type: string) => {
    const typeObj = threadTypes.find((t) => t.value === type)
    return typeObj ? typeObj.icon : FileText
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
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-white font-medium mb-2">Upload Content</label>
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-gray-600 transition-colors">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">Drag and drop your files here, or click to browse</p>
                <p className="text-gray-500 text-sm">Supports images, PDFs, audio files, and documents</p>
                <Button className="mt-4 bg-gray-800 hover:bg-gray-700 text-white border border-gray-600">
                  Choose Files
                </Button>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-white font-medium mb-2">Tags</label>
              <Input
                placeholder="Add tags separated by commas (e.g., climate, activism, art)..."
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                className="flex-1 bg-advoline-orange hover:bg-advoline-orange/90 text-black font-bold"
                disabled={!threadType || !title || !description}
              >
                Publish Thread
              </Button>
              <Button variant="outline" className="border-gray-600 text-gray-400 hover:text-white bg-transparent">
                Save Draft
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
