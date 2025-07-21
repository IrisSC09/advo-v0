import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Mail, FileText, Calendar, Users, Target, Zap, Award, TrendingUp } from "lucide-react"

export default function ProfilePage() {
  const userStats = {
    petitionsSigned: 47,
    emailsSent: 23,
    protestsAttended: 8,
    totalImpact: 78,
  }

  const badges = [
    {
      name: "Email Warrior",
      description: "Sent 20+ emails to officials",
      icon: Mail,
      earned: true,
      color: "bg-advoline-purple",
    },
    {
      name: "Ground Game Pro",
      description: "Attended 5+ protests",
      icon: Users,
      earned: true,
      color: "bg-advoline-orange",
    },
    {
      name: "Digital Advocate",
      description: "Signed 25+ petitions",
      icon: FileText,
      earned: true,
      color: "bg-green-500",
    },
    {
      name: "Movement Leader",
      description: "Recruit 10 new advocates",
      icon: Trophy,
      earned: false,
      color: "bg-gray-600",
    },
    {
      name: "Fundraising Hero",
      description: "Raise $500+ for causes",
      icon: Target,
      earned: false,
      color: "bg-gray-600",
    },
  ]

  const recentActivity = [
    { action: "Signed petition", title: "Stop Offshore Drilling", time: "2 hours ago", type: "petition" },
    { action: "Attended protest", title: "Climate Justice March", time: "1 day ago", type: "protest" },
    { action: "Sent email", title: "Climate Action Urgency", time: "3 days ago", type: "email" },
    { action: "Shared fundraiser", title: "Legal Defense Fund", time: "5 days ago", type: "share" },
  ]

  const impactMetrics = [
    {
      label: "Petitions Signed",
      value: userStats.petitionsSigned,
      target: 50,
      icon: FileText,
      color: "text-green-500",
    },
    { label: "Emails Sent", value: userStats.emailsSent, target: 30, icon: Mail, color: "text-neon-purple" },
    {
      label: "Protests Attended",
      value: userStats.protestsAttended,
      target: 10,
      icon: Calendar,
      color: "text-advoline-orange",
    },
  ]

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" />
                  <AvatarFallback className="bg-advoline-orange text-black text-2xl font-bold">JA</AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left flex-1">
                  <h1 className="text-3xl font-black text-white mb-2">Jordan Activist</h1>
                  <p className="text-gray-400 mb-4 font-light">Digital Advocate • San Francisco, CA</p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <Badge className="bg-advoline-orange text-black font-medium">Climate Champion</Badge>
                    <Badge className="bg-neon-purple/20 text-neon-purple border border-neon-purple/50 font-medium">
                      Community Organizer
                    </Badge>
                    <Badge className="bg-green-500 text-white font-medium">Petition Power</Badge>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-advoline-orange mb-1">{userStats.totalImpact}</div>
                  <div className="text-gray-400 text-sm">Impact Score</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Stats and Progress */}
          <div className="lg:col-span-2 space-y-8">
            {/* Impact Metrics */}
            <section>
              <h2 className="text-2xl font-black text-white mb-6 flex items-center">
                <TrendingUp className="h-6 w-6 text-advoline-orange mr-2" />
                <span className="font-extralight">YOUR IMPACT</span>
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {impactMetrics.map((metric, index) => (
                  <Card key={index} className="bg-gray-900 border-gray-800">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <metric.icon className={`h-6 w-6 ${metric.color}`} />
                        <span className="text-2xl font-black text-white">{metric.value}</span>
                      </div>
                      <div className="mb-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">{metric.label}</span>
                          <span className="text-gray-400">{metric.target}</span>
                        </div>
                        <Progress value={(metric.value / metric.target) * 100} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
                          {activity.type === "petition" && <FileText className="h-5 w-5 text-green-500" />}
                          {activity.type === "protest" && <Users className="h-5 w-5 text-advoline-orange" />}
                          {activity.type === "email" && <Mail className="h-5 w-5 text-neon-purple" />}
                          {activity.type === "share" && <Target className="h-5 w-5 text-blue-500" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">{activity.action}</p>
                          <p className="text-gray-400 text-sm">{activity.title}</p>
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
                          <h3 className={`font-bold ${badge.earned ? "text-white" : "text-gray-500"}`}>{badge.name}</h3>
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
                    Movement Leader - Recruit 10 new advocates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-gray-400">3/10</span>
                    </div>
                    <Progress value={30} className="h-2" />
                  </div>
                  <Button className="w-full bg-advoline-orange hover:bg-advoline-orange/90 text-black font-bold">
                    Invite Friends
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
