"use client"

import { useState } from "react"
import { Camera, Mail, Phone, MapPin, Briefcase, DollarSign, Calendar, Edit2, Save, X } from "lucide-react"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    role: "Senior Financial Analyst",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Finance Street, New York, NY 10001",
    dateJoined: "January 15, 2022",
    salary: "85,000",
    monthlyBudget: "4,200",
    about:
      "Experienced financial analyst with a passion for budget optimization and expense tracking. I help companies and individuals make smarter financial decisions through data-driven insights.",
    skills: ["Financial Planning", "Budget Analysis", "Expense Tracking", "Investment Strategy", "Risk Assessment"],
  })

  const handleChange = (field: string, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    console.log("Saving profile:", profile)
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-100 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-teal-500 to-emerald-600 h-32 relative">
            {isEditing && (
              <button
                className="absolute top-4 right-4 bg-white text-teal-600 p-2 rounded-full shadow-md hover:bg-teal-50"
                onClick={() => setIsEditing(false)}
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="px-6 pb-6 relative">
            <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 md:-mt-12 mb-4 md:mb-6 relative">
              <div className="relative mb-4 md:mb-0">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-teal-100 flex items-center justify-center overflow-hidden shadow-lg">
                  <img
                    src="/placeholder.svg?height=128&width=128"
                    alt={profile.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const img = e.currentTarget as HTMLImageElement
                      img.style.display = "none"
                      const sibling = img.nextElementSibling as HTMLElement | null
                      if (sibling) sibling.style.display = "flex"
                    }}
                  />
                  <div className="hidden text-3xl font-bold text-teal-600">
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-teal-600 text-white p-2 rounded-full shadow-md hover:bg-teal-700">
                    <Camera size={16} />
                  </button>
                )}
              </div>

              <div className="md:ml-6 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-800">{profile.name}</h2>
                <p className="text-teal-600 font-medium">{profile.role}</p>
                <p className="text-gray-500 text-sm mt-1 flex items-center justify-center md:justify-start">
                  <Calendar size={14} className="mr-1" />
                  Member since {profile.dateJoined}
                </p>
              </div>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="md:ml-auto mt-4 md:mt-0 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center"
                >
                  <Edit2 size={16} className="mr-2" />
                  Edit Profile
                </button>
              )}

              {isEditing && (
                <button
                  onClick={handleSave}
                  className="md:ml-auto mt-4 md:mt-0 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center"
                >
                  <Save size={16} className="mr-2" />
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Contact Info */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                  {!isEditing ? (
                    <div className="flex items-center">
                      <Mail size={16} className="text-teal-600 mr-2" />
                      <span>{profile.email}</span>
                    </div>
                  ) : (
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                  {!isEditing ? (
                    <div className="flex items-center">
                      <Phone size={16} className="text-teal-600 mr-2" />
                      <span>{profile.phone}</span>
                    </div>
                  ) : (
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                  {!isEditing ? (
                    <div className="flex items-start">
                      <MapPin size={16} className="text-teal-600 mr-2 mt-1" />
                      <span>{profile.address}</span>
                    </div>
                  ) : (
                    <textarea
                      value={profile.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Job Title</label>
                  {!isEditing ? (
                    <div className="flex items-center">
                      <Briefcase size={16} className="text-teal-600 mr-2" />
                      <span>{profile.role}</span>
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={profile.role}
                      onChange={(e) => handleChange("role", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Financial Info & About */}
          <div className="md:col-span-2 space-y-6">
            {/* Financial Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Annual Salary</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign size={16} className="text-teal-600" />
                    </div>
                    {!isEditing ? (
                      <div className="bg-gray-50 px-3 py-2 pl-10 rounded-md border border-gray-200">
                        ${profile.salary}
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={profile.salary}
                        onChange={(e) => handleChange("salary", e.target.value)}
                        className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Monthly Budget</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign size={16} className="text-teal-600" />
                    </div>
                    {!isEditing ? (
                      <div className="bg-gray-50 px-3 py-2 pl-10 rounded-md border border-gray-200">
                        ${profile.monthlyBudget}
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={profile.monthlyBudget}
                        onChange={(e) => handleChange("monthlyBudget", e.target.value)}
                        className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-500">Budget Utilization</span>
                  <span className="text-sm font-medium text-teal-600">65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-teal-600 h-2.5 rounded-full" style={{ width: "65%" }}></div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">About Me</h3>

              {!isEditing ? (
                <p className="text-gray-700">{profile.about}</p>
              ) : (
                <textarea
                  value={profile.about}
                  onChange={(e) => handleChange("about", e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              )}

              <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="font-medium text-gray-700 mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
