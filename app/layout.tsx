import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import MobileNav from "@/components/mobile-nav"
import { AuthProvider } from "@/components/auth/auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Advoline - Your Pipeline to Advocacy",
  description: "Gen Z-focused digital advocacy platform for social change",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          <main className="pb-16 md:pb-0">{children}</main>
          <MobileNav />
        </AuthProvider>
      </body>
    </html>
  )
}
