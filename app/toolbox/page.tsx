import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { FileText, Mail, DollarSign, Share2, Target, Zap } from "lucide-react"
import FilterDropdown from "@/components/filter-dropdown"

export default function ToolboxPage() {
  const petitions = [
    {
      id: 1,
      title: "Stop Offshore Drilling in Protected Waters",
      organization: "Ocean Defense Fund",
      signatures: 45678,
      goal: 50000,
      tag: "Climate",
      tagColor: "bg-green-500",
      description: "Protect marine ecosystems from destructive drilling practices.",
    },
    {
      id: 2,
      title: "Fund Mental Health Services in Schools",
      organization: "Student Wellness Coalition",
      signatures: 23456,
      goal: 25000,
      tag: "Education",
      tagColor: "bg-yellow-500",
      description: "Every student deserves access to mental health support.",
    },
  ]

  const emailTemplates = [
    {
      id: 1,
      title: "Climate Action Urgency",
      recipients: "Your Senators",
      tag: "Climate",
      tagColor: "bg-green-500",
      preview: "Dear Senator, I urge you to support immediate climate legislation...",
    },
    {
      id: 2,
      title: "Protect Voting Rights",
      recipients: "House Representatives",
      tag: "Politics",
      tagColor: "bg-blue-500",
      preview: "As your constituent, I'm writing to express my concern about voting access...",
    },
  ]

  const fundraisers = [
    {
      id: 1,
      title: "Legal Defense Fund for Protesters",
      raised: 15420,
      goal: 25000,
      tag: "Legal",
      tagColor: "bg-red-500",
      organization: "Civil Rights Legal Aid",
    },
    {
      id: 2,
      title: "Emergency Housing for LGBTQ+ Youth",
      raised: 8750,
      goal: 15000,
      tag: "LGBTQ+",
      tagColor: "bg-purple-500",
      organization: "Rainbow Safe House",
    },
  ]

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            ADVOCACY <span className="text-neon-purple neon-glow font-extralight">TOOLBOX</span>
          </h1>
          <p className="text-gray-400 text-lg font-light leading-relaxed">
            Your arsenal for change. Petitions, email templates, fundraisers, and more.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gray-900 border-gray-800 hover:border-advoline-orange transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <FileText className="h-8 w-8 text-advoline-orange mx-auto mb-2" />
              <h3 className="text-white font-bold mb-1">Sign Petitions</h3>
              <p className="text-gray-400 text-sm">Make your voice heard</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800 hover:border-advoline-purple transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <Mail className="h-8 w-8 text-neon-purple mx-auto mb-2" />
              <h3 className="text-white font-bold mb-1">Email Officials</h3>
              <p className="text-gray-400 text-sm">Contact your representatives</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800 hover:border-advoline-orange transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <DollarSign className="h-8 w-8 text-advoline-orange mx-auto mb-2" />
              <h3 className="text-white font-bold mb-1">Support Causes</h3>
              <p className="text-gray-400 text-sm">Fund the movement</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <FilterDropdown />
        </div>

        {/* Petitions Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-black text-white mb-6 flex items-center">
            <Target className="h-6 w-6 text-advoline-orange mr-2" />
            ACTIVE PETITIONS
          </h2>
          <div className="space-y-4">
            {petitions.map((petition) => (
              <Card key={petition.id} className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={`${petition.tagColor} text-white`}>#{petition.tag}</Badge>
                        <span className="text-gray-400 text-sm">by {petition.organization}</span>
                      </div>
                      <CardTitle className="text-white text-xl font-bold">{petition.title}</CardTitle>
                      <CardDescription className="text-gray-400 mt-2">{petition.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">{petition.signatures.toLocaleString()} signatures</span>
                      <span className="text-gray-400">Goal: {petition.goal.toLocaleString()}</span>
                    </div>
                    <Progress value={(petition.signatures / petition.goal) * 100} className="h-2" />
                  </div>
                  <div className="flex gap-2">
                    <Button className="bg-advoline-orange hover:bg-advoline-orange/90 text-black font-bold">
                      Sign Petition
                    </Button>
                    <Button variant="outline" className="border-gray-600 text-gray-400 hover:text-white bg-transparent">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Email Templates Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-black text-white mb-6 flex items-center">
            <Mail className="h-6 w-6 text-neon-purple mr-2" />
            <span className="font-extralight">EMAIL TEMPLATES</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {emailTemplates.map((template) => (
              <Card key={template.id} className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={`${template.tagColor} text-white`}>#{template.tag}</Badge>
                  </div>
                  <CardTitle className="text-white font-bold">{template.title}</CardTitle>
                  <CardDescription className="text-gray-400">To: {template.recipients}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-sm mb-4 italic">"{template.preview}"</p>
                  <Button className="w-full neon-button text-black font-semibold">
                    <Zap className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Fundraisers Section */}
        <section>
          <h2 className="text-2xl font-black text-white mb-6 flex items-center">
            <DollarSign className="h-6 w-6 text-advoline-orange mr-2" />
            ACTIVE FUNDRAISERS
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {fundraisers.map((fundraiser) => (
              <Card key={fundraiser.id} className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={`${fundraiser.tagColor} text-white`}>#{fundraiser.tag}</Badge>
                    <span className="text-gray-400 text-sm">by {fundraiser.organization}</span>
                  </div>
                  <CardTitle className="text-white font-bold">{fundraiser.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">${fundraiser.raised.toLocaleString()} raised</span>
                      <span className="text-gray-400">Goal: ${fundraiser.goal.toLocaleString()}</span>
                    </div>
                    <Progress value={(fundraiser.raised / fundraiser.goal) * 100} className="h-2" />
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-advoline-orange hover:bg-advoline-orange/90 text-black font-bold">
                      Donate
                    </Button>
                    <Button variant="outline" className="border-gray-600 text-gray-400 hover:text-white bg-transparent">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
