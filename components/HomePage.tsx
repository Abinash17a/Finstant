"use client"
import type React from "react"
import { Suspense, useEffect, useState } from "react"
import { Wallet, TrendingUp, Target, DollarSign, PlusCircle, Calendar } from "lucide-react"
import SalaryBudgetCharts from "./salary-budget-charts"
// import { getDashboardData } from "./actions"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/chartscomponent/chatselements'
import Link from "next/link"
import { formatWord, generateLastMonthSummary, getMonthlySummaryData, getUserFromauthToken } from "../lib/utils"
import { Playwrite_BE_VLG } from "next/font/google"
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

  const today = new Date();

  const [data, setData] = useState<any>([{}]);
  const [loading, setLoading] = useState(true);
  const [advice, setAdvice] = useState<string>("");
  const [showAdvice, setShowAdvice] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [curmonth, setCMonth] = useState(today.getMonth() + 1);
  const [curyear, setCurYear] = useState(today.getFullYear());
  const [monthlyData, setmonthlyData] = useState<any[]>([]);

  const getbudgetcategories = async () => {
    const token = localStorage.getItem('token');
    const user_id = await getUserFromauthToken(token ?? '');

    const res = await fetch(`/api/budget?userId=${user_id}&month=${curmonth}&year=${curyear}`);
    const budgetCategories = await res.json();

    const parsed = budgetCategories.map((item: any) => ({
      ...item,
      budget: Number(item.budget),
      spent: Number(item.spent)
    }));

    setCategories(parsed);
  };

  const generateSummary = async () => {
    const token = localStorage.getItem('token');
    const userId = await getUserFromauthToken(token ?? '');
    try {
      const res = await fetch(`/api/monthlybugetsummary?userId=${userId}`, {
        method: 'POST',
      });

      const monthdata = await res.json();
      console.log("monthdata in generateSummary", monthdata)
      setmonthlyData(monthdata);
      if (!res.ok) {
        console.error('Failed to generate summary:', data.error);
      } else {
        console.log('Summary data:', data);
      }
    } catch (error) {
      console.error('Error calling summary API:', error);
    }
  };




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

  const getAdvice = async () => {
    const randomSuffix = Math.floor(Math.random() * 10000);
    const prompt = `<s>[INST] A user spent ₹18500 this month, has a budget of ₹20000, top category is Dining, and spending increased by 18%. Give a fun 2-sentence summary and a playful saving tip. Ignore this: ${randomSuffix} [/INST]`;
    const res = await fetch('/api/huggingface', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: prompt,
      })
    });


    const data = await res.json();
    console.log("data in getAdvice", data)
    setAdvice(data.advice);
  };

  useEffect(() => {
    fetchDashboardData();
    // getAdvice();
    getbudgetcategories();
    generateSummary();

  }, []);
  useEffect(() => {
    // getAdvice();
    generateSummary();
     console.log("Updated dashboard data:", data);
console.log("total budget",data.totalBudget);
  }, [data]);

const saveChanges = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('User not authenticated');
    return;
  }

  const totalCategoryBudget = categories.reduce((sum, cat) => sum + Number(cat.budget || 0), 0);

  if (totalCategoryBudget > data.totalBudget) {
    alert(`Total category budgets exceed your allowed budget of ₹${data.totalBudget}`);
    return;
  }

  try {
    const res = await fetch('/api/updateBudget', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ categories }),
    });

    console.log("categories in saveChanges", categories[0].budget);

    if (!res.ok) {
      alert('Failed to save changes');
    } else {
      alert('Budget updated successfully');
    }
  } catch (error) {
    console.error('Error updating budget:', error);
    alert('An error occurred while saving');
  }
};



  useEffect(() => {
    console.log(advice, "advice in useEffect")
    if (
      advice &&
      advice !== 'No advice available.' &&
      advice !== 'No tip found.'
    ) {
      setShowAdvice(false);

      // Auto-hide after 10 seconds
      const timer = setTimeout(() => setShowAdvice(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [advice]);

  const handleBudgetChange = (index: number, value: number) => {
    const updated = [...categories];
    updated[index].budget = value;
    setCategories(updated);
  };



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
           <SalaryBudgetCharts data={{ ...data, monthlyData }} />
          </Suspense>
        </div>

        {/* Budget Categories & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Budget Categories */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-xl">Budget Categories</CardTitle>
              <CardDescription>
                {isEditing ? "Adjust budget and save your changes" : "Adjust budget manually if needed"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {categories?.map((category: any, index: number) => (
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

                  {/* Budget Slider */}
                  <div>
                    <label className="text-sm text-slate-600">Adjust Budget</label>
                    <input
                      type="range"
                      min={category.spent}
                      max={100000}
                      value={category.budget}
                      disabled={!isEditing}
                      onChange={(e) => handleBudgetChange(index, Number(e.target.value))}
                      className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <Progress value={(category.spent / category.budget) * 100} className="h-2 mt-1" />
                  </div>
                </div>
              ))}


              <Button
                onClick={() => {
                  if (isEditing) {
                    saveChanges();
                  }
                  setIsEditing(!isEditing);
                }}
              >
                {isEditing ? "Save Changes" : "Change Budget"}
              </Button>
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
      {/* Floating Financial Tip */}
      {showAdvice && (
        <div className="fixed bottom-6 left-6 z-50 max-w-sm p-4 rounded-2xl shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-700 text-white animate-fadeIn">
          <h4 className="text-sm font-semibold mb-1 uppercase tracking-wider">💡 Financial Tip</h4>
          <p className="text-sm leading-relaxed">{advice}</p>
        </div>
      )}
    </div>
  )
}
