"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Edit3,
  FileText,
  MessageCircle,
  Grid,
  User,
  Settings,
  LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", icon: <Home />, label: "Dashboard" },
  { href: "/expenses", icon: <Edit3 />, label: "Expense" },
  { href: "/documents", icon: <FileText />, label: "Documentations" },
  { href: "/messages", icon: <MessageCircle />, label: "Notification" },
  { href: "/apps", icon: <Grid />, label: "Appearance" },
  { href: "/profile", icon: <User />, label: "Users" },
  { href: "/settings", icon: <Settings />, label: "Settings" }
]

export function Sidebar() {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1559) // Tailwind's md breakpoint 768
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  const isCollapsed = isMobile

  return (
    <div
      className={cn(
        "h-full border-r border-purple-500 bg-white flex flex-col transition-all duration-300 fixed z-50 md:relative",
        isCollapsed ? "w-16 items-center" : "w-56 px-4"
      )}
    >
      {/* Logo */}
      <Link href="/" className="mb-8 mt-4 flex items-center space-x-2">
        <div className="w-10 h-10 rounded-md bg-blue-400 flex items-center justify-center text-white">
          <Grid className="w-6 h-6" />
        </div>
        {!isCollapsed && (
          <span className="text-xl font-bold text-gray-700">Finstant</span>
        )}
      </Link>

      {/* Navigation Items */}
      <nav className="flex flex-col space-y-2 flex-1">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={pathname === item.href}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>

      {/* Logout */}
      <button
        className={cn(
          "flex items-center space-x-2 text-white bg-slate-500 hover:bg-slate-600 rounded-md mt-4 mb-6",
          isCollapsed ? "w-10 h-10 justify-center" : "px-4 py-2"
        )}
        onClick={() => console.log("Logout clicked")}
      >
        <LogOut className="w-5 h-5" />
        {!isCollapsed && <span>Logout</span>}
      </button>
    </div>
  )
}

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  isActive: boolean
  isCollapsed: boolean
}

function NavItem({ href, icon, label, isActive, isCollapsed }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center space-x-3 px-3 py-2 rounded-md transition-all",
        isActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100",
        isCollapsed ? "justify-center" : ""
      )}
    >
      <span className="w-5 h-5">{icon}</span>
      {!isCollapsed && <span className="text-sm">{label}</span>}
    </Link>
  )
}
