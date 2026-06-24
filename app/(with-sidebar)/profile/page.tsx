"use client"

import { useEffect, useState, useRef } from "react"
import { Camera, Edit3, Mail, Phone, MapPin, CreditCard, Calendar, User } from "lucide-react"
import { getUserFromauthToken } from "@/lib/utils"
import { UserProfile, EditedProfile } from "../../types/user";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [editing, setEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState<EditedProfile | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null)

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
        headers: { Authorization: `Bearer ${token}` },
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

  // Seed edit form with current profile so unedited fields aren't lost on save
  const startEditing = () => {
    setEditedProfile(profile ? { ...profile } : null)
    setEditing(true)
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)

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
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No auth token found");
      }

      const id = await getUserFromauthToken(token);

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
      setEditing(false);
      fetchProfile()

      return data;
    } catch (error: any) {
      console.error("Error updating user:", error.message || error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-border rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-t-brand border-r-brand rounded-full animate-spin"></div>
          </div>
          <p className="mt-6 text-muted font-medium">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-surface rounded-2xl shadow-xl border border-border">
          <div className="w-16 h-16 bg-expense/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-expense" />
          </div>
          <h2 className="text-2xl font-bold text-ink mb-2">Profile Not Found</h2>
          <p className="text-muted mb-6">Unable to load your profile information.</p>
          <button
            onClick={() => (window.location.href = "/landing")}
            className="px-6 py-3 bg-brand text-white rounded-xl hover:bg-brand-hover transition-all duration-200 font-medium shadow-sm hover:shadow-md"
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
      <div>
        {/* Header */}
        <div className="bg-surface/80 backdrop-blur-md border-b border-border sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-1 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <h1 className="text-xl font-bold text-ink">Profile</h1>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header Card */}
          <div className="bg-surface rounded-3xl shadow-sm border border-border overflow-hidden mb-8">
            <div className="relative h-32 bg-gradient-to-r from-brand to-brand-hover">
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
                    className="w-32 h-32 rounded-full object-cover bg-surface border-4 border-surface shadow-lg"
                  />

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
                      className="absolute -bottom-2 -right-2 text-white bg-brand hover:bg-brand-hover rounded-xl p-2.5 shadow-lg transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
                  <h2 className="text-3xl font-bold text-white">
                    {profile.first_name} {profile.last_name}
                  </h2>
                  <p className="text-lg text-white/90 font-medium mt-1">{profile.position}</p>

                  <div className="flex items-center mt-3 text-sm text-muted">
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
                      onClick={startEditing}
                      className="px-6 py-3 bg-brand hover:bg-brand-hover text-white font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleUserDataUpdate()}
                        className="px-6 py-3 bg-brand hover:bg-brand-hover text-white font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditing(false)}
                        className="px-6 py-3 border border-border text-ink hover:bg-canvas font-medium rounded-xl transition-all duration-200"
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
          <div className="flex space-x-1 bg-canvas/60 p-1 rounded-2xl mb-8 border border-border">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === tab.id
                    ? "bg-surface text-brand shadow-sm"
                    : "text-muted hover:text-ink hover:bg-surface/50"
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
              <div className="bg-surface rounded-2xl shadow-sm border border-border p-6">
                <h3 className="text-xl font-bold text-ink mb-6 flex items-center">
                  <User className="w-5 h-5 mr-2 text-brand" />
                  Personal Information
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center p-4 bg-canvas/60 rounded-xl">
                    <Mail className="w-5 h-5 text-brand mr-4" />
                    <div className="flex-1">
                      <p className="text-sm text-muted">Email Address</p>
                      <p className="font-medium text-ink">{profile.email || "Not provided"}</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-canvas/60 rounded-xl">
                    <Phone className="w-5 h-5 text-brand mr-4" />
                    <div className="flex-1">
                      <p className="text-sm text-muted">Phone Number</p>
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
                          className="w-fit px-4 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all duration-200"
                        />
                      ) : (
                        <p className="font-medium text-ink">
                          {profile.phone_number || "Not provided"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="bg-surface rounded-2xl shadow-sm border border-border p-6">
                <h3 className="text-xl font-bold text-ink mb-6 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-brand" />
                  Location Details
                </h3>
                <div className="space-y-6">
                  <div className="p-4 bg-canvas/60 rounded-xl">
                    <p className="text-sm text-muted mb-1">Country</p>
                    {editing ? (
                      <select
                        id="country"
                        name="country"
                        value={editedProfile?.country || ""}
                        onChange={(e) =>
                          setEditedProfile({ ...editedProfile, country: e.target.value })
                        }
                        className="w-fit px-4 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                      >
                        <option value="">Select a country</option>
                        <option value="India">India</option>
                        <option value="Nepal">Nepal</option>
                        <option value="USA">USA</option>
                        <option value="China">China</option>
                      </select>
                    ) : (
                      <p className="font-medium text-ink">{profile.country || "Not provided"}</p>
                    )}
                  </div>

                  <div className="p-4 bg-canvas/60 rounded-xl">
                    <p className="text-sm text-muted mb-1">Address</p>
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
                        className="w-full px-4 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all duration-200"
                      />
                    ) : (
                      <p className="font-medium text-ink">{profile.address || "Not provided"}</p>
                    )}
                  </div>

                  <div className="p-4 bg-canvas/60 rounded-xl">
                    <p className="text-sm text-muted mb-1">Zip Code</p>
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
                        className="w-32 px-4 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all duration-200"
                      />
                    ) : (
                      <p className="font-medium text-ink">{profile.zip_code || "Not provided"}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "financial" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Base Salary Card */}
              <div className="bg-income rounded-2xl shadow-sm p-8 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Base Salary</h3>
                  <div className="p-3 bg-white/20 rounded-xl">
                    <CreditCard className="w-6 h-6" />
                  </div>
                </div>

                {!editing ? (
                  <>
                    <p className="text-4xl font-bold mb-2">₹{profile.base_salary || "0"}</p>
                    <p className="text-white/80">Annual compensation</p>
                  </>
                ) : (
                  <>
                    <input
                      type="number"
                      className="text-3xl font-bold text-ink rounded-xl p-2 w-full border border-white/40"
                      value={editedProfile?.base_salary || ""}
                      onChange={(e) =>
                        setEditedProfile((prev) => ({
                          ...prev,
                          base_salary: e.target.value,
                        }))
                      }
                    />
                    <p className="text-white/80 mt-2">Annual compensation</p>
                  </>
                )}
              </div>

              {/* Monthly Budget Card */}
              <div className="bg-brand rounded-2xl shadow-sm p-8 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Monthly Budget</h3>
                  <div className="p-3 bg-white/20 rounded-xl">
                    <CreditCard className="w-6 h-6" />
                  </div>
                </div>

                {!editing ? (
                  <>
                    <p className="text-4xl font-bold mb-2">₹{profile.monthly_budget || "0"}</p>
                    <p className="text-white/80">Available monthly</p>
                  </>
                ) : (
                  <>
                    <input
                      type="number"
                      className="text-3xl font-bold text-ink rounded-xl p-2 w-full border border-white/40"
                      value={editedProfile?.monthly_budget || ""}
                      onChange={(e) =>
                        setEditedProfile((prev) => ({
                          ...prev,
                          monthly_budget: e.target.value,
                        }))
                      }
                    />
                    <p className="text-white/80 mt-2">Available monthly</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {showAvatarModal && (
        <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-bold mb-4 text-ink">Choose Your Avatar</h3>
            <div className="grid grid-cols-3 gap-4">
              {avatarOptions.map((avatar, idx) => (
                <div key={idx} className="text-center">
                  <img
                    src={avatar.url}
                    alt={avatar.name}
                    className="w-20 h-20 rounded-full cursor-pointer border-2 border-border hover:border-brand transition"
                    onClick={() => handleAvatarSelect(avatar.url)}
                  />
                  <p className="text-xs mt-1 text-muted">{avatar.name}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowAvatarModal(false)}
              className="mt-6 w-full py-2 border border-border text-ink rounded-xl hover:bg-canvas transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  )
}