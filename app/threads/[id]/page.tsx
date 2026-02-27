"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Heart, Share2, MessageCircle, FileText, Music, Palette, Send } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/auth/auth-provider"

interface Thread {
  id: string
  title: string
  content: string
  type: string
  bill_id: string
  author_id: string
  file_url: string | null
  preview_url: string | null
  tags: string[]
  likes_count: number
  shares_count: number
  comments_count: number
  created_at: string
  profiles: {
    username: string
    full_name: string
    avatar_url: string | null
  }
  bills?: { title: string } | null
}

interface Comment {
  id: string
  content: string
  created_at: string
  profiles: {
    username: string
    full_name: string
    avatar_url: string | null
  }
}

export default function ThreadDetailPage() {
  const params = useParams()
  const { user } = useAuth()
  const [thread, setThread] = useState<Thread | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [submittingComment, setSubmittingComment] = useState(false)

  useEffect(() => {
    fetchThread()
    fetchComments()
    if (user) {
      checkIfLiked()
    }
  }, [params.id, user])

  const fetchThread = async () => {
    try {
      const { data, error } = await supabase
        .from("threads")
        .select(`
          *,
          profiles:author_id (username, full_name, avatar_url)
        `)
        .eq("id", params.id)
        .single()

      if (error) throw error
      setThread(data)
    } catch (error) {
      console.error("Error fetching thread:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("thread_comments")
        .select(`
          *,
          profiles:author_id (username, full_name, avatar_url)
        `)
        .eq("thread_id", params.id)
        .order("created_at", { ascending: true })

      if (error) throw error
      setComments(data || [])
    } catch (error) {
      console.error("Error fetching comments:", error)
    }
  }

  const checkIfLiked = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("thread_likes")
        .select("id")
        .eq("thread_id", params.id)
        .eq("user_id", user.id)
        .single()

      if (data) setIsLiked(true)
    } catch (error) {
      // Not liked yet
    }
  }

  const handleLike = async () => {
    if (!user || !thread) return

    try {
      if (isLiked) {
        // Unlike
        await supabase.from("thread_likes").delete().eq("thread_id", thread.id).eq("user_id", user.id)

        await supabase
          .from("threads")
          .update({ likes_count: thread.likes_count - 1 })
          .eq("id", thread.id)

        setIsLiked(false)
        setThread({ ...thread, likes_count: thread.likes_count - 1 })
      } else {
        // Like
        await supabase.from("thread_likes").insert([{ thread_id: thread.id, user_id: user.id }])

        await supabase
          .from("threads")
          .update({ likes_count: thread.likes_count + 1 })
          .eq("id", thread.id)

        setIsLiked(true)
        setThread({ ...thread, likes_count: thread.likes_count + 1 })
      }
    } catch (error) {
      console.error("Error toggling like:", error)
    }
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !thread || !newComment.trim()) return

    setSubmittingComment(true)
    try {
      const { error } = await supabase.from("thread_comments").insert([
        {
          thread_id: thread.id,
          author_id: user.id,
          content: newComment.trim(),
        },
      ])

      if (error) throw error

      // Update comments count
      await supabase
        .from("threads")
        .update({ comments_count: thread.comments_count + 1 })
        .eq("id", thread.id)

      setNewComment("")
      fetchComments()
      setThread({ ...thread, comments_count: thread.comments_count + 1 })
    } catch (error) {
      console.error("Error posting comment:", error)
    } finally {
      setSubmittingComment(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "zine":
        return FileText
      case "music":
        return Music
      case "art":
        return Palette
      case "blog":
        return FileText
      default:
        return FileText
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "zine":
        return "bg-purple-500"
      case "music":
        return "bg-green-500"
      case "art":
        return "bg-pink-500"
      case "blog":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!thread) {
    return (
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
        <div className="text-white">Thread not found</div>
      </div>
    )
  }

  const TypeIcon = getTypeIcon(thread.type)

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/threads" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Threads
        </Link>

        {/* Thread Content */}
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardHeader>
            <div className="flex items-center gap-2 mb-3">
              <Badge className={`${getTypeColor(thread.type)} text-white text-sm`}>
                <TypeIcon className="h-4 w-4 mr-1" />
                {thread.type}
              </Badge>
              {thread.tags.map((tag, index) => (
                <Badge key={index} className="bg-gray-700 text-gray-300 text-sm">
                  #{tag}
                </Badge>
              ))}
            </div>
            <CardTitle className="text-white text-2xl font-bold">{thread.title}</CardTitle>
            <div className="flex items-center gap-3 mt-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={thread.profiles.avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="bg-advoline-orange text-black font-bold">
                  {thread.profiles.username?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-white font-medium">{thread.profiles.full_name}</div>
                <div className="text-gray-400 text-sm">@{thread.profiles.username}</div>
              </div>
              <div className="ml-auto text-gray-400 text-sm">{new Date(thread.created_at).toLocaleDateString()}</div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Related Bill */}
            <div className="mb-6">
              <Link href={`/bill/${thread.bill_id}`} className="text-neon-purple hover:text-neon-purple-bright text-sm">
                Related to: {thread.bills?.title ?? `Bill #${thread.bill_id}`}
              </Link>
            </div>

            {/* Preview/File */}
            {thread.preview_url && (
              <div
                className="w-full h-64 bg-gray-800 rounded-lg mb-6 bg-cover bg-center"
                style={{ backgroundImage: `url('${thread.preview_url}')` }}
              ></div>
            )}

            {/* Content */}
            <div className="prose prose-invert max-w-none mb-6">
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{thread.content}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-800">
              <div className="flex items-center gap-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={`flex items-center gap-2 ${
                    isLiked ? "text-red-500 hover:text-red-400" : "text-gray-400 hover:text-white"
                  }`}
                  disabled={!user}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                  <span>{thread.likes_count}</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-400 hover:text-white">
                  <Share2 className="h-4 w-4" />
                  <span>{thread.shares_count}</span>
                </Button>
                <div className="flex items-center gap-2 text-gray-400">
                  <MessageCircle className="h-4 w-4" />
                  <span>{thread.comments_count}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Comments ({comments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add Comment Form */}
            {user ? (
              <form onSubmit={handleComment} className="mb-6">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-advoline-orange text-black font-bold">
                      {user.email?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 mb-2"
                      rows={3}
                    />
                    <Button
                      type="submit"
                      disabled={!newComment.trim() || submittingComment}
                      className="bg-advoline-orange hover:bg-advoline-orange/90 text-black font-bold"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {submittingComment ? "Posting..." : "Post Comment"}
                    </Button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="mb-6 p-4 bg-gray-800 rounded-lg text-center">
                <p className="text-gray-400 mb-2">Sign in to join the conversation</p>
                <Button className="bg-advoline-orange hover:bg-advoline-orange/90 text-black font-bold">Sign In</Button>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 p-4 bg-gray-800 rounded-lg">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={comment.profiles.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback className="bg-advoline-orange text-black font-bold">
                      {comment.profiles.username?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium">{comment.profiles.full_name}</span>
                      <span className="text-gray-400 text-sm">@{comment.profiles.username}</span>
                      <span className="text-gray-500 text-sm">{new Date(comment.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              ))}

              {comments.length === 0 && (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No comments yet. Be the first to share your thoughts!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
