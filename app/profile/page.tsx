import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Flame, FileText, MessageCircle, Share2, TrendingUp, Award, Zap } from "lucide-react"

export default function ProfilePage() {
  const userStats = {
    threadsCreated: 23,
    billsTracked: 47,
    engagementScore: 1247,
    currentStreak: 12,
    totalBadges: 8,
  }

  const badges = [
    {
      name: "Thread Starter",
      description: "Created 10+ community threads",
      icon: MessageCircle,
      earned: true,
      color: "bg-advoline-purple",
      rarity: "Common",
    },
    {
      name: "Bill Tracker",
      description: "Followed 25+ bills",
      icon: FileText,
      earned: true,
      color: "bg-blue-500",
      rarity: "Common",
    },
    {
      name: "Viral Creator",
      description: "Thread reached 1000+ engagements",
      icon: TrendingUp,
      earned: true,
      color: "bg-advoline-orange",
      rarity: "Rare",
    },
    {
      name: "Streak Master",
      description: "Maintained 30-day engagement streak",
      icon: Flame,
      earned: false,
      color: "bg-gray-600",
      rarity: "Epic",
    },
    {
      name: "Community Leader",
      description: "Top 1% of community engagement",
      icon: Trophy,
      earned: false,
      color: "bg-gray-600",
      rarity: "Legendary",
    },
  ]

  const recentActivity = [
    {
      action: "Created thread",
      title: "Climate Action Zine",
      bill: "HR-2024-001",
      time: "2 hours ago",
      type: "thread",
    },
    { action: "Shared content", title: "Green Jobs Anthem", bill: "HR-2024-001", time: "1 day ago", type: "share" },
    {
      action: "Started tracking",
      title: "Student Debt Relief Act",
      bill: "HR-2024-078",
      time: "2 days ago",
      type: "track",
    },
    {
      action: "Created thread",
      title: "Healthcare Transparency Blog",
      bill: "S-2024-023",
      time: "3 days ago",
      type: "thread",
    },
  ]

  const streakData = [
    { day: "Mon", active: true },
    { day: "Tue", active: true },
    { day: "Wed", active: true },
    { day: "Thu", active: false },
    { day: "Fri", active: true },
    { day: "Sat", active: true },
    { day: "Sun", active: true },
  ]

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg?height=96&width=96" />
                <AvatarFallback className="bg-advoline-orange text-black text-2xl font-bold">JA</AvatarFallback>
              </Avatar>
              <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl font-black text-white mb-2">Jordan Activist</h1>
                <p className="text-gray-400 mb-4 font-light">Legislative Advocate • San Francisco, CA</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge className="bg-advoline-orange text-black font-medium">Thread Creator</Badge>
                  <Badge className="bg-neon-purple/20 text-neon-purple border border-neon-purple/50 font-medium">
                    Bill Tracker
                  </Badge>
                  <Badge className="bg-green-500 text-white font-medium">Streak Master</Badge>
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-advoline-orange mb-1">{userStats.engagementScore}</div>
                <div className="text-gray-400 text-sm">Engagement Score</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Stats and Activity */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Overview */}
            <section>
              <h2 className="text-2xl font-black text-white mb-6 flex items-center">
                <TrendingUp className="h-6 w-6 text-advoline-orange mr-2" />
                <span className="font-extralight">YOUR IMPACT</span>
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-6 text-center">
                    <MessageCircle className="h-8 w-8 text-neon-purple mx-auto mb-2" />
                    <div className="text-3xl font-black text-white mb-1">{userStats.threadsCreated}</div>
                    <div className="text-gray-400 text-sm">Threads Created</div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-6 text-center">
                    <FileText className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-3xl font-black text-white mb-1">{userStats.billsTracked}</div>
                    <div className="text-gray-400 text-sm">Bills Tracked</div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-6 text-center">
                    <Flame className="h-8 w-8 text-advoline-orange mx-auto mb-2" />
                    <div className="text-3xl font-black text-white mb-1">{userStats.currentStreak}</div>
                    <div className="text-gray-400 text-sm">Day Streak</div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Streak Visualization */}
            <section>
              <h2 className="text-2xl font-black text-white mb-6 flex items-center">
                <Flame className="h-6 w-6 text-advoline-orange mr-2" />
                <span className="font-extralight">ENGAGEMENT STREAK</span>
              </h2>
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <div className="text-2xl font-black text-white">{userStats.currentStreak} Days</div>
                      <div className="text-gray-400 text-sm">Current streak</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-advoline-orange">18 days to next badge!</div>
                      <div className="text-gray-400 text-sm">Streak Master (30 days)</div>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-center">
                    {streakData.map((day, index) => (
                      <div key={index} className="text-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                            day.active ? "bg-advoline-orange text-black" : "bg-gray-700 text-gray-400"
                          }`}
                        >
                          {day.active ? <Flame className="h-4 w-4" /> : ""}
                        </div>
                        <div className="text-xs text-gray-400">{day.day}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Recent Activity */}
            <section>
              <h2 className="text-2xl font-black text-white mb-6 flex items-center">
                <Zap className="h-6 w-6 text-neon-purple mr-2" />
                <span className="font-extralight">RECENT ACTIVITY</span>
              </h2>
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-gray-800">
                        <div className="flex-shrink-0">
                          {activity.type === "thread" && <MessageCircle className="h-5 w-5 text-neon-purple" />}
                          {activity.type === "share" && <Share2 className="h-5 w-5 text-advoline-orange" />}
                          {activity.type === "track" && <FileText className="h-5 w-5 text-blue-500" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">{activity.action}</p>
                          <p className="text-gray-400 text-sm">
                            {activity.title} • {activity.bill}
                          </p>
                        </div>
                        <span className="text-gray-500 text-sm">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Right Column - Badges */}
          <div>
            <section>
              <h2 className="text-2xl font-black text-white mb-6 flex items-center">
                <Award className="h-6 w-6 text-advoline-orange mr-2" />
                BADGES
              </h2>
              <div className="space-y-4">
                {badges.map((badge, index) => (
                  <Card
                    key={index}
                    className={`border-gray-800 ${badge.earned ? "bg-gray-900" : "bg-gray-950 opacity-60"}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${badge.color}`}>
                          <badge.icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className={`font-bold ${badge.earned ? "text-white" : "text-gray-500"}`}>
                              {badge.name}
                            </h3>
                            <Badge
                              className={`text-xs ${
                                badge.rarity === "Legendary"
                                  ? "bg-yellow-500"
                                  : badge.rarity === "Epic"
                                    ? "bg-purple-500"
                                    : badge.rarity === "Rare"
                                      ? "bg-blue-500"
                                      : "bg-gray-500"
                              } text-white`}
                            >
                              {badge.rarity}
                            </Badge>
                          </div>
                          <p className={`text-sm ${badge.earned ? "text-gray-400" : "text-gray-600"}`}>
                            {badge.description}
                          </p>
                        </div>
                        {badge.earned && <Trophy className="h-5 w-5 text-yellow-500" />}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Next Badge Progress */}
              <Card className="bg-gray-900 border-gray-800 mt-6">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Next Badge</CardTitle>
                  <CardDescription className="text-gray-400">
                    Streak Master - Maintain 30-day engagement streak
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-gray-400">{userStats.currentStreak}/30 days</span>
                    </div>
                    <Progress value={(userStats.currentStreak / 30) * 100} className="h-2" />
                  </div>
                  <Button className="w-full bg-advoline-orange hover:bg-advoline-orange/90 text-black font-bold">
                    Keep Streak Going!
                  </Button>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
