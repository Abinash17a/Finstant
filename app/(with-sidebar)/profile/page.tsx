"use client"

import { useEffect, useState, useRef } from "react"
import { Camera, Edit3, Mail, Phone, MapPin, Building2, CreditCard, Calendar, User, Settings } from "lucide-react"
import { getUserFromauthToken } from "@/lib/utils"

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
  created_at?: string
  department?: string
  phone_number?: string
}

interface EditedProfile {
  first_name?: string
  last_name?: string
  avatar_url?: string
  position?: string
  base_salary?: string
  monthly_budget?: string
  address?: string
  zip_code?: string
  country?: string
  department?: string
  phone_number?: string
}
export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [editing, setEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState<EditedProfile | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null)
  // import boy from "../../../public/assets/boyone.png"

  const avatarOptions = [
    { name: 'Boy One', url: '/assets/boyone.png' },
    { name: 'Girl One', url: '/assets/girlone.png' },
    { name: 'Man One', url: '/assets/manone.png' },
    { name: 'Man Two', url: '/assets/mantwo.png' },
    { name: 'Woman One', url: '/assets/womanone.png' },
    { name: 'Woman Two', url: '/assets/womantwo.png' },
  ];


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

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string) // Just for preview
    }
    reader.readAsDataURL(file)

    // Save actual file to FormData for upload later
    setEditedProfile(prev => ({
      ...prev,
      avatarFile: file,
    }))
  }
  const handleAvatarSelect = (url: string) => {
    setEditedProfile(prev => ({
      ...prev,
      avatar_url: url,
    }));
    setShowAvatarModal(false);
  };
  const handleUserDataUpdate = async () => {
    try {
      console.log("Edited profile---------------data-----", editedProfile);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No auth token found");
      }

      const id = await getUserFromauthToken(token);
      console.log(id, "id of user to be updated");

      const response = await fetch(`/api/users`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editedProfile),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed response:", errorData);
        throw new Error(errorData.message || 'Failed to update user');
      }

      const data = await response.json();
      console.log('User data updated successfully', data);
      setEditing(false);
      fetchProfile()

      return data;
    } catch (error: any) {
      console.error("Error updating user:", error.message || error);
      // Optionally show user-facing error message here
    }
  };



  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-indigo-200 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-t-indigo-600 border-r-indigo-600 rounded-full animate-spin"></div>
          </div>
          <p className="mt-6 text-slate-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Profile Not Found</h2>
          <p className="text-slate-600 mb-6">Unable to load your profile information.</p>
          <button
            onClick={() => (window.location.href = "/landing")}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
          >
            Re Login
          </button>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "financial", label: "Financial", icon: CreditCard }
  ]

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-1 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <h1 className="text-xl font-bold text-slate-800">Profile</h1>
              <button className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden mb-8">
            <div className="relative h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              <div className="absolute top-4 right-4">
                <button className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
                  <Edit3 className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            <div className="relative px-8 pb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-16 mb-6">
                <div className="relative rounded-full">
                  <img
                    src={profile?.avatar_url || "/placeholder.svg?height=120&width=120"}
                    alt="Choose your Avatar"
                    className="w-32 h-32 rounded-full object-cover bg-white border-4 border-white shadow-lg"
                  />

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    ref={fileInputRef}
                    style={{ display: "none" }}
                  />

                  {editing && (
                    <button
                      onClick={() => setShowAvatarModal(true)}
                      className="absolute -bottom-2 -right-2 text-white bg-green-600 hover:bg-green-700 rounded-xl p-2.5 shadow-lg transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
                  <h2 className="text-3xl font-bold !text-white">
                    {profile.first_name} {profile.last_name}
                  </h2>
                  <p className="text-lg text-indigo-600 font-medium mt-1">{profile.position}</p>

                  <div className="flex items-center mt-3 text-sm text-slate-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Member since{" "}
                    {profile.created_at
                      ? new Date(profile.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })
                      : "N/A"}
                  </div>
                </div>

                <div className="mt-4 sm:mt-0">
                  {!editing ? (
                    <button
                      onClick={() => setEditing(true)}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleUserDataUpdate()}
                        className="px-6 py-3 bg-green-900 hover:bg-green-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditing(false)}
                        className="px-6 py-3 bg-red-900 hover:bg-red-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        Cancel Edit
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>


          {/* Navigation Tabs */}
          <div className="flex space-x-1 bg-white/60 backdrop-blur-sm p-1 rounded-2xl mb-8 border border-white/20">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === tab.id
                    ? "bg-white text-indigo-600 shadow-md"
                    : "text-slate-600 hover:text-slate-800 hover:bg-white/50"
                    }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Content Area */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                  <User className="w-5 h-5 mr-2 text-indigo-600" />
                  Personal Information
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center p-4 bg-slate-50/50 rounded-xl">
                    <Mail className="w-5 h-5 text-indigo-600 mr-4" />
                    <div className="flex-1">
                      <p className="text-sm text-slate-500">Email Address</p>
                      <p className="font-medium text-slate-800">{profile.email || "Not provided"}</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-slate-50/50 rounded-xl">
                    <Phone className="w-5 h-5 text-indigo-600 mr-4" />
                    <div className="flex-1">
                      <p className="text-sm text-slate-500">Phone Number</p>
                      {editing ? (
                        <input
                          type="text"
                          name="phone_number"
                          placeholder="Enter phone number"
                          value={editedProfile?.phone_number || ""}
                          onChange={(e) =>
                            setEditedProfile((prev) => ({
                              ...prev,
                              phone_number: e.target.value,
                            }))
                          }
                          className="w-fit px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm"
                        />
                      ) : (
                        <p className="font-medium text-slate-800">
                          {profile.phone_number || "Not provided"}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* <div className="flex items-center p-4 bg-slate-50/50 rounded-xl">
                  <Building2 className="w-5 h-5 text-indigo-600 mr-4" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-500">Department</p>
                    {editing ? (
                      <input
                        type="text"
                        name="department"
                        placeholder="Enter department"
                        value={editedProfile?.department || ""}
                        onChange={(e) =>
                          setEditedProfile((prev) => ({
                            ...prev,
                            department: e.target.value,
                          }))
                        }
                        className="w-fit px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm"
                      />
                    ) : (
                      <p className="font-medium text-slate-800">{profile.department || "Not assigned"}</p>
                    )}
                  </div>
                </div> */}
                </div>
              </div>

              {/* Location Information */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-indigo-600" />
                  Location Details
                </h3>
                <div className="space-y-6">
                  {/* Country */}
                  <div className="p-4 bg-slate-50/50 rounded-xl">
                    <p className="text-sm text-slate-500 mb-1">Country</p>
                    {editing ? (
                      <select
                        id="country"
                        name="country"
                        value={editedProfile?.country || ""}
                        onChange={(e) =>
                          setEditedProfile({ ...editedProfile, country: e.target.value })
                        }
                        className="w-fit border px-3 py-2 rounded-md"
                      >
                        <option value="">Select a country</option>
                        <option value="India">India</option>
                        <option value="Nepal">Nepal</option>
                        <option value="USA">USA</option>
                        <option value="China">China</option>
                      </select>
                    ) : (
                      <p className="font-medium text-slate-800">{profile.country || "Not provided"}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="p-4 bg-slate-50/50 rounded-xl">
                    <p className="text-sm text-slate-500 mb-1">Address</p>
                    {editing ? (
                      <input
                        type="text"
                        name="address"
                        placeholder="Enter address"
                        value={editedProfile?.address || ""}
                        onChange={(e) =>
                          setEditedProfile((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm"
                      />
                    ) : (
                      <p className="font-medium text-slate-800">{profile.address || "Not provided"}</p>
                    )}
                  </div>

                  {/* Zip Code */}
                  <div className="p-4 bg-slate-50/50 rounded-xl">
                    <p className="text-sm text-slate-500 mb-1">Zip Code</p>
                    {editing ? (
                      <input
                        type="text"
                        name="zip_code"
                        placeholder="Enter zip code"
                        value={editedProfile?.zip_code || ""}
                        onChange={(e) =>
                          setEditedProfile((prev) => ({
                            ...prev,
                            zip_code: e.target.value,
                          }))
                        }
                        className="w-32 px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm"
                      />
                    ) : (
                      <p className="font-medium text-slate-800">{profile.zip_code || "Not provided"}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}


          {activeTab === "financial" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Base Salary Card */}
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg p-8 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Base Salary</h3>
                  <div className="p-3 bg-white/20 rounded-xl">
                    <CreditCard className="w-6 h-6" />
                  </div>
                </div>

                {!editing ? (
                  <>
                    <p className="text-4xl font-bold mb-2">₹{profile.base_salary || "0"}</p>
                    <p className="text-green-100">Annual compensation</p>
                  </>
                ) : (
                  <>
                    <input
                      type="number"
                      className="text-3xl font-bold text-black rounded-xl p-2 w-full"
                      value={editedProfile?.base_salary || ""}
                      onChange={(e) =>
                        setEditedProfile((prev) => ({
                          ...prev,
                          base_salary: e.target.value,
                        }))
                      }
                    />
                    <p className="text-green-100 mt-2">Annual compensation</p>
                  </>
                )}
              </div>

              {/* Monthly Budget Card */}
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-8 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Monthly Budget</h3>
                  <div className="p-3 bg-white/20 rounded-xl">
                    <CreditCard className="w-6 h-6" />
                  </div>
                </div>

                {!editing ? (
                  <>
                    <p className="text-4xl font-bold mb-2">₹{profile.monthly_budget || "0"}</p>
                    <p className="text-blue-100">Available monthly</p>
                  </>
                ) : (
                  <>
                    <input
                      type="number"
                      className="text-3xl font-bold text-black rounded-xl p-2 w-full"
                      value={editedProfile?.monthly_budget || ""}
                      onChange={(e) =>
                        setEditedProfile((prev) => ({
                          ...prev,
                          monthly_budget: e.target.value,
                        }))
                      }
                    />
                    <p className="text-blue-100 mt-2">Available monthly</p>
                  </>
                )}
              </div>
            </div>
          )}


        </div>
      </div>

      {showAvatarModal && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Choose Your Avatar</h3>
            <div className="grid grid-cols-3 gap-4">
              {avatarOptions.map((avatar, idx) => (
                <div key={idx} className="text-center">
                  <img
                    src={avatar.url}
                    alt={avatar.name}
                    className="w-20 h-20 rounded-full cursor-pointer border-2 hover:border-indigo-600 transition"
                    onClick={() => handleAvatarSelect(avatar.url)}
                  />
                  <p className="text-xs mt-1 text-gray-600">{avatar.name}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowAvatarModal(false)}
              className="mt-6 w-full py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-800 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  )
}