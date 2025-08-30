"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Brain, MessageCircle, Megaphone } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import AuthModal from "@/components/auth/auth-modal"

export default function HomePage() {
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup")
  const { user } = useAuth()

  const handleStartForFree = () => {
    if (user) {
      // User is already signed in, redirect to legislation feed
      window.location.href = "/legislation"
    } else {
      setAuthMode("signup")
      setAuthModalOpen(true)
    }
  }

  const features = [
    {
      icon: Brain,
      title: "AI Summarization",
      description: "Complex legislation broken down into digestible summaries with key points and implications.",
      color: "text-neon-purple",
    },
    {
      icon: MessageCircle,
      title: "Creative Threads",
      description: "Share zines, protest art, music, and blogs to make legislation accessible and engaging.",
      color: "text-advoline-orange",
    },
    {
      icon: Megaphone,
      title: "Direct Impact",
      description: "Connect directly with representatives and track real policy changes driven by community action.",
      color: "text-green-500",
    },
  ]

  return (
    <>
      <div className="min-h-screen bg-black">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Background with overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/images/hero-background.jpg'), url('/placeholder.svg?height=800&width=1200')`,
            }}
          >
            <div className="absolute inset-0 bg-black/80"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-advoline-orange/10 to-advoline-purple/10"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 text-center max-w-5xl mx-auto px-4 pt-20">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              YOUR PIPELINE TO
              <span className="block text-advoline-orange">ADVOCACY</span>
            </h1>
            <div className="text-lg md:text-xl text-white font-light neon-glow mb-8 tracking-wider">
              DEMOCRATIZING POLITICAL INFORMATION FOR THE NEXT GENERATION
            </div>
            <p className="text-lg md:text-xl text-gray-200 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
              Combat polarization. Amplify youth voices. Transform complex legislation into accessible, actionable
              content that drives real change.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={handleStartForFree}
                className="bg-advoline-orange hover:bg-advoline-orange/90 text-black font-bold text-lg px-8 py-4"
              >
                {user ? "Explore Legislation" : "Start For Free"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Link href="/threads">
                <Button size="lg" className="neon-button text-black font-bold text-lg px-8 py-4 border-0">
                  Explore Threads
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                OUR <span className="text-neon-purple neon-glow font-extralight">MISSION</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                Guarding freedom of political knowledge and expression through youth voices. No more misinformation,
                echo chambers, and bias.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-black border-gray-800 text-center">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-advoline-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="h-8 w-8 text-advoline-orange" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Democratizing Information</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Making complex political information accessible to everyone, regardless of background or education
                    level.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black border-gray-800 text-center">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-neon-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="h-8 w-8 text-neon-purple" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Combating Polarization</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Fostering understanding through creative expression and fact-based discussions that bridge divides.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black border-gray-800 text-center">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Megaphone className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Amplifying Youth Voices</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Empowering the next generation to participate meaningfully in democracy and drive policy change.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-black">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                POWERFUL <span className="text-advoline-orange text-glow font-extralight">FEATURES</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                Everything you need to understand, engage with, and influence the political process.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="bg-gray-900 border-gray-800 hover:border-advoline-orange transition-colors"
                >
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gray-800 rounded-lg">
                        <feature.icon className={`h-8 w-8 ${feature.color}`} />
                      </div>
                      <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/legislation">
                <Button className="bg-advoline-orange hover:bg-advoline-orange/90 text-black font-bold text-lg px-8 py-4">
                  Explore Features
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              READY TO MAKE YOUR <span className="text-neon-purple neon-glow font-extralight">VOICE HEARD?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-12 font-light leading-relaxed">
              Join the movement. Voice your freedom. Drive the change.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                size="lg"
                onClick={handleStartForFree}
                className="bg-advoline-orange hover:bg-advoline-orange/90 text-black font-bold text-xl px-12 py-6"
              >
                {user ? "Explore Legislation" : "Start For Free"}
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
              <Button size="lg" className="neon-button text-black font-bold text-xl px-12 py-6 border-0">
                Watch Demo
              </Button>
            </div>
            <p className="text-gray-400">Start exploring real legislation today!</p>
          </div>
        </section>

        {/* Contact Footer */}
        <footer className="py-12 bg-black border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="text-2xl font-black text-advoline-orange">ADVOLINE</div>
                <div className="text-sm font-light neon-glow tracking-wide text-neon-purple">
                  Your Pipeline to Advocacy
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-400">Questions? We're here to help.</span>
                <Button className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-600">Contact Us</Button>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  )
}
