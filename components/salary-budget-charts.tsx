"use client"
import type React from "react"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"
import {Card,CardHeader,CardTitle,CardDescription,CardContent} from './ui/chartscomponent/chatselements'

Chart.register(...registerables)

interface DashboardData {
  monthlySalary: number
  totalBudget: number
  totalSpent: number
  monthlyData: Array<{
    month: string
    salary: number
    budget: number
    spent: number
  }>
  categorySpending: Array<{
    category: string
    amount: number
    color: string
  }>
  budgetCategories: Array<{
    name: string
    budget: number
    spent: number
    color: string
  }>
  financialGoals: Array<{
    name: string
    target: number
    current: number
  }>
  recentTransactions: Array<{
    description: string
    amount: number
    category: string
    date: string
    type: "income" | "expense"
    categoryColor: string
  }>
}

export default function SalaryBudgetCharts({ data }: { data: DashboardData }) {
  const salaryChartRef = useRef<HTMLCanvasElement>(null)
  const categoryChartRef = useRef<HTMLCanvasElement>(null)
  const trendChartRef = useRef<HTMLCanvasElement>(null)
  const salaryChartInstance = useRef<Chart | null>(null)
  const categoryChartInstance = useRef<Chart | null>(null)
  const trendChartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (salaryChartRef.current) {
      if (salaryChartInstance.current) {
        salaryChartInstance.current.destroy()
      }

      const ctx = salaryChartRef.current.getContext("2d")
      if (ctx) {
        salaryChartInstance.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: ["This Month"],
            datasets: [
              {
                label: "Salary",
                data: [data.monthlySalary],
                backgroundColor: "rgba(16, 185, 129, 0.8)",
                borderColor: "rgba(16, 185, 129, 1)",
                borderWidth: 2,
                borderRadius: 8,
              },
              {
                label: "Budget",
                data: [data.totalBudget],
                backgroundColor: "rgba(59, 130, 246, 0.8)",
                borderColor: "rgba(59, 130, 246, 1)",
                borderWidth: 2,
                borderRadius: 8,
              },
              {
                label: "Spent",
                data: [data.totalSpent],
                backgroundColor: "rgba(168, 85, 247, 0.8)",
                borderColor: "rgba(168, 85, 247, 1)",
                borderWidth: 2,
                borderRadius: 8,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: (value) => "₹" + Number(value).toLocaleString(),
                },
              },
            },
          },
        })
      }
    }

    // Category Spending Pie Chart
    if (categoryChartRef.current) {
      if (categoryChartInstance.current) {
        categoryChartInstance.current.destroy()
      }

      const ctx = categoryChartRef.current.getContext("2d")
      if (ctx) {
        categoryChartInstance.current = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: data.categorySpending.map((item) => item.category),
            datasets: [
              {
                data: data.categorySpending.map((item) => item.amount),
                backgroundColor: data.categorySpending.map((item) => item.color),
                borderWidth: 3,
                borderColor: "#ffffff",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
              },
              tooltip: {
                callbacks: {
                  label: (context) => context.label + ": ₹" + context.parsed.toLocaleString(),
                },
              },
            },
          },
        })
      }
    }

    // Monthly Trend Line Chart
    if (trendChartRef.current) {
      if (trendChartInstance.current) {
        trendChartInstance.current.destroy()
      }

      const ctx = trendChartRef.current.getContext("2d")
      if (ctx) {
        trendChartInstance.current = new Chart(ctx, {
          type: "line",
          data: {
            labels: data.monthlyData.map((item) => item.month),
            datasets: [
              {
                label: "Salary",
                data: data.monthlyData.map((item) => item.salary),
                borderColor: "rgba(16, 185, 129, 1)",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                borderWidth: 3,
                fill: true,
                tension: 0.4,
              },
              {
                label: "Budget",
                data: data.monthlyData.map((item) => item.budget),
                borderColor: "rgba(59, 130, 246, 1)",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                borderWidth: 3,
                fill: true,
                tension: 0.4,
              },
              {
                label: "Spent",
                data: data.monthlyData.map((item) => item.spent),
                borderColor: "rgba(168, 85, 247, 1)",
                backgroundColor: "rgba(168, 85, 247, 0.1)",
                borderWidth: 3,
                fill: true,
                tension: 0.4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: (value) => "₹" + Number(value).toLocaleString(),
                },
              },
            },
          },
        })
      }
    }
    return () => {
      if (salaryChartInstance.current) salaryChartInstance.current.destroy()
      if (categoryChartInstance.current) categoryChartInstance.current.destroy()
      if (trendChartInstance.current) trendChartInstance.current.destroy()
    }
  }, [data])

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Salary vs Budget vs Spending</CardTitle>
          <CardDescription>Current month financial overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <canvas ref={salaryChartRef}></canvas>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
          <CardDescription>Where your money goes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <canvas ref={categoryChartRef}></canvas>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>6-Month Financial Trend</CardTitle>
          <CardDescription>Track your financial progress over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <canvas ref={trendChartRef}></canvas>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
