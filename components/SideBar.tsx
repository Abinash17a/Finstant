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
  { href: "/dashboard", icon: <Home size={18} />, label: "Dashboard" },
  { href: "/expenses", icon: <Edit3 size={18} />, label: "Expense" },
  { href: "/insights", icon: <FileText size={18} />, label: "Insights" },
  { href: "/messages", icon: <MessageCircle size={18} />, label: "Notification" },
  { href: "/apps", icon: <Grid size={18} />, label: "Appearance" },
  { href: "/profile", icon: <User size={18} />, label: "Users" },
  { href: "/settings", icon: <Settings size={18} />, label: "Settings" }
]

export function Sidebar() {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  const isCollapsed = isMobile

  return (
    <aside
      className={cn(
        "h-screen border-r bg-[var(--color-surface)] border-[var(--color-border)] flex flex-col transition-all duration-300 fixed z-50 md:relative shadow-sm",
        isCollapsed ? "w-16 items-center px-2" : "w-64 px-4"
      )}
    >
      {/* Logo */}
      <Link
        href="/"
        className={cn(
          "flex items-center py-5",
          isCollapsed ? "justify-center" : "gap-3"
        )}
      >
        <div className="h-10 w-10 rounded-xl bg-[var(--color-brand)] flex items-center justify-center shadow-sm">
          <Grid className="h-5 w-5 text-white" />
        </div>

        {!isCollapsed && (
          <div>
            <h1 className="text-lg font-bold text-[var(--color-ink)]">
              Finstant
            </h1>
            <p className="text-xs text-[var(--color-muted)]">
              Finance Tracker
            </p>
          </div>
        )}
      </Link>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 mt-4 flex-1">
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
        onClick={() => console.log("Logout")}
        className={cn(
          "flex items-center rounded-xl mb-5 transition-all duration-200 bg-[var(--color-expense)] hover:opacity-90 text-white shadow-sm",
          isCollapsed
            ? "h-10 w-10 justify-center"
            : "gap-2 px-4 py-3"
        )}
      >
        <LogOut size={18} />
        {!isCollapsed && (
          <span className="font-medium text-sm">Logout</span>
        )}
      </button>
    </aside>
  )
}

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  isActive: boolean
  isCollapsed: boolean
}

function NavItem({
  href,
  icon,
  label,
  isActive,
  isCollapsed
}: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "relative flex items-center rounded-xl px-3 py-3 transition-all duration-200 group",
        isActive
          ? "bg-[var(--color-brand)] text-white shadow-sm"
          : "text-[var(--color-muted)] hover:bg-[var(--color-canvas)] hover:text-[var(--color-brand)]",
        isCollapsed ? "justify-center" : "gap-3"
      )}
    >
      {/* Active Indicator */}
      {isActive && (
        <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[var(--color-accent)]" />
      )}

      <span>{icon}</span>

      {!isCollapsed && (
        <span className="text-sm font-medium">
          {label}
        </span>
      )}
    </Link>
  )
}