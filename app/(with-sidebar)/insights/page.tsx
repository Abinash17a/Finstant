"use client"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { InsightRenderer } from "@/components/InsightRenderer"
import { dbinsightsDataModifier, getUserFromauthToken } from "@/lib/utils"
import { RefreshCw, Calendar, TrendingUp, AlertCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type InsightData = { sections: any[] } | null

const LoadingSkeleton = () => (
  <div className="space-y-6">
    {[1, 2, 3].map((i) => (
      <Card key={i} className="overflow-hidden">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-border rounded-lg"></div>
              <div className="w-20 h-4 bg-border rounded"></div>
            </div>
            <div className="space-y-3">
              <div className="w-3/4 h-6 bg-border rounded"></div>
              <div className="w-full h-4 bg-border rounded"></div>
              <div className="w-5/6 h-4 bg-border rounded"></div>
            </div>
          </div>
        </div>
      </Card>
    ))}
  </div>
)

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center py-12"
  >
    <Card className="w-full max-w-md">
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-expense/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-expense" />
        </div>
        <h3 className="text-lg font-semibold text-ink mb-2">Failed to Generate Insights</h3>
        <p className="text-muted mb-6">We encountered an issue while processing your data. Please try again.</p>
        <Button onClick={onRetry} className="w-full">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    </Card>
  </motion.div>
)

const getMonthName = (month: number) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ]
  return months[month - 1]
}

export default function InsightsPage() {
  const [insights, setInsights] = useState<InsightData>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const today = new Date()
  const month = today.getMonth() + 1
  const year = today.getFullYear()

const fetchInsights = async () => {
  setLoading(true)
  setError(false)

  try {
    const token = localStorage.getItem("token")
    const user_id = await getUserFromauthToken(token ?? "")

    if (!user_id) {
      setError(true)
      return
    }

    const res = await fetch(`/api/insights?userId=${user_id}&month=${month}&year=${year}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) {
      console.error("Insights request failed:", res.status)
      setError(true)
      return
    }

    const { insights: dbinsightsData } = await res.json()

    if (!dbinsightsData) {
      setInsights(null)
      return
    }

    const prompt = await dbinsightsDataModifier(dbinsightsData)

    const genRes = await fetch("/api/insights/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    })

    if (!genRes.ok) {
      const errBody = await genRes.json().catch(() => ({}))
      console.error("Generate insights failed:", genRes.status, errBody.error)
      setError(true)
      return
    }

    const { insights: generated } = await genRes.json()

    setInsights(generated)
    setLastUpdated(new Date())
  } catch (err) {
    console.error("Failed to load insights:", err)
    setError(true)
  } finally {
    setLoading(false)
  }
}

  useEffect(() => {
    fetchInsights()
  }, [])

  return (
    <div>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-brand rounded-xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-brand">
                    AI Insights
                  </h1>
                  <p className="text-muted">Intelligent analysis of your data</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Card className="bg-surface/70 backdrop-blur-sm border-0 shadow-sm">
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-brand" />
                    <div>
                      <p className="text-sm font-medium text-ink">
                        {getMonthName(month)} {year}
                      </p>
                      <p className="text-xs text-muted">Current Period</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Button
                onClick={fetchInsights}
                disabled={loading}
                variant="outline"
                className="bg-surface/70 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>

          {lastUpdated && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6"
            >
              <Card className="bg-income/10 border-0">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-income" />
                      <span className="text-sm font-medium text-ink">Analysis Complete</span>
                    </div>
                    <span className="text-xs text-muted">
                      Last updated: {lastUpdated.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-lg font-medium text-ink">Generating insights...</span>
                </div>
                <div className="w-full bg-border rounded-full h-2 mb-6">
                  <div
                    className="bg-brand h-2 rounded-full animate-pulse"
                    style={{ width: "60%" }}
                  ></div>
                </div>
              </div>
              <LoadingSkeleton />
            </motion.div>
          )}

          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ErrorState onRetry={fetchInsights} />
            </motion.div>
          )}

          {!loading && !error && insights && (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <InsightRenderer data={insights} />
            </motion.div>
          )}

          {!loading && !error && !insights && (
            <motion.div
              key="no-data"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <Card className="w-full max-w-md">
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-canvas rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-muted" />
                  </div>
                  <h3 className="text-lg font-semibold text-ink mb-2">No Insights Available</h3>
                  <p className="text-muted mb-6">There's no data available for this period yet.</p>
                  <Button onClick={fetchInsights} variant="outline" className="w-full">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Check Again
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}