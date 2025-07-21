"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, MessageCircle, Calendar, Wrench, User } from "lucide-react"
import { cn } from "@/lib/utils"

export default function MobileNav() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/hot-takes", label: "Hot Takes", icon: MessageCircle },
    { href: "/protests", label: "Protests", icon: Calendar },
    { href: "/toolbox", label: "Toolbox", icon: Wrench },
    { href: "/profile", label: "Profile", icon: User },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 md:hidden z-50">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center py-2 px-3 rounded-lg transition-colors",
                isActive ? "text-neon-purple neon-glow" : "text-gray-400 hover:text-white",
              )}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
