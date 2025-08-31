"use client";

import type React from "react";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Upload,
  FileText,
  Music,
  Palette,
  BookOpen,
  X,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-provider";
import AuthModal from "@/components/auth/auth-modal";

export default function CreateThreadPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

  const handleAuthClick = (mode: "signin" | "signup") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const billId = params.id as string;

  const threadTypes = [
    {
      value: "zine",
      label: "Zine",
      icon: FileText,
      description: "Digital magazines, comics, or visual stories",
    },
    {
      value: "art",
      label: "Art",
      icon: Palette,
      description: "Posters, illustrations, or visual activism",
    },
    {
      value: "music",
      label: "Music",
      icon: Music,
      description: "Songs, beats, or audio content",
    },
    {
      value: "blog",
      label: "Blog",
      icon: BookOpen,
      description: "Written articles or opinion pieces",
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check file size (10MB limit)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }

      setFile(selectedFile);
      setError("");

      // Create preview for images
      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 5) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("You must be signed in to create a thread");
      return;
    }

    if (!title.trim() || !content.trim() || !type) {
      setError("Please fill in all required fields");
      return;
    }

    if (title.length > 200) {
      setError("Title must be less than 200 characters");
      return;
    }

    if (content.length > 5000) {
      setError("Content must be less than 5000 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let fileUrl = null;
      let previewUrl = null;

      // Upload file if present
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", "thread");

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          fileUrl = uploadData.url;
          if (file.type.startsWith("image/")) {
            previewUrl = uploadData.url;
          }
        } else {
          console.warn("File upload failed, continuing without file");
        }
      }

      // Create thread
      const threadData = {
        title: title.trim(),
        content: content.trim(),
        type,
        bill_id: billId,
        author_id: user.id,
        tags,
        file_url: fileUrl,
        preview_url: previewUrl,
      };

      console.log("Submitting thread data:", threadData);

      const response = await fetch("/api/threads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(threadData),
      });

      const data = await response.json();
      console.log("API response:", data);

      if (response.ok) {
        // Redirect to the new thread
        router.push(`/threads/${data.thread.id}`);
      } else {
        setError(data.error || "Failed to create thread");
      }
    } catch (error) {
      console.error("Error creating thread:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <Card className="bg-gray-900 border-gray-800 max-w-md">
            <CardContent className="p-8 text-center">
              <h2 className="text-white text-xl font-bold mb-4">
                Sign In Required
              </h2>
              <p className="text-gray-400 mb-6">
                You need to be signed in to create a thread.
              </p>
              <Button
                className="bg-advoline-orange hover:bg-advoline-orange/90 text-black font-bold"
                onClick={() => handleAuthClick("signin")}
              >
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          mode={authMode}
          onModeChange={setAuthMode}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href={`/bill/${billId}`}
          className="inline-flex items-center text-gray-400 hover:text-white mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Bill Details
        </Link>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-4">
            CREATE{" "}
            <span className="text-neon-purple neon-glow font-extralight">
              THREAD
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            Share your creative take on this legislation. Create zines, art,
            music, or blogs to make politics accessible.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Thread Type Selection */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Thread Type *</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {threadTypes.map((threadType) => {
                      const Icon = threadType.icon;
                      return (
                        <div
                          key={threadType.value}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            type === threadType.value
                              ? "border-advoline-orange bg-advoline-orange/10"
                              : "border-gray-700 hover:border-gray-600"
                          }`}
                          onClick={() => setType(threadType.value)}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <Icon className="h-5 w-5 text-advoline-orange" />
                            <span className="text-white font-medium">
                              {threadType.label}
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm">
                            {threadType.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Title */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Title *</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    placeholder="Give your thread a compelling title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    maxLength={200}
                  />
                  <div className="text-right text-sm text-gray-400 mt-1">
                    {title.length}/200
                  </div>
                </CardContent>
              </Card>

              {/* Content */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Content *</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Describe your creative work, its message, and how it relates to this legislation..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 min-h-[200px]"
                    maxLength={5000}
                  />
                  <div className="text-right text-sm text-gray-400 mt-1">
                    {content.length}/5000
                  </div>
                </CardContent>
              </Card>

              {/* File Upload */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">
                    Upload File (Optional)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*,audio/*,.pdf,.doc,.docx"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400 mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-gray-500 text-sm">
                        Images, audio, PDFs, or documents (max 10MB)
                      </p>
                    </label>
                  </div>

                  {file && (
                    <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-white text-sm">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setFile(null);
                            setPreview(null);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {preview && (
                    <div className="mt-4">
                      <img
                        src={preview || "/placeholder.svg"}
                        alt="Preview"
                        className="max-w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Tags */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-3">
                    <Input
                      placeholder="Add a tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addTag())
                      }
                    />
                    <Button
                      type="button"
                      onClick={addTag}
                      disabled={!newTag.trim() || tags.length >= 5}
                    >
                      Add
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        className="bg-advoline-orange text-black"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>

                  <p className="text-gray-500 text-sm mt-2">
                    Add up to 5 tags to help others discover your thread
                  </p>
                </CardContent>
              </Card>

              {/* Submit */}
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={
                      loading || !title.trim() || !content.trim() || !type
                    }
                    className="w-full bg-advoline-orange hover:bg-advoline-orange/90 text-black font-bold"
                  >
                    {loading ? "Creating Thread..." : "Create Thread"}
                  </Button>

                  <p className="text-gray-500 text-sm mt-3 text-center">
                    Your thread will be visible to all users once created
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
