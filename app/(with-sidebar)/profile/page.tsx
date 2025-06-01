"use client"

import { useEffect, useState } from "react"

interface UserProfile {
  first_name?: string
  last_name?: string
  email?: string
  avatar_url?: string
  position?: string
  base_salary?: string
  monthly_budget?: string
  address?: string
  zip_code?: string
  country?: string
  date_joined?: string
  department?: string
  phone?: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (res.ok) {
          const data = await res.json()
          setProfile(data)
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-red-500">Profile Not Found</h2>
          <p className="mt-2 text-gray-600">Unable to load your profile information.</p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Left Section - Avatar and Name */}
            <div className="md:w-1/3 bg-gradient-to-br from-blue-500 to-purple-600 text-white p-8">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <img
                    src={profile.avatar_url || "/placeholder.svg?height=200&width=200"}
                    alt="Profile Avatar"
                    className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <button className="absolute bottom-0 right-0 bg-white text-blue-500 rounded-full p-2 shadow-md hover:bg-gray-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </button>
                </div>
                <h1 className="mt-6 text-3xl font-bold">
                  {profile.first_name} {profile.last_name}
                </h1>
                <p className="mt-2 text-blue-100">{profile.position || "No position specified"}</p>
                <div className="mt-6 flex items-center justify-center">
                  <div className="px-3 py-1 bg-blue-700 bg-opacity-30 rounded-full text-sm">
                    Member since {profile.date_joined ? new Date(profile.date_joined).toLocaleDateString() : "N/A"}
                  </div>
                </div>
                <div className="mt-8 w-full">
                  <button className="w-full bg-white text-blue-600 px-4 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Middle Section - Basic Details */}
            <div className="md:w-1/3 p-8 border-r border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Personal Information</h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="font-medium text-gray-800">{profile.email || "Not provided"}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium text-gray-800">{profile.phone || "Not provided"}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium text-gray-800">{profile.department || "Not assigned"}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Country</p>
                  <p className="font-medium text-gray-800">{profile.country || "Not provided"}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium text-gray-800">{profile.address || "Not provided"}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Zip Code</p>
                  <p className="font-medium text-gray-800">{profile.zip_code || "Not provided"}</p>
                </div>
              </div>
            </div>

            {/* Right Section - Financial Details */}
            <div className="md:w-1/3 p-8 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Financial Information</h2>

              <div className="space-y-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500">Base Salary</p>
                  <p className="text-2xl font-bold text-gray-800">₹{profile.base_salary || "0"}</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500">Monthly Budget</p>
                  <p className="text-2xl font-bold text-gray-800">₹{profile.monthly_budget || "0"}</p>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-700 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full bg-gray-200 px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-gray-300 transition-colors flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Request Budget Increase
                    </button>

                    <button
                      className="w-full bg-red-500 px-4 py-3 rounded-lg text-white font-medium hover:bg-red-600 transition-colors flex items-center justify-center"
                      onClick={() => {
                        localStorage.removeItem("token")
                        window.location.href = "/login"
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
