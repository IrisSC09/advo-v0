import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, ThumbsUp, Clock, Search, Plus } from "lucide-react"
import FilterDropdown from "@/components/filter-dropdown"

export default function HotTakesPage() {
  const threads = [
    {
      id: 1,
      title: "Climate activists need to stop blocking traffic - change my mind",
      author: "EcoWarrior23",
      tag: "Climate",
      tagColor: "bg-green-500",
      replies: 47,
      likes: 23,
      timeAgo: "2h ago",
      preview: "I support the cause but blocking roads just pisses people off and hurts the movement...",
    },
    {
      id: 2,
      title: "Why aren't more young people voting in local elections?",
      author: "VoteOrDie",
      tag: "Politics",
      tagColor: "bg-blue-500",
      replies: 89,
      likes: 156,
      timeAgo: "4h ago",
      preview: "Local elections have the biggest impact on our daily lives yet turnout is abysmal...",
    },
    {
      id: 3,
      title: "Trans rights are under attack and we need to mobilize NOW",
      author: "PrideActivist",
      tag: "LGBTQ+",
      tagColor: "bg-purple-500",
      replies: 234,
      likes: 567,
      timeAgo: "6h ago",
      preview: "The recent legislation is terrifying. Here's what we can do to fight back...",
    },
    {
      id: 4,
      title: "Student debt forgiveness won't fix the real problem",
      author: "DebtFreeOrDie",
      tag: "Education",
      tagColor: "bg-yellow-500",
      replies: 78,
      likes: 45,
      timeAgo: "8h ago",
      preview: "We need to address the root cause of inflated tuition costs, not just symptoms...",
    },
  ]

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            THE <span className="text-neon-purple neon-glow font-extralight">FRONTLINE</span>
          </h1>
          <p className="text-gray-400 text-lg font-light leading-relaxed">
            Where hot takes meet real action. Join the conversation that's changing the world.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search discussions..."
              className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400"
            />
          </div>
          <FilterDropdown />
          <Button className="neon-button text-black font-semibold">
            <Plus className="h-4 w-4 mr-2" />
            Start Discussion
          </Button>
        </div>

        {/* Thread List */}
        <div className="space-y-4">
          {threads.map((thread) => (
            <Card
              key={thread.id}
              className="bg-gray-900 border-gray-800 hover:border-advoline-orange transition-colors cursor-pointer"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`${thread.tagColor} text-white text-xs`}>#{thread.tag}</Badge>
                      <span className="text-gray-400 text-sm">by {thread.author}</span>
                      <span className="text-gray-500 text-sm flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {thread.timeAgo}
                      </span>
                    </div>
                    <CardTitle className="text-white text-xl font-bold hover:text-advoline-orange transition-colors">
                      {thread.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-400 mb-4">{thread.preview}</p>
                <div className="flex items-center gap-6 text-gray-400">
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-sm">{thread.replies}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span className="text-sm">{thread.likes}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button className="neon-border bg-transparent text-neon-purple hover:neon-button hover:text-black">
            Load More Discussions
          </Button>
        </div>
      </div>
    </div>
  )
}
