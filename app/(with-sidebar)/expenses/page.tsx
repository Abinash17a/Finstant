"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { formatWord, getUserFromauthToken } from "@/lib/utils"

type IconProps = {
  className?: string
  size?: number
}

const DollarIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
  </svg>
)

const CalendarIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const TagIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
)

const LocationIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const FileTextIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

const PlusIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
)

const MinusIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
  </svg>
)

const TrendingUpIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
)

const SparklesIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
)

const ChevronDownIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

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
  variant?: "primary" | "secondary" | "income" | "expense" | "ghost"
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  className?: string
  type?: "button" | "submit"
}) => {
  const baseClasses =
    "relative overflow-hidden font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-opacity-30"

  const variants = {
    primary: "bg-brand hover:bg-brand-hover text-white shadow-sm hover:shadow-md focus:ring-brand",
    secondary: "bg-canvas hover:bg-border text-ink border border-border focus:ring-muted",
    income: "bg-income hover:brightness-95 text-white shadow-sm hover:shadow-md focus:ring-income",
    expense: "bg-expense hover:brightness-95 text-white shadow-sm hover:shadow-md focus:ring-expense",
    ghost: "bg-transparent hover:bg-canvas text-muted hover:text-ink focus:ring-muted",
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
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      <span className="relative z-10">{children}</span>
    </button>
  )
}

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
      {label && <label className="block text-sm font-semibold text-ink mb-2">{label}</label>}
      <div className="relative group">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted group-focus-within:text-brand transition-colors duration-200" />
        )}
        <input
          {...props}
          className={`w-full ${Icon ? "pl-12" : "pl-4"} pr-4 py-3 bg-surface border border-border rounded-xl focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all duration-200 text-ink placeholder-muted hover:border-muted`}
        />
      </div>
      {error && <p className="text-sm text-expense mt-1">{error}</p>}
    </div>
  )
}

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
      {label && <label className="block text-sm font-semibold text-ink mb-2">{label}</label>}
      <div className="relative">
        <select
          {...props}
          className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all duration-200 text-ink appearance-none cursor-pointer hover:border-muted"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <ChevronDownIcon className="text-muted" />
        </div>
      </div>
      {error && <p className="text-sm text-expense mt-1">{error}</p>}
    </div>
  )
}

const Card = ({
  children,
  className = "",
  hover = false,
}: { children: React.ReactNode; className?: string; hover?: boolean }) => {
  return (
    <div
      className={`bg-surface rounded-2xl shadow-sm border border-border ${hover ? "hover:shadow-md" : ""} transition-all duration-200 ${className}`}
    >
      {children}
    </div>
  )
}

const formatDate = (iso: string) => {
  if (!iso) return ""
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}

const formatCurrency = (amount: number | string) => {
  const n = Number(amount) || 0
  return `₹${n.toLocaleString("en-IN")}`
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

  const [recentTransactions, setRecentTransactions] = useState<any[]>([])
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
        headers: { "Content-Type": "application/json" },
      })

      const result = await res.json()

      if (res.ok) {
        setRecentTransactions(result.transactions)
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      })

      const result = await res.json()

      if (res.ok) {
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
        getRecentTransactions()
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
    <div>
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-toast-in">
          <div className="bg-income text-white px-6 py-3 rounded-xl shadow-md flex items-center space-x-2">
            <SparklesIcon className="w-5 h-5" />
            <span>Transaction added successfully!</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand rounded-2xl mb-4 shadow-sm">
            <DollarIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-brand mb-2">Expense Tracker</h1>
          <p className="text-muted text-lg">Track your finances with style and precision</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-8">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-brand rounded-xl flex items-center justify-center mr-4">
                  <PlusIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-ink">Add New Transaction</h2>
                  <p className="text-muted">Enter the details of your transaction</p>
                </div>
              </div>

              <div className="flex mb-8 p-2 bg-canvas rounded-2xl w-fit">
                <button
                  type="button"
                  onClick={() => handleTypeChange("expense")}
                  className={`flex items-center px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    formData.type === "expense"
                      ? "bg-expense text-white shadow-sm"
                      : "text-muted hover:text-ink hover:bg-surface"
                  }`}
                >
                  <MinusIcon className="w-4 h-4 mr-2" />
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange("income")}
                  className={`flex items-center px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    formData.type === "income"
                      ? "bg-income text-white shadow-sm"
                      : "text-muted hover:text-ink hover:bg-surface"
                  }`}
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Income
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
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

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-ink mb-2">Description</label>
                  <div className="relative group">
                    <FileTextIcon className="absolute left-4 top-4 text-muted group-focus-within:text-brand transition-colors duration-200" />
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full pl-12 pr-4 py-3 bg-surface border border-border rounded-xl focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all duration-200 text-ink placeholder-muted hover:border-muted resize-none"
                      placeholder="Add notes about this transaction"
                    />
                  </div>
                </div>

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
                    <p className="text-xs text-muted">Separate multiple tags with commas</p>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant={formData.type === "expense" ? "expense" : "income"}
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

          <div className="lg:col-span-1">
            <Card className="p-6 h-fit sticky top-8">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center mr-3">
                  <TrendingUpIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-ink">Recent Transactions</h3>
                  <p className="text-sm text-muted">Your latest activity</p>
                </div>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {recentTransactions?.map((transaction, index) => (
                  <div
                    key={transaction.id || index}
                    className="group p-4 bg-canvas rounded-xl border border-border hover:shadow-sm hover:border-muted transition-all duration-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span
                        className={`text-lg font-bold ${
                          transaction.type === "INCOME" ? "text-income" : "text-expense"
                        }`}
                      >
                        {transaction.type === "INCOME" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </span>
                      <span className="text-xs text-muted bg-surface border border-border px-2 py-1 rounded-lg font-medium">
                        {transaction.payment_method}
                      </span>
                    </div>
                    <p className="text-sm text-muted mb-2">{formatDate(transaction.date)}</p>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-brand bg-brand/10 px-2 py-1 rounded-lg">
                        {formatWord(transaction.category)}
                      </span>
                      <span className="text-xs text-muted">{transaction.sub_category}</span>
                    </div>
                    {transaction.description && (
                      <p className="text-xs text-muted mt-2 line-clamp-2">{transaction.description}</p>
                    )}
                  </div>
                ))}

                {recentTransactions?.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-canvas rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUpIcon className="w-8 h-8 text-muted" />
                    </div>
                    <p className="text-muted">No transactions yet</p>
                    <p className="text-sm text-muted">Add your first transaction to get started</p>
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