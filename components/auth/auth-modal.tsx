"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { X, Mail, Lock, User } from "lucide-react"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: "signin" | "signup"
  onModeChange: (mode: "signin" | "signup") => void
}

export default function AuthModal({ isOpen, onClose, mode, onModeChange }: AuthModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  if (!isOpen) return null

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      })

      if (error) throw error

      if (data.user) {
        // Create profile - this should work with RLS since the user is authenticated
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: data.user.id,
            username,
          },
        ])

        if (profileError) {
          console.error("Profile creation error:", profileError)
          // Don't throw here - the user is still created, just log the error
        }

        // Create initial streak record
        const { error: streakError } = await supabase.from("user_streaks").insert([
          {
            user_id: data.user.id,
            current_streak: 1,
            longest_streak: 1,
          },
        ])

        if (streakError) {
          console.error("Streak creation error:", streakError)
          // Don't throw here either
        }

        onClose()
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      onClose()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-gray-900 border-gray-800 w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-2xl">
                {mode === "signin" ? "Welcome Back" : "Join Advoline"}
              </CardTitle>
              <CardDescription className="text-gray-400">
                {mode === "signin" ? "Sign in to your account to continue" : "Create your account to start advocating"}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={mode === "signin" ? handleSignIn : handleSignUp} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-2">
                <label className="text-white text-sm font-medium">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-white text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-white text-sm font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded p-2">{error}</div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-advoline-orange hover:bg-advoline-orange/90 text-black font-bold"
            >
              {loading ? "Loading..." : mode === "signin" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => onModeChange(mode === "signin" ? "signup" : "signin")}
                className="text-advoline-orange hover:text-advoline-orange/80 font-medium"
              >
                {mode === "signin" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
