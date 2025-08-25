"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Users, MessageCircle, Brain, Crown } from "lucide-react"
import { useState } from "react"

export default function AnalyticsPage() {
  const [selectedBill, setSelectedBill] = useState("hr-2024-001")
  const [timeRange, setTimeRange] = useState("7d")

  const bills = [
    { id: "hr-2024-001", title: "Climate Action and Green Jobs Act" },
    { id: "s-2024-045", title: "Border Security Enhancement Act" },
    { id: "hr-2024-078", title: "Student Debt Relief Act" },
    { id: "s-2024-023", title: "Healthcare Price Transparency Act" },
  ]

  const sentimentData = {
    overall: { support: 67, oppose: 23, neutral: 10 },
    demographics: {
      "18-29": { support: 78, oppose: 15, neutral: 7 },
      "30-44": { support: 65, oppose: 25, neutral: 10 },
      "45-64": { support: 58, oppose: 32, neutral: 10 },
      "65+": { support: 45, oppose: 40, neutral: 15 },
    },
    geographic: {
      Urban: { support: 75, oppose: 18, neutral: 7 },
      Suburban: { support: 62, oppose: 28, neutral: 10 },
      Rural: { support: 48, oppose: 38, neutral: 14 },
    },
  }

  const engagementMetrics = {
    totalEngagement: 12547,
    threadsCreated: 89,
    contentShared: 234,
    avgEngagementRate: 8.7,
    topKeywords: ["climate", "jobs", "green", "future", "economy"],
    sentimentTrend: [
      { date: "Jan 15", support: 65, oppose: 25 },
      { date: "Jan 16", support: 66, oppose: 24 },
      { date: "Jan 17", support: 67, oppose: 23 },
      { date: "Jan 18", support: 68, oppose: 22 },
      { date: "Jan 19", support: 67, oppose: 23 },
    ],
  }

  const subscriptionTiers = [
    {
      name: "Basic Analytics",
      price: "$99/month",
      features: ["Basic sentiment tracking", "Weekly reports", "Up to 5 bills", "Email support"],
      color: "border-gray-600",
      buttonClass: "bg-gray-700 hover:bg-gray-600 text-white",
    },
    {
      name: "Pro Insights",
      price: "$299/month",
      features: [
        "Advanced AI sentiment analysis",
        "Real-time tracking",
        "Unlimited bills",
        "Demographic breakdowns",
        "Custom reports",
        "Priority support",
      ],
      color: "border-advoline-orange",
      buttonClass: "bg-advoline-orange hover:bg-advoline-orange/90 text-black",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: [
        "Everything in Pro",
        "API access",
        "White-label reports",
        "Dedicated account manager",
        "Custom integrations",
        "SLA guarantee",
      ],
      color: "border-neon-purple",
      buttonClass: "neon-button text-black",
    },
  ]

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            SENTIMENT <span className="text-neon-purple neon-glow font-extralight">ANALYTICS</span>
          </h1>
          <p className="text-gray-400 text-lg font-light leading-relaxed">
            AI-powered insights into public opinion on legislation. For NPOs, think tanks, and advocacy organizations.
          </p>
        </div>

        {/* Subscription Tiers */}
        <section className="mb-12">
          <h2 className="text-2xl font-black text-white mb-6 text-center">
            CHOOSE YOUR <span className="text-advoline-orange text-glow font-extralight">PLAN</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {subscriptionTiers.map((tier, index) => (
              <Card
                key={index}
                className={`bg-gray-900 ${tier.color} ${tier.popular ? "ring-2 ring-advoline-orange" : ""} relative`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-advoline-orange text-black font-bold px-3 py-1">
                      <Crown className="h-3 w-3 mr-1" />
                      MOST POPULAR
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-white text-xl">{tier.name}</CardTitle>
                  <div className="text-3xl font-black text-advoline-orange">{tier.price}</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-gray-300 flex items-start">
                        <span className="text-advoline-orange mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${tier.buttonClass} font-bold`}>
                    {tier.price === "Custom" ? "Contact Sales" : "Start Free Trial"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Demo Dashboard */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-white">
              ANALYTICS <span className="text-neon-purple neon-glow font-extralight">DASHBOARD</span>
            </h2>
            <Badge className="bg-neon-purple/20 text-neon-purple border border-neon-purple/50 font-medium">
              <Brain className="h-3 w-3 mr-1" />
              DEMO MODE
            </Badge>
          </div>

          {/* Controls */}
          <div className="flex gap-4 mb-6">
            <Select value={selectedBill} onValueChange={setSelectedBill}>
              <SelectTrigger className="w-80 bg-gray-900 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                {bills.map((bill) => (
                  <SelectItem
                    key={bill.id}
                    value={bill.id}
                    className="text-white hover:bg-neon-purple hover:text-black"
                  >
                    {bill.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32 bg-gray-900 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="7d" className="text-white hover:bg-neon-purple hover:text-black">
                  7 Days
                </SelectItem>
                <SelectItem value="30d" className="text-white hover:bg-neon-purple hover:text-black">
                  30 Days
                </SelectItem>
                <SelectItem value="90d" className="text-white hover:bg-neon-purple hover:text-black">
                  90 Days
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Overall Metrics */}
            <div className="lg:col-span-2 space-y-6">
              {/* Sentiment Overview */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Brain className="h-5 w-5 text-neon-purple mr-2" />
                    AI Sentiment Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-green-400">Support: {sentimentData.overall.support}%</span>
                        <span className="text-red-400">Oppose: {sentimentData.overall.oppose}%</span>
                        <span className="text-gray-400">Neutral: {sentimentData.overall.neutral}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-4">
                        <div className="flex h-4 rounded-full overflow-hidden">
                          <div className="bg-green-500" style={{ width: `${sentimentData.overall.support}%` }}></div>
                          <div className="bg-red-500" style={{ width: `${sentimentData.overall.oppose}%` }}></div>
                          <div className="bg-gray-500" style={{ width: `${sentimentData.overall.neutral}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Demographic Breakdown */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Demographic Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(sentimentData.demographics).map(([age, data]) => (
                      <div key={age}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white font-medium">Age {age}</span>
                          <span className="text-green-400">{data.support}% Support</span>
                        </div>
                        <Progress value={data.support} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Geographic Analysis */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Geographic Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(sentimentData.geographic).map(([region, data]) => (
                      <div key={region}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white font-medium">{region}</span>
                          <span className="text-green-400">{data.support}% Support</span>
                        </div>
                        <Progress value={data.support} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Metrics */}
            <div className="space-y-6">
              {/* Key Metrics */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Key Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-advoline-orange" />
                      <span className="text-gray-400">Total Engagement</span>
                    </div>
                    <span className="text-white font-bold">{engagementMetrics.totalEngagement.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-neon-purple" />
                      <span className="text-gray-400">Threads Created</span>
                    </div>
                    <span className="text-white font-bold">{engagementMetrics.threadsCreated}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-gray-400">Engagement Rate</span>
                    </div>
                    <span className="text-white font-bold">{engagementMetrics.avgEngagementRate}/10</span>
                  </div>
                </CardContent>
              </Card>

              {/* Top Keywords */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Trending Keywords</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {engagementMetrics.topKeywords.map((keyword, index) => (
                      <Badge key={index} className="bg-neon-purple/20 text-neon-purple border border-neon-purple/50">
                        #{keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* CTA */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Ready to Get Started?</CardTitle>
                  <CardDescription className="text-gray-400">
                    Unlock the full power of AI-driven sentiment analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-advoline-orange hover:bg-advoline-orange/90 text-black font-bold mb-2">
                    Start Free Trial
                  </Button>
                  <Button
                    className="w-full border-gray-600 text-gray-400 hover:text-white bg-transparent"
                    variant="outline"
                  >
                    Schedule Demo
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
