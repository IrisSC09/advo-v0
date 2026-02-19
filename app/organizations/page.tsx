"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Zap,
  Building2,
  CheckCircle,
  X,
  Bot,
  MessageSquare,
  Users,
  BarChart3,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function OrganizationsPage() {
  const tiers = [
    {
      id: "free",
      label: "Free",
      price: "$0",
      period: "forever",
      icon: Sparkles,
      color: "text-gray-300",
      accentColor: "#9ca3af",
      borderClass: "border-gray-700",
      glowClass: "",
      badgeClass: "bg-gray-700 text-gray-300",
      description:
        "Full access to the community. Contribute data, discover bills, and start advocating.",
      cta: "Get Started Free",
      ctaClass:
        "bg-white/10 hover:bg-white/20 text-white border border-white/20",
      features: [
        { text: "Browse legislation feed (national + state)", included: true },
        { text: "Access all community threads", included: true },
        { text: "5 AI bill analyses per day", included: true },
        { text: "Contribute to sentiment data", included: true },
        { text: "Basic engagement badges", included: true },
        { text: "Unlimited AI analyses", included: false },
        { text: "SMS outreach automation", included: false },
        { text: "AI chatbot for bill inquiries", included: false },
        { text: "Multi-team collaboration", included: false },
        { text: "Aggregate sentiment reports", included: false },
      ],
    },
    {
      id: "creator",
      label: "Creator",
      price: "$9.99",
      period: "per month",
      icon: Zap,
      color: "text-advoline-orange",
      accentColor: "#f97316",
      borderClass: "border-advoline-orange/60",
      glowClass: "shadow-[0_0_40px_rgba(249,115,22,0.15)]",
      badgeClass: "bg-advoline-orange/20 text-advoline-orange",
      description:
        "For advocates and creators who want unlimited AI power and outreach tools.",
      cta: "Start Creator Plan",
      ctaClass:
        "bg-advoline-orange hover:bg-advoline-orange/90 text-black font-bold",
      features: [
        { text: "Everything in Free", included: true },
        { text: "Unlimited AI bill analyses", included: true },
        { text: "SMS outreach automation", included: true },
        { text: "AI chatbot for specific bill inquiries", included: true },
        { text: "Advanced thread analytics", included: true },
        { text: "Priority support", included: true },
        { text: "Multi-team collaboration", included: false },
        { text: "Aggregate sentiment reports", included: false },
        { text: "API access", included: false },
        { text: "Custom branding", included: false },
      ],
    },
    {
      id: "organization",
      label: "Organization",
      price: "$39–99",
      period: "per month",
      icon: Building2,
      color: "text-neon-purple",
      accentColor: "#a855f7",
      borderClass: "border-neon-purple/60",
      glowClass: "shadow-[0_0_40px_rgba(168,85,247,0.15)]",
      badgeClass: "bg-neon-purple/20 text-neon-purple",
      description:
        "For nonprofits and educators who need policy intelligence without the analysis overhead.",
      cta: "Contact Us",
      ctaClass:
        "bg-neon-purple hover:bg-neon-purple/90 text-white font-bold neon-button",
      features: [
        { text: "Everything in Creator", included: true },
        { text: "Multi-team collaboration", included: true },
        { text: "Aggregate sentiment analysis per bill", included: true },
        { text: "Custom sentiment reports", included: true },
        { text: "API access", included: true },
        { text: "Custom branding & white-label", included: true },
        { text: "Dedicated account manager", included: true },
        { text: "Early access to new features", included: true },
        { text: "SLA & uptime guarantees", included: true },
        { text: "Onboarding & training", included: true },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-advoline-orange text-sm font-mono tracking-widest uppercase mb-4">
            Pricing & Plans
          </p>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-none tracking-tight">
            ADVOCATE AT
            <br />
            <span className="text-neon-purple neon-glow font-extralight">
              EVERY LEVEL
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            From aspiring creators to experienced nonprofits, Advoline meets you
            where you are.
          </p>
        </div>
        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {tiers.map((tier) => (
            <Card
              key={tier.id}
              className={`bg-gray-900 border-2 ${tier.borderClass} ${tier.glowClass} relative flex flex-col transition-all duration-300 hover:-translate-y-1`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-white/5`}>
                    <tier.icon className={`h-5 w-5 ${tier.color}`} />
                  </div>
                  <Badge
                    className={`${tier.badgeClass} border-0 font-mono text-xs`}
                  >
                    {tier.label}
                  </Badge>
                </div>

                <div className="mb-3">
                  <span className="text-4xl font-black text-white">
                    {tier.price}
                  </span>
                  <span className="text-gray-500 text-sm ml-2">
                    /{tier.period}
                  </span>
                </div>

                <CardDescription className="text-gray-400 text-sm leading-relaxed">
                  {tier.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col flex-1">
                <Button className={`w-full mb-6 ${tier.ctaClass}`}>
                  {tier.cta}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>

                <div className="space-y-2.5 flex-1">
                  {tier.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      {feature.included ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
                      )}
                      <span
                        className={`text-sm ${
                          feature.included ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ / Context Row */}
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-8">
              <MessageSquare className="h-6 w-6 text-advoline-orange mb-4" />
              <h3 className="text-white font-black text-xl mb-3">
                Why free users matter
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Free users aren't a cost center — they're the dataset. Every
                bill reaction, thread engagement, and AI interaction contributes
                to the sentiment layer that powers Organization-tier insights.
                The community <em>is</em> the product.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-8">
              <Building2 className="h-6 w-6 text-neon-purple mb-4" />
              <h3 className="text-white font-black text-xl mb-3">
                Built for nonprofits
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Most nonprofits spend hours parsing policy documents. Advoline's
                Organization tier delivers pre-aggregated sentiment by bill so
                your team skips straight to strategy.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Card className="bg-gray-900 border-advoline-orange/40 border-2 max-w-3xl mx-auto">
            <CardContent className="p-10">
              <h2 className="text-3xl font-black text-white mb-3">
                Not sure which plan?
              </h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                Start free. Upgrade when you need more AI power or want to run
                outreach campaigns. No credit card required to get started.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-advoline-orange hover:bg-advoline-orange/90 text-black font-bold px-8">
                  Start for Free
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-400 hover:text-white bg-transparent px-8"
                >
                  Talk to Us
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
