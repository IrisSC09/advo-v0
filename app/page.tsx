import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Users, Calendar, Wrench, TrendingUp, MapPin, Megaphone } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const quickStats = [
    { label: "Active Advocates", value: "12.5K", icon: Users },
    { label: "Protests This Week", value: "47", icon: Calendar },
    { label: "Petitions Signed", value: "89.2K", icon: Megaphone },
    { label: "Cities Covered", value: "150+", icon: MapPin },
  ]

  const featuredIssues = [
    { tag: "Climate", count: 234, color: "bg-green-500" },
    { tag: "LGBTQ+", count: 189, color: "bg-purple-500" },
    { tag: "Immigration", count: 156, color: "bg-blue-500" },
    { tag: "Education", count: 143, color: "bg-yellow-500" },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/placeholder.svg?height=800&width=1200')`,
          }}
        >
          <div className="absolute inset-0 bg-black/70"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-advoline-orange/20 to-advoline-purple/20"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            YOUR PIPELINE TO
            <span className="block text-advoline-orange">ADVOCACY</span>
          </h1>
          <div className="text-lg md:text-xl text-neon-purple font-light neon-glow-strong mb-6 tracking-wider">
            YOUR DIGITAL ADVOCACY PIPELINE
          </div>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto font-light leading-relaxed">
            Join the movement. Make your voice heard. Change the world, one action at a time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-advoline-orange hover:bg-advoline-orange/90 text-black font-semibold text-lg px-8 py-4"
            >
              Start Your Advocacy Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" className="neon-button text-black font-semibold text-lg px-8 py-4 border-0">
              Explore Hot Takes
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {quickStats.map((stat, index) => (
              <Card key={index} className="bg-gray-900 border-gray-800 text-center">
                <CardContent className="pt-6">
                  <stat.icon className="h-8 w-8 text-advoline-orange mx-auto mb-2" />
                  <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Issues */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-black text-white mb-8 text-center">
            TRENDING <span className="text-neon-purple neon-glow font-extralight">ISSUES</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {featuredIssues.map((issue, index) => (
              <Card
                key={index}
                className="bg-black border-gray-800 hover:border-advoline-orange transition-colors cursor-pointer"
              >
                <CardContent className="p-4 text-center">
                  <Badge className={`${issue.color} text-white mb-2`}>#{issue.tag}</Badge>
                  <div className="text-white font-bold">{issue.count} active</div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Link href="/hot-takes">
              <Button className="neon-button text-black font-bold">
                Join The Frontline
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-black text-white mb-8 text-center">
            TAKE <span className="text-advoline-orange text-glow font-extralight">ACTION</span> NOW
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gray-900 border-gray-800 hover:border-advoline-orange transition-colors">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Calendar className="h-6 w-6 text-advoline-orange mr-2" />
                  Find Protests
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Discover upcoming protests and rallies in your area
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/protests">
                  <Button className="w-full bg-advoline-orange hover:bg-advoline-orange/90 text-black font-bold">
                    Protests Near Me
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 hover:border-advoline-purple transition-colors">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Wrench className="h-6 w-6 text-neon-purple mr-2" />
                  Advocacy Tools
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Access petitions, email templates, and fundraisers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/toolbox">
                  <Button className="w-full neon-button text-black font-bold">Open Toolbox</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 hover:border-advoline-orange transition-colors">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="h-6 w-6 text-advoline-orange mr-2" />
                  Track Progress
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Monitor your advocacy impact and earn badges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/profile">
                  <Button className="w-full bg-advoline-orange hover:bg-advoline-orange/90 text-black font-bold">
                    View Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
