"use client"

import type React from "react"
import { useState } from "react"
import { X, Eye, EyeOff } from "lucide-react"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToSignUp?: () => void
}

export default function LoginModal({
  isOpen,
  onClose,
  onSwitchToSignUp,
}: LoginModalProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Login failed")
        setLoading(false)
        return
      }

      localStorage.setItem("token", data.token)
      window.location.href = "/dashboard"
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl shadow-2xl max-w-5xl w-full overflow-hidden flex">
        {/* Left Side */}
        <div className="flex-1 p-8 lg:p-12 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-[var(--color-muted)] hover:text-[var(--color-brand)] transition-colors"
          >
            <X size={24} />
          </button>

          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-[var(--color-ink)] mb-2">
              Welcome Back
            </h2>

            <p className="text-[var(--color-muted)] mb-8">
              Log in to continue managing your finances with Finstant.
            </p>

            {error && (
              <div className="mb-4 rounded-xl bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-ink)] mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  placeholder="Enter your email"
                  required
                  className="
                    w-full
                    px-4
                    py-3
                    rounded-xl
                    border
                    border-[var(--color-border)]
                    bg-[var(--color-surface)]
                    text-[var(--color-ink)]
                    placeholder:text-[var(--color-muted)]
                    focus:outline-none
                    focus:border-[var(--color-brand)]
                    focus:ring-4
                    focus:ring-[var(--color-brand)]/10
                    transition-all
                  "
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-ink)] mb-2">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password: e.target.value,
                      })
                    }
                    placeholder="Enter your password"
                    required
                    className="
                      w-full
                      px-4
                      py-3
                      pr-12
                      rounded-xl
                      border
                      border-[var(--color-border)]
                      bg-[var(--color-surface)]
                      text-[var(--color-ink)]
                      placeholder:text-[var(--color-muted)]
                      focus:outline-none
                      focus:border-[var(--color-brand)]
                      focus:ring-4
                      focus:ring-[var(--color-brand)]/10
                      transition-all
                    "
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-brand)]"
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-[var(--color-border)] text-[var(--color-brand)] focus:ring-[var(--color-brand)]"
                  />
                  <span className="ml-2 text-sm text-[var(--color-muted)]">
                    Remember me
                  </span>
                </label>

                <button
                  type="button"
                  className="text-sm text-[var(--color-brand)] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  py-3
                  rounded-xl
                  font-semibold
                  text-white
                  bg-[var(--color-accent)]
                  hover:bg-[var(--color-accent-hover)]
                  transition-all
                  shadow-sm
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                {loading ? "Logging In..." : "Log In"}
              </button>
            </form>

            {/* Signup Link */}
            <p className="text-center text-sm text-[var(--color-muted)] mt-6">
              Don't have an account?{" "}
              {onSwitchToSignUp ? (
                <button
                  onClick={onSwitchToSignUp}
                  className="font-semibold text-[var(--color-brand)] hover:underline"
                >
                  Create one
                </button>
              ) : (
                <span className="font-semibold text-[var(--color-brand)]">
                  Create one
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="hidden md:flex flex-1 bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-brand-hover)] relative">
          <div className="flex flex-col justify-center px-12 text-white">
            <h3 className="text-4xl font-bold mb-4">
              Welcome Back!
            </h3>

            <p className="text-white/80 text-lg mb-10">
              Continue your journey toward smarter financial management.
            </p>

            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <span className="text-[var(--color-accent)] text-xl">✓</span>
                <span>Track expenses effortlessly</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[var(--color-accent)] text-xl">✓</span>
                <span>Create and manage budgets</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[var(--color-accent)] text-xl">✓</span>
                <span>Visualize spending insights</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[var(--color-accent)] text-xl">✓</span>
                <span>Achieve your financial goals</span>
              </div>
            </div>

            <div className="mt-12 pt-6 border-t border-white/20">
              <p className="text-white/70 text-sm">
                Trusted by thousands of users to manage their finances smarter.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

