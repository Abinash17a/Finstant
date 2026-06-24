"use client"

import type React from "react"
import { useState } from "react"
import { X, Eye, EyeOff } from "lucide-react"

interface SignUpModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToLogin?: () => void
}

export default function SignUpModal({ isOpen, onClose, onSwitchToLogin }: SignUpModalProps) {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    country: "",
    position: "",
  })

  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        alert('User signed up successfully!')
      } else {
        alert(`Signup error: ${data.error}`)
      }
    } catch (error) {
      alert('Something went wrong during signup. Please try again.')
      console.log('error', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-ink/50 z-[999] flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex">
        {/* Left side - Form */}
        <div className="flex-1 p-8 relative overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted hover:text-ink transition-colors"
          >
            <X size={24} />
          </button>

          <div className="max-w-sm mx-auto">
            <h2 className="text-2xl font-bold text-ink mb-2">Create an account</h2>
            <p className="text-muted text-sm mb-8">
              Already have an account?{" "}
              {onSwitchToLogin ? (
                <button onClick={onSwitchToLogin} className="text-brand hover:underline font-medium">
                  Log in
                </button>
              ) : (
                <span className="text-brand font-medium">Log in</span>
              )}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-ink mb-2">Email address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-2">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                  placeholder="Enter your first name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-2">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                  placeholder="Enter your last name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 pr-12 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                    placeholder="Create a password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-ink"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-2">Country of residence</label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                  required
                >
                  <option value="">Select your country</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="JP">Japan</option>
                  <option value="IN">India</option>
                  <option value="BR">Brazil</option>
                  <option value="MX">Mexico</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-2">Designation</label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                  placeholder="Enter your Designation"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-accent text-white py-3 rounded-lg font-medium hover:bg-accent-hover transition-colors"
              >
                Create an account
              </button>
            </form>

            <p className="text-xs text-muted mt-6 text-center">
              By creating an account, you agree to our{" "}
              <a href="#" className="text-brand hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-brand hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>

        {/* Right side - Brand panel */}
        <div className="flex-1 bg-brand relative overflow-hidden hidden md:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-brand to-brand-hover"></div>
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="text-white text-center">
              <h3 className="text-3xl font-bold mb-4">Welcome to Finstant!</h3>
              <p className="text-lg opacity-90">Start your financial journey today</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}