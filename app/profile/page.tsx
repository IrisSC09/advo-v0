"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Flame, FileText, MessageCircle, Share2, Zap } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function ProfilePage() {
  const { user, profile } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({ threads: 0, billsFollowed: 0, streak: 0 })
  const [recentActivity, setRecentActivity] = useState<Array<{ action: string; title: string; bill_id: string; time: string; type: string }>>([])

  useEffect(() => {
    if (!user) {
      router.replace("/")
      return
    }
    ;(async () => {
      const { count: tc } = await supabase.from("threads").select("*", { count: "exact", head: true }).eq("author_id", user.id)
      let follows: { bill_id: string; created_at: string }[] = []
      try {
        const r = await supabase.from("bill_follows").select("bill_id, created_at").eq("user_id", user.id)
        follows = r.data || []
      } catch {
        /* bill_follows table may not exist yet */
      }
      const { data: streakData } = await supabase.from("user_streaks").select("current_streak").eq("user_id", user.id).single()
      const { data: threadList } = await supabase.from("threads").select("id, title, bill_id, created_at").eq("author_id", user.id).order("created_at", { ascending: false }).limit(10)
      const acts: typeof recentActivity = []
      ;(threadList || []).forEach((t) => acts.push({ action: "Created thread", title: t.title, bill_id: t.bill_id, time: new Date(t.created_at).toLocaleDateString(), type: "thread" }))
      follows.slice(0, 5).forEach((f) => acts.push({ action: "Followed bill", title: `Bill #${f.bill_id}`, bill_id: f.bill_id, time: new Date(f.created_at).toLocaleDateString(), type: "track" }))
      acts.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      setStats({ threads: tc ?? 0, billsFollowed: follows.length, streak: streakData?.current_streak ?? 0 })
      setRecentActivity(acts.slice(0, 10))
    })()
  }, [user, router])

  if (!user) return null

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="bg-advoline-orange text-black text-2xl font-bold">{(profile?.full_name || user?.email || "U")[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl font-black text-white mb-2">{profile?.full_name || user?.email?.split("@")[0] || "User"}</h1>
                <p className="text-gray-400 mb-4 font-light">{profile?.bio || "No location set"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-8 w-8 text-neon-purple mx-auto mb-2" />
              <div className="text-3xl font-black text-white mb-1">{stats.threads}</div>
              <div className="text-gray-400 text-sm">Threads Created</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6 text-center">
              <FileText className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-3xl font-black text-white mb-1">{stats.billsFollowed}</div>
              <div className="text-gray-400 text-sm">Bills Followed</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6 text-center">
              <Flame className="h-8 w-8 text-advoline-orange mx-auto mb-2" />
              <div className="text-3xl font-black text-white mb-1">{stats.streak}</div>
              <div className="text-gray-400 text-sm">Day Streak</div>
            </CardContent>
          </Card>
        </div>

        <section>
          <h2 className="text-2xl font-black text-white mb-6 flex items-center">
            <Zap className="h-6 w-6 text-neon-purple mr-2" />
            RECENT ACTIVITY
          </h2>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentActivity.map((a, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-gray-800">
                    <div className="flex-shrink-0">
                      {a.type === "thread" && <MessageCircle className="h-5 w-5 text-neon-purple" />}
                      {a.type === "track" && <FileText className="h-5 w-5 text-blue-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{a.action}</p>
                      <Link href={`/bill/${a.bill_id}`} className="text-gray-400 text-sm hover:text-advoline-orange">
                        {a.title} • Bill #{a.bill_id}
                      </Link>
                    </div>
                    <span className="text-gray-500 text-sm">{a.time}</span>
                  </div>
                ))}
                {recentActivity.length === 0 && <p className="text-gray-500 text-center py-8">No recent activity</p>}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
