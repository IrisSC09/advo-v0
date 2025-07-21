import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar, MapPin, Users, Clock, Share2, Bookmark } from "lucide-react"
import FilterDropdown from "@/components/filter-dropdown"

export default function ProtestsPage() {
  const protests = [
    {
      id: 1,
      title: "Climate Justice March",
      date: "March 15, 2024",
      time: "2:00 PM",
      location: "City Hall Plaza",
      distance: "0.8 miles",
      attendees: 234,
      tags: ["Climate", "Environment"],
      description: "Join us for a peaceful march demanding immediate climate action from our local government.",
      organizer: "Climate Action Network",
    },
    {
      id: 2,
      title: "Defend Trans Rights Rally",
      date: "March 18, 2024",
      time: "6:00 PM",
      location: "State Capitol Steps",
      distance: "2.3 miles",
      attendees: 567,
      tags: ["LGBTQ+", "Human Rights"],
      description: "Stand with the trans community against discriminatory legislation.",
      organizer: "Pride Coalition",
    },
    {
      id: 3,
      title: "Education Funding Protest",
      date: "March 20, 2024",
      time: "4:00 PM",
      location: "School District Office",
      distance: "1.2 miles",
      attendees: 89,
      tags: ["Education", "Local"],
      description: "Demand proper funding for our public schools and teachers.",
      organizer: "Teachers United",
    },
  ]

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            PROTESTS <span className="text-neon-purple neon-glow font-extralight">NEAR ME</span>
          </h1>
          <p className="text-gray-400 text-lg font-light leading-relaxed">
            Find and join protests, rallies, and demonstrations in your area.
          </p>
        </div>

        {/* Location and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Enter your location..."
              className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400"
              defaultValue="San Francisco, CA"
            />
          </div>
          <FilterDropdown />
        </div>

        {/* Map Placeholder */}
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardContent className="p-0">
            <div
              className="h-64 bg-cover bg-center rounded-lg flex items-center justify-center"
              style={{
                backgroundImage: `url('/placeholder.svg?height=300&width=800')`,
              }}
            >
              <div className="bg-black/70 px-4 py-2 rounded">
                <p className="text-white font-bold">Interactive Map View</p>
                <p className="text-gray-300 text-sm">Click pins to see protest details</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Protest List */}
        <div className="space-y-6">
          {protests.map((protest) => (
            <Card
              key={protest.id}
              className="bg-gray-900 border-gray-800 hover:border-advoline-orange transition-colors"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-white text-xl font-bold mb-2">{protest.title}</CardTitle>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {protest.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          className="bg-neon-purple/20 text-neon-purple border border-neon-purple/50 font-medium"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-600 text-gray-400 hover:text-white bg-transparent"
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-600 text-gray-400 hover:text-white bg-transparent"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">{protest.description}</p>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-300">
                      <Calendar className="h-4 w-4 mr-2 text-advoline-orange" />
                      <span>{protest.date}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Clock className="h-4 w-4 mr-2 text-advoline-orange" />
                      <span>{protest.time}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-300">
                      <MapPin className="h-4 w-4 mr-2 text-neon-purple" />
                      <span>
                        {protest.location} • {protest.distance}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Users className="h-4 w-4 mr-2 text-neon-purple" />
                      <span>{protest.attendees} attending</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-gray-400 text-sm">Organized by {protest.organizer}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="border-advoline-orange text-advoline-orange hover:bg-advoline-orange hover:text-black bg-transparent"
                    >
                      More Info
                    </Button>
                    <Button className="bg-advoline-orange hover:bg-advoline-orange/90 text-black font-bold">
                      I'm Going
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
