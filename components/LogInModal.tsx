"use client"

import type React from "react"

import { useState } from "react"
import { X, Eye, EyeOff } from "lucide-react"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToSignUp?: () => void
}

export default function LoginModal({ isOpen, onClose, onSwitchToSignUp }: LoginModalProps) {
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
      // On success
      console.log('User signed up successfully!')
      window.location.href = '/dashboard'
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-999 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex">
        {/* Left side - Form */}
        <div className="flex-1 p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>

          <div className="max-w-sm mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Log In</h2>
            <p className="text-gray-500 text-sm mb-8">
              Already managing your spending with Finstant? Log in and keep going strong.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4ED7F1] focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4ED7F1] focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-[#4ED7F1] focus:ring-[#4ED7F1]" />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-[#4ED7F1] hover:underline">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-gray-400 text-white py-3 rounded-lg font-medium hover:bg-gray-500 transition-colors"
              >
                Log In
              </button>
            </form>

            <p className="text-sm text-gray-500 mt-6 text-center">
              Don't have an account?{" "}
              {onSwitchToSignUp ? (
                <button onClick={onSwitchToSignUp} className="text-[#4ED7F1] hover:underline font-medium">
                  Sign up for free
                </button>
              ) : (
                <span className="text-[#4ED7F1] font-medium">Sign up for free</span>
              )}
            </p>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-red-500 to-purple-600"></div>
          <img
            src="/placeholder.svg?height=600&width=400"
            alt="Financial coins"
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
            onError={(e) => {
              e.currentTarget.style.display = "none"
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-center">
              <h3 className="text-3xl font-bold mb-4">Welcome Back!</h3>
              <p className="text-lg opacity-90">Continue your financial success</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
