"use client"
import type React from "react"
import { Suspense, useEffect, useState } from "react"
import { Wallet, TrendingUp, Target, DollarSign, PlusCircle, Calendar } from "lucide-react"
import SalaryBudgetCharts from "./salary-budget-charts"
// import { getDashboardData } from "./actions"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/chartscomponent/chatselements'
import Link from "next/link"
import { formatWord, getUserFromauthToken } from "@/lib/utils"
const Button = ({
  children,
  className = "",
  variant = "default",
  ...props
}: {
  children: React.ReactNode
  className?: string
  variant?: "default" | "outline"
  [key: string]: any
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
  const variantClasses = {
    default: "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-500",
    outline: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-500",
  }

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

const Badge = ({
  children,
  className = "",
  variant = "secondary",
}: {
  children: React.ReactNode
  className?: string
  variant?: "secondary" | "destructive"
}) => {
  const variantClasses = {
    secondary: "bg-slate-100 text-slate-800",
    destructive: "bg-red-100 text-red-800",
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  )
}

const Progress = ({
  value,
  className = "",
}: {
  value: number
  className?: string
}) => (
  <div className={`w-full bg-slate-200 rounded-full overflow-hidden ${className}`}>
    <div
      className="bg-slate-900 h-full rounded-full transition-all duration-300 ease-out"
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
)

export default function DashboardPage() {

  const [data, setData] = useState<any>([{}]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const user_id = await getUserFromauthToken(token ?? '');

      if (!user_id) {
        alert('User not authenticated');
        return;
      }

      const limit = 5;

      const res = await fetch(`/api/dashboard?userId=${user_id}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await res.json();

      if (res.ok) {
        console.log('Dashboard data:', result);
        setData(result);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>No data available</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Financial Dashboard</h1>
            <p className="text-slate-600 mt-1">Track your salary, budget, and financial goals</p>
          </div>
          <div className="flex gap-3">
            <Link href="/expenses">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" href="/expenses">
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Transaction
              </Button>
            </Link>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              This Month
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">Monthly Salary</CardTitle>
                <Wallet className="w-5 h-5 opacity-80" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{data.monthlySalary.toLocaleString()}</div>
              <p className="text-xs opacity-80 mt-1">+5.2% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">Total Budget</CardTitle>
                <Target className="w-5 h-5 opacity-80" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{data.totalBudget.toLocaleString()}</div>
              <p className="text-xs opacity-80 mt-1">Allocated for this month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">Spent This Month</CardTitle>
                <TrendingUp className="w-5 h-5 opacity-80" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{data.totalSpent.toLocaleString()}</div>
              <p className="text-xs opacity-80 mt-1">
                {((data.totalSpent / data.totalBudget) * 100).toFixed(1)}% of budget
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">Remaining</CardTitle>
                <DollarSign className="w-5 h-5 opacity-80" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{(data.totalBudget - data.totalSpent).toLocaleString()}</div>
              <p className="text-xs opacity-80 mt-1">Available to spend</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Suspense fallback={<div className="h-96 bg-white rounded-lg animate-pulse" />}>
            <SalaryBudgetCharts data={data} />
          </Suspense>
        </div>

        {/* Budget Categories & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Budget Categories */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-xl">Budget Categories</CardTitle>
              <CardDescription>Track spending across different categories</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.budgetCategories.map((category: any, index: number) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                      <span className="font-medium">{category.name}</span>
                      <Badge variant={category.spent > category.budget ? "destructive" : "secondary"}>
                        {category.spent > category.budget ? "Over Budget" : "On Track"}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">₹{category.spent.toLocaleString()}</div>
                      <div className="text-sm text-slate-500">of ₹{category.budget.toLocaleString()}</div>
                    </div>
                  </div>
                  <Progress value={(category.spent / category.budget) * 100} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Financial Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Financial Goals</CardTitle>
              <CardDescription>Your savings and investment targets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.financialGoals.map((goal: any, index: number) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">{goal.name}</span>
                    <span className="text-sm text-slate-600">{((goal.current / goal.target) * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>₹{goal.current.toLocaleString()}</span>
                    <span>₹{goal.target.toLocaleString()}</span>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4">
                <Target className="w-4 h-4 mr-2" />
                Set New Goal
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Recent Transactions</CardTitle>
            <CardDescription>Your latest financial activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentTransactions.map((transaction: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full ${transaction.categoryColor} flex items-center justify-center text-white font-semibold text-sm`}
                    >
                      {transaction.category.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{transaction.description}</div>
                      <div className="text-sm text-slate-500">
                        {formatWord(transaction.category)} • {transaction.date}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`font-semibold ${transaction.type === "income" ? "text-emerald-600" : "text-red-600"}`}
                  >
                    {transaction.type === "income" ? "+" : "-"}₹{transaction.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
