import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Building2,
  Brain,
  GraduationCap,
  Megaphone,
  Crown,
  BarChart3,
  Handshake,
  Target,
  Award,
  CheckCircle,
} from "lucide-react"

export default function OrganizationsPage() {
  const solutions = [
    {
      id: "sentiment-data",
      title: "Sentiment Data Analysis",
      icon: BarChart3,
      color: "text-neon-purple",
      bgColor: "bg-neon-purple/10",
      borderColor: "border-neon-purple/30",
      description:
        "AI-powered sentiment analysis on bills, legislation, topics, and politicians based on youth engagement data.",
      features: [
        "Real-time sentiment tracking on legislation",
        "Demographic breakdowns by age, location, and interests",
        "Anonymized data protecting user privacy",
        "Custom reports and API access",
        "Trending topic identification",
        "Politician approval ratings among youth",
      ],
      targetAudience: "NGOs, Think Tanks, Universities, Advocacy Organizations",
      cta: "Get Sentiment Data",
      pricing: "Starting at $299/month",
    },
    {
      id: "education",
      title: "Education Partnerships",
      icon: GraduationCap,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
      description:
        "Transform civic education with AI-summarized bills and creative student assignments through our thread system.",
      features: [
        "AI-generated bill summaries for classroom use",
        "Student assignment creation (zines, protest art, blogs)",
        "AI-powered class sentiment ranking and analysis",
        "Automated fact-checking and source verification",
        "Peer upvoting and collaborative learning",
        "Access to real campaigns and calls to action",
      ],
      targetAudience: "Universities, High Schools, Civic Education Programs",
      cta: "Partner With Us",
      pricing: "Custom education pricing",
    },
    {
      id: "brand-activism",
      title: "Brand Activism",
      icon: Megaphone,
      color: "text-advoline-orange",
      bgColor: "bg-advoline-orange/10",
      borderColor: "border-advoline-orange/30",
      description:
        "Enable NPOs to create impactful campaigns and threads with monetization options to boost reach and engagement.",
      features: [
        "Campaign creation and management tools",
        "Thread boosting and promotion options",
        "Sponsored content and partnership opportunities",
        "Analytics and engagement tracking",
        "Direct connection with youth advocates",
        "Custom branding and white-label options",
      ],
      targetAudience: "NPOs, Advocacy Groups, Social Impact Organizations",
      cta: "Launch Campaign",
      pricing: "Performance-based pricing",
    },
    {
      id: "premium-creators",
      title: "Premium Creator Tools",
      icon: Crown,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30",
      description:
        "Advanced tools and features for content creators to maximize their impact and reach within the advocacy community.",
      features: [
        "Enhanced thread promotion and discovery",
        "Advanced analytics and audience insights",
        "Priority support and early feature access",
        "Monetization opportunities through partnerships",
        "Custom creator badges and verification",
        "Cross-platform content distribution",
      ],
      targetAudience: "Content Creators, Influencers, Youth Advocates",
      cta: "Upgrade to Premium",
      pricing: "$29/month",
    },
  ]

  const stats = [
    { label: "Partner Organizations", value: "150+", icon: Building2 },
    { label: "Student Users", value: "25K+", icon: GraduationCap },
    { label: "Campaign Reach", value: "2.3M", icon: Target },
    { label: "Data Points", value: "500K+", icon: Brain },
  ]

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            PARTNER WITH <span className="text-neon-purple neon-glow font-extralight">ADVOLINE</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto font-light leading-relaxed mb-8">
            Empower your organization with youth-driven insights, educational tools, and advocacy platforms. Join the
            movement to democratize political engagement for the next generation.
          </p>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="h-8 w-8 text-advoline-orange mx-auto mb-2" />
                <div className="text-3xl font-black text-white">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Solutions Grid */}
        <div className="space-y-12">
          {solutions.map((solution, index) => (
            <Card
              key={solution.id}
              className={`bg-gray-900 ${solution.borderColor} border-2 hover:shadow-2xl transition-all duration-300`}
            >
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-4 rounded-xl ${solution.bgColor}`}>
                    <solution.icon className={`h-8 w-8 ${solution.color}`} />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-white text-2xl font-black mb-2">{solution.title}</CardTitle>
                    <CardDescription className="text-gray-400 text-lg">{solution.description}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-white mb-1">{solution.pricing}</div>
                    <Badge
                      className={`${solution.color.replace("text-", "bg-")}/20 ${solution.color} border ${solution.color.replace("text-", "border-")}/50`}
                    >
                      {solution.targetAudience.split(",")[0]}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Features */}
                  <div className="lg:col-span-2">
                    <h4 className="text-white font-bold text-lg mb-4 flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      Key Features
                    </h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {solution.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-advoline-orange rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Section */}
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h4 className="text-white font-bold mb-3">Perfect For:</h4>
                    <p className="text-gray-400 text-sm mb-4">{solution.targetAudience}</p>

                    <div className="space-y-3">
                      <Button
                        className={`w-full font-bold ${
                          solution.id === "sentiment-data"
                            ? "neon-button text-black"
                            : solution.id === "education"
                              ? "bg-green-500 hover:bg-green-600 text-white"
                              : solution.id === "brand-activism"
                                ? "bg-advoline-orange hover:bg-advoline-orange/90 text-black"
                                : "bg-yellow-500 hover:bg-yellow-600 text-black"
                        }`}
                      >
                        {solution.cta}
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full border-gray-600 text-gray-400 hover:text-white bg-transparent"
                      >
                        Schedule Demo
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Success Stories */}
        <section className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              SUCCESS <span className="text-advoline-orange text-glow font-extralight">STORIES</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              See how organizations are leveraging Advoline to drive meaningful change
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-neon-purple/20 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-neon-purple" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Climate Action Network</h3>
                    <p className="text-gray-400 text-sm">Environmental NGO</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  "Advoline's sentiment data helped us identify key youth concerns about climate legislation, leading to
                  a 40% increase in engagement on our campaigns."
                </p>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-advoline-orange" />
                  <span className="text-advoline-orange text-sm font-medium">40% engagement increase</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">UC Berkeley</h3>
                    <p className="text-gray-400 text-sm">Political Science Dept</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  "Our students created amazing zines and protest art through Advoline's platform. Class engagement with
                  political topics increased by 60%."
                </p>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-green-500" />
                  <span className="text-green-500 text-sm font-medium">60% engagement boost</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-advoline-orange/20 rounded-full flex items-center justify-center">
                    <Megaphone className="h-6 w-6 text-advoline-orange" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">March for Our Lives</h3>
                    <p className="text-gray-400 text-sm">Youth Advocacy</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  "Advoline's brand activism tools helped us reach 2.3M young people with our gun safety campaign,
                  resulting in unprecedented youth voter turnout."
                </p>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-advoline-orange" />
                  <span className="text-advoline-orange text-sm font-medium">2.3M reach achieved</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-20 text-center">
          <Card className="bg-gray-900 border-advoline-orange border-2 max-w-4xl mx-auto">
            <CardContent className="p-12">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Handshake className="h-8 w-8 text-advoline-orange" />
                <h2 className="text-3xl font-black text-white">Ready to Partner?</h2>
              </div>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join leading organizations in empowering the next generation of advocates. Let's build the future of
                democratic engagement together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-advoline-orange hover:bg-advoline-orange/90 text-black font-bold text-lg px-8 py-4">
                  Schedule Partnership Call
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-400 hover:text-white bg-transparent text-lg px-8 py-4"
                >
                  Download Partnership Guide
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
