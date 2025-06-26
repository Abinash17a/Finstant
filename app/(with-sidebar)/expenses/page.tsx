"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { formatWord, getUserFromauthToken } from "@/lib/utils"

// IconProps type for SVG icon components
type IconProps = {
  className?: string
  size?: number
}

// Custom Icons (inline SVG components) - Fixed sizing
const DollarIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg
    className={className}
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
    />
  </svg>
)

const CalendarIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg
    className={className}
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
)

const TagIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg
    className={className}
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
    />
  </svg>
)

const LocationIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg
    className={className}
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const FileTextIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg
    className={className}
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
)

const PlusIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg
    className={className}
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
)

const MinusIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg
    className={className}
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
  </svg>
)

const TrendingUpIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg
    className={className}
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
)

const SparklesIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg
    className={className}
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
    />
  </svg>
)

const ChevronDownIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg
    className={className}
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)


// Custom Button Component
const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  type = "button",
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "success" | "danger" | "ghost"
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  className?: string
  type?: "button" | "submit"
}) => {
  const baseClasses =
    "relative overflow-hidden font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-opacity-50"

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl focus:ring-blue-500",
    secondary:
      "bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 shadow-md hover:shadow-lg focus:ring-gray-400",
    success:
      "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl focus:ring-green-500",
    danger:
      "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl focus:ring-red-500",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900 focus:ring-gray-400",
  }

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? "opacity-50 cursor-not-allowed transform-none hover:scale-100" : ""} ${className}`}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-300"></div>
    </button>
  )
}

// Custom Input Component
const Input = ({
  label,
  icon: Icon,
  error,
  className = "",
  ...props
}: {
  label?: string
  icon?: React.ComponentType<{ className?: string }>
  error?: string
  className?: string
  [key: string]: any
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>}
      <div className="relative group">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
        )}
        <input
          {...props}
          className={`w-full ${Icon ? "pl-12" : "pl-4"} pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-900 placeholder-gray-400 hover:border-gray-300`}
        />
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  )
}

// Custom Select Component
const Select = ({
  label,
  options,
  error,
  className = "",
  ...props
}: {
  label?: string
  options: { value: string; label: string }[]
  error?: string
  className?: string
  [key: string]: any
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>}
      <div className="relative">
        <select
          {...props}
          className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-900 appearance-none cursor-pointer hover:border-gray-300"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <ChevronDownIcon className="text-gray-400" />
        </div>
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  )
}

// Custom Card Component
const Card = ({
  children,
  className = "",
  hover = false,
}: { children: React.ReactNode; className?: string; hover?: boolean }) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border border-gray-100 ${hover ? "hover:shadow-xl hover:-translate-y-1" : ""} transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  )
}

export default function ExpenseTracker() {
  const [formData, setFormData] = useState({
    user_id: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    category: "",
    sub_category: "",
    payment_method: "",
    description: "",
    location: "",
    tags: "",
    type: "expense",
  })

  const [recentTransactions, setrecentTransactions] = useState([{}] as any[])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const getRecentTransactions = async () => {
    try {
      const token = localStorage.getItem("token")
      const user_id = await getUserFromauthToken(token ?? "")

      if (!user_id) {
        alert("User not authenticated")
        return
      }

      const limit = 5

      const res = await fetch(`/api/gettransactions?user_id=${user_id}&limit=${limit}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const result = await res.json()

      if (res.ok) {
        console.log(JSON.stringify(result.transactions), "result in getRecentTransactions")
        setrecentTransactions(result.transactions)
        console.log("Transaction fetched successfully!")
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error("Error fetching recent transactions:", error)
    }
  }

  useEffect(() => {
    getRecentTransactions()
  }, [])

  const categories = [
    "Food & Dining",
    "Transportation",
    "Entertainment",
    "Shopping",
    "Bills & Utilities",
    "Healthcare",
    "Other",
  ]

  const categoryMap: Record<string, string> = {
    "Food & Dining": "FOOD_DINING",
    Transportation: "TRANSPORTATION",
    Shopping: "SHOPPING",
    Entertainment: "ENTERTAINMENT",
    "Bills & Utilities": "BILLS_UTILITIES",
    Healthcare: "HEALTHCARE",
    Income: "SALARY",
    Other: "OTHER",
  }

  const subcategories: { [key: string]: string[] } = {
    "Food & Dining": ["Restaurants", "Groceries", "Fast Food", "Coffee"],
    Transportation: ["Gas & Fuel", "Public Transit", "Parking", "Maintenance"],
    Entertainment: ["Movies", "Subscriptions", "Games", "Events"],
    Shopping: ["Clothing", "Electronics", "Home & Garden", "Books"],
    "Bills & Utilities": ["Electricity", "Water", "Internet", "Phone"],
    Healthcare: ["Doctor", "Medicine", "Insurance", "Dental"],
    Income: ["Salary", "Freelance", "Investment", "Other"],
    Other: ["Miscellaneous"],
  }

  const paymentMethods = ["Credit Card", "Debit Card", "Cash", "Digital Wallet", "Bank Transfer", "Check", "UPI"]

  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "category" ? { sub_category: "" } : {}),
    }))
  }

  const handleTypeChange = (type: any) => {
    setFormData((prev) => ({
      ...prev,
      type,
      category: type === "income" ? "Income" : "",
    }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const token = localStorage.getItem("token")
      const user_id = await getUserFromauthToken(token ?? "")

      if (!user_id) {
        alert("User not authenticated")
        return
      }

      const mappedCategory = categoryMap[formData.category] ?? "OTHER"

      const dataToSend = {
        ...formData,
        user_id,
        category: mappedCategory,
      }

      const res = await fetch("/api/expense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })

      const result = await res.json()

      if (res.ok) {
        console.log("Transaction created successfully!")
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
        getRecentTransactions()
        // Reset form
        setFormData({
          user_id: "",
          amount: "",
          date: new Date().toISOString().split("T")[0],
          category: "",
          sub_category: "",
          payment_method: "",
          description: "",
          location: "",
          tags: "",
          type: "expense",
        })
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error("Submit error:", error)
      alert("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-bounce">
          <div className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center space-x-2">
            <SparklesIcon className="w-5 h-5" />
            <span>Transaction added successfully!</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <DollarIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Expense Tracker
          </h1>
          <p className="text-gray-600 text-lg">Track your finances with style and precision</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Transaction Form */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                  <PlusIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Add New Transaction</h2>
                  <p className="text-gray-600">Enter the details of your transaction</p>
                </div>
              </div>

              {/* Transaction Type Toggle */}
              <div className="flex mb-8 p-2 bg-gray-100 rounded-2xl w-fit">
                <button
                  type="button"
                  onClick={() => handleTypeChange("expense")}
                  className={`flex items-center px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    formData.type === "expense"
                      ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg transform scale-105"
                      : "text-gray-700 hover:text-gray-900 hover:bg-white"
                  }`}
                >
                  <MinusIcon className="w-4 h-4 mr-2" />
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange("income")}
                  className={`flex items-center px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    formData.type === "income"
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg transform scale-105"
                      : "text-gray-700 hover:text-gray-900 hover:bg-white"
                  }`}
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Income
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Amount and Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Amount"
                    type="number"
                    name="amount"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    icon={DollarIcon}
                    required
                  />
                  <Input
                    label="Date"
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    icon={CalendarIcon}
                    required
                  />
                </div>

                {/* Category and Subcategory */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    options={[
                      { value: "", label: "Select a category" },
                      ...categories.map((cat) => ({ value: cat, label: cat })),
                    ]}
                    required
                  />
                  <Select
                    label="Sub Category"
                    name="sub_category"
                    value={formData.sub_category}
                    onChange={handleInputChange}
                    disabled={!formData.category}
                    options={[
                      { value: "", label: "Select a subcategory" },
                      ...(formData.category && subcategories[formData.category]
                        ? subcategories[formData.category].map((sub) => ({ value: sub, label: sub }))
                        : []),
                    ]}
                  />
                </div>

                {/* Payment Method */}
                <Select
                  label="Payment Method"
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleInputChange}
                  options={[
                    { value: "", label: "Select payment method" },
                    ...paymentMethods.map((method) => ({ value: method, label: method })),
                  ]}
                  required
                />

                {/* Description */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <div className="relative group">
                    <FileTextIcon className="absolute left-4 top-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-900 placeholder-gray-400 hover:border-gray-300 resize-none"
                      placeholder="Add notes about this transaction"
                    />
                  </div>
                </div>

                {/* Location and Tags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Location (Optional)"
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Where did you spend this?"
                    icon={LocationIcon}
                  />
                  <div className="space-y-2">
                    <Input
                      label="Tags (Optional)"
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      placeholder="Comma separated tags"
                      icon={TagIcon}
                    />
                    <p className="text-xs text-gray-500">Separate multiple tags with commas</p>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant={formData.type === "expense" ? "danger" : "success"}
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    <>Add {formData.type === "expense" ? "Expense" : "Income"}</>
                  )}
                </Button>
              </form>
            </Card>
          </div>

          {/* Recent Transactions */}
          <div className="lg:col-span-1">
            <Card className="p-6 h-fit sticky top-8">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center mr-3">
                  <TrendingUpIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Recent Transactions</h3>
                  <p className="text-sm text-gray-600">Your latest activity</p>
                </div>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {recentTransactions?.map((transaction, index) => (
                  <div
                    key={transaction.id || index}
                    className="group p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span
                        className={`text-lg font-bold ${
                          transaction.type === "INCOME" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {transaction.type === "INCOME" ? "+" : "-"}${transaction.amount}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg font-medium">
                        {transaction.payment_Method}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{transaction.date}</p>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                        {formatWord(transaction.category)}
                      </span>
                      <span className="text-xs text-gray-500">{transaction.sub_category}</span>
                    </div>
                    {transaction.description && (
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2">{transaction.description}</p>
                    )}
                  </div>
                ))}

                {recentTransactions?.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUpIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">No transactions yet</p>
                    <p className="text-sm text-gray-400">Add your first transaction to get started</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
