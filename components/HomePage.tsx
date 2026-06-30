"use client"
import type React from "react"
import { Suspense, useEffect, useState } from "react"
import { Wallet, TrendingUp, Target, DollarSign, PlusCircle, Calendar, IndianRupee, CheckCircle2, AlertTriangle } from "lucide-react"
import SalaryBudgetCharts from "./salary-budget-charts"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/chartscomponent/chatselements'
import Link from "next/link"
import { formatWord, generateLastMonthSummary, getMonthlySummaryData, getUserFromauthToken } from "../lib/utils"
import GoalModal from "./GoalModal"
import { cn } from "@/lib/utils"
import LoadingScreen from "./LoadingScreen"

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
    default: "bg-brand text-white hover:bg-brand-hover focus:ring-brand",
    outline: "border border-border bg-surface text-ink hover:bg-canvas focus:ring-muted",
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
    secondary: "bg-canvas text-muted",
    destructive: "bg-expense/10 text-expense",
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
  color,
  className = "",
}: {
  value: number
  color?: string
  className?: string
}) => (
  <div className={`w-full bg-border rounded-full overflow-hidden ${className}`}>
    <div
      className="h-full rounded-full transition-all duration-300 ease-out"
      style={{
        width: `${Math.min(100, Math.max(0, value))}%`,
        backgroundColor: color || "var(--color-brand)",
      }}
    />
  </div>
)

const PRESET_COLORS = [
  "#0F6657", // brand teal
  "#E8A33D", // accent gold
  "#1B8A5A", // income green
  "#D6435B", // expense red
  "#4C8FB8", // transport blue
  "#8C7AE0", // entertainment violet
  "#E07856", // food coral
  "#2FA39A", // bills teal
  "#D1638E", // healthcare rose
  "#D88A1F", // warning amber
  "#8A94A3", // muted slate
  "#6366F1", // indigo (extra)
]

const getMonthName = (month: number) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ]
  return months[month - 1]
}

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
  const [monthlyLimit, setMonthlyLimit] = useState<number>(0);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [modalCategories, setModalCategories] = useState<any[]>([]);

  const [showGoalModal, setShowGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any>(null);

  const fetchProfileLimit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch("/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const profileData = await res.json();
        setMonthlyLimit(Number(profileData.monthly_budget || 0));
      }
    } catch (error) {
      console.error("Failed to fetch profile monthly budget limit:", error);
    }
  };

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
      setmonthlyData(monthdata);
      if (!res.ok) {
        console.error('Failed to generate summary:', monthdata?.error);
      }
    } catch (error) {
      console.error('Error calling summary API:', error);
    }
  };

  const saveGoal = async (goalData: any) => {
    const token = localStorage.getItem("token");

    const payload = {
      id: editingGoal?.id ?? null,
      name: goalData.name,
      target: goalData.target,
      current: goalData.current,
    };

    const response = await fetch("/api/financial-goals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to save goal");
    }

    setEditingGoal(null);
    setShowGoalModal(false);

    await fetchDashboardData();
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
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await res.json();

      if (res.ok) {
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
    getbudgetcategories();
    generateSummary();
    fetchProfileLimit();
  }, []);

  useEffect(() => {
    generateSummary();
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
    if (
      advice &&
      advice !== 'No advice available.' &&
      advice !== 'No tip found.'
    ) {
      setShowAdvice(false);
      const timer = setTimeout(() => setShowAdvice(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [advice]);

  const handleBudgetChange = (index: number, value: number) => {
    const updated = [...categories];
    updated[index].budget = value;
    setCategories(updated);
  };

  if (loading) return <LoadingScreen />;
  if (!data) return <p className="p-6 text-muted">No data available</p>;

  // --- Plain-language pacing status, computed from data already on hand ---
  const dayOfMonth = today.getDate();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const daysRemaining = daysInMonth - dayOfMonth;
  const monthProgressPct = (dayOfMonth / daysInMonth) * 100;
  const spendProgressPct = data.totalBudget > 0 ? (data.totalSpent / data.totalBudget) * 100 : 0;
  const isAhead = spendProgressPct <= monthProgressPct;

  const statusMessage = isAhead
    ? `You're on track — you've used ${spendProgressPct.toFixed(0)}% of your budget with ${daysRemaining} day${daysRemaining === 1 ? "" : "s"} left in ${getMonthName(today.getMonth() + 1)}.`
    : `Heads up — you've used ${spendProgressPct.toFixed(0)}% of your budget, but only ${monthProgressPct.toFixed(0)}% of the month has passed.`;

  // Spent card color reflects actual pacing risk instead of being fixed red
  const spentCardColor = !isAhead
    ? "bg-expense"
    : spendProgressPct > 70
    ? "bg-warning"
    : "bg-brand";

  return (
    <div className="p-6">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-ink">Financial Dashboard</h1>
            <p className="text-muted mt-1">Track your salary, budget, and financial goals</p>
          </div>
          <div className="flex gap-3">
            <Link href="/expenses">
              <Button className="bg-income hover:brightness-95 text-white">
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

        {/* Plain-language status banner */}
        <div
          className={cn(
            "flex items-center gap-3 p-4 rounded-2xl border text-sm font-medium",
            isAhead
              ? "bg-income/10 border-income/30 text-income"
              : "bg-warning/10 border-warning/30 text-warning"
          )}
        >
          {isAhead ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 shrink-0" />
          )}
          <span>{statusMessage}</span>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-income text-white border-0">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">Monthly Salary</CardTitle>
                <Wallet className="w-5 h-5 opacity-80" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{data.monthlySalary?.toLocaleString()}</div>
              <p className="text-xs opacity-80 mt-1">+5.2% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-brand text-white border-0">
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

          <Card className={cn(spentCardColor, "text-white border-0")}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">Spent This Month</CardTitle>
                <TrendingUp className="w-5 h-5 opacity-80" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{data.totalSpent.toLocaleString()}</div>
              <p className="text-xs opacity-80 mt-1">
                {spendProgressPct.toFixed(1)}% of budget · {isAhead ? "On pace" : "Ahead of pace"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-accent text-white border-0">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">Remaining</CardTitle>
                <IndianRupee className="w-5 h-5 opacity-80" />
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
          <Suspense fallback={<div className="h-96 bg-surface rounded-lg animate-pulse" />}>
            <SalaryBudgetCharts data={{ ...data, monthlyData }} />
          </Suspense>
        </div>

        {/* Budget Categories & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-xl">Budget Categories</CardTitle>
              <CardDescription>
                {isEditing ? "Adjust budget and save your changes" : "Adjust budget manually if needed"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(() => {
                const totalAllocated = categories.reduce((sum, c) => sum + Number(c.budget || 0), 0);
                const overBudget = totalAllocated > data.totalBudget;
                return (
                  <div
                    className={cn(
                      "flex justify-between items-center p-3 rounded-xl text-sm border",
                      overBudget
                        ? "bg-expense/10 border-expense/30 text-expense"
                        : "bg-canvas border-border text-muted"
                    )}
                  >
                    <span className="font-medium">
                      {overBudget ? "Over budget by" : "Total allocated"}
                    </span>
                    <span className="font-semibold">
                      ₹{totalAllocated.toLocaleString()} of ₹{data.totalBudget.toLocaleString()}
                      {overBudget && ` (+₹${(totalAllocated - data.totalBudget).toLocaleString()})`}
                    </span>
                  </div>
                );
              })()}
              {categories?.map((category: any, index: number) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: category.color || '#0F6657' }}></div>
                      <span className="font-medium text-ink">{category.name}</span>
                      <Badge variant={category.spent > category.budget ? "destructive" : "secondary"}>
                        {category.spent > category.budget ? "Over Budget" : "On Track"}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-ink">₹{category.spent.toLocaleString()}</div>
                      <div className="text-sm text-muted">of ₹{category.budget.toLocaleString()}</div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-muted">Adjust Budget</label>
                    <input
                      type="range"
                      min={category.spent}
                      max={100000}
                      value={category.budget}
                      disabled={!isEditing}
                      onChange={(e) => handleBudgetChange(index, Number(e.target.value))}
                      className="w-full disabled:opacity-50 disabled:cursor-not-allowed accent-brand"
                    />
                    <Progress
                      value={(category.spent / category.budget) * 100}
                      color={category.color || '#0F6657'}
                      className="h-2 mt-1"
                    />
                  </div>
                </div>
              ))}

              <div className="flex flex-wrap gap-3">
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
                <Button
                  variant="outline"
                  onClick={() => {
                    setModalCategories(categories.map(c => ({
                      name: c.name,
                      budget: Number(c.budget),
                      color: c.color || '#0F6657'
                    })));
                    setIsManageModalOpen(true);
                  }}
                >
                  Manage Categories
                </Button>
              </div>
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
                    <span className="font-medium text-sm text-ink">
                      {goal.name}
                    </span>

                    <button
                      onClick={() => {
                        setEditingGoal(goal);
                        setShowGoalModal(true);
                      }}
                      className="text-xs text-brand hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <Progress value={(goal.current / goal.target) * 100} color="#E8A33D" className="h-2" />
                  <div className="flex justify-between text-xs text-muted">
                    <span>₹{goal.current.toLocaleString()}</span>
                    <span>₹{goal.target.toLocaleString()}</span>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => {
                  setEditingGoal(null);
                  setShowGoalModal(true);
                }}
              >
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
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {data.recentTransactions.map((transaction: any, index: number) => {
        const isIncome = transaction.type === "income";
        const txDate = new Date(transaction.date);
        const formattedDate = isNaN(txDate.getTime())
          ? transaction.date
          : txDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

        return (
          <div
            key={transaction.id ?? index}
            className="group relative flex flex-col gap-3 p-4 bg-surface border border-border rounded-2xl hover:shadow-md hover:border-muted/40 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold text-sm shrink-0"
                style={{ backgroundColor: transaction.categoryColor || "#8A94A3" }}
              >
                {transaction.category?.charAt(0)}
              </div>
              <div
                className={cn(
                  "font-semibold text-sm px-2 py-1 rounded-lg",
                  isIncome ? "bg-income/10 text-income" : "bg-expense/10 text-expense"
                )}
              >
                {isIncome ? "+" : "-"}₹{transaction.amount.toLocaleString()}
              </div>
            </div>

            <div>
              <div className="font-medium text-ink truncate">
                {transaction.description || formatWord(transaction.category)}
              </div>
              <div className="text-sm text-muted mt-0.5">
                {formatWord(transaction.category)} · {formattedDate}
              </div>
            </div>
          </div>
        );
      })}
    </div>

    {data.recentTransactions.length === 0 && (
      <div className="text-center py-8 text-muted text-sm">
        No transactions yet — your activity will show up here.
      </div>
    )}
  </CardContent>
</Card>
      </div>

      {/* Floating Financial Tip */}
      {showAdvice && (
        <div className="fixed bottom-6 left-6 z-50 max-w-sm p-4 rounded-2xl shadow-lg bg-brand text-white animate-fadeIn">
          <h4 className="text-sm font-semibold mb-1 uppercase tracking-wider">💡 Financial Tip</h4>
          <p className="text-sm leading-relaxed">{advice}</p>
        </div>
      )}

      {/* Manage Categories Modal */}
      {isManageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-surface rounded-2xl shadow-2xl border border-border max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden transition-all transform scale-100 duration-300">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-ink">Manage Budget Categories</h3>
                <p className="text-sm text-muted mt-1">
                  Configure your categories and allocated budgets (Max 12).
                </p>
              </div>
              <button
                onClick={() => setIsManageModalOpen(false)}
                className="text-muted hover:text-ink hover:bg-canvas p-2 rounded-full transition-colors text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="flex justify-between items-center bg-canvas p-4 rounded-xl text-sm text-ink">
                <div>
                  <span className="font-semibold text-ink">Total Allocated:</span>{" "}
                  ₹{modalCategories.reduce((sum, c) => sum + (Number(c.budget) || 0), 0).toLocaleString()}
                </div>
                <div>
                  <span className="font-semibold text-ink">Monthly Limit:</span>{" "}
                  ₹{monthlyLimit.toLocaleString()}
                </div>
              </div>

              <div className="space-y-3">
                {modalCategories.map((cat, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 bg-canvas/60 rounded-xl border border-border">
                    <div className="flex-1 flex gap-3 items-center">
                      <div className="relative group">
                        <button
                          type="button"
                          className="w-8 h-8 rounded-full border border-surface shadow-sm flex items-center justify-center text-white text-xs font-semibold cursor-pointer hover:scale-105 active:scale-95 transition-all"
                          style={{ backgroundColor: cat.color || '#0F6657' }}
                          title="Click to select color"
                        >
                          🎨
                        </button>
                        <div className="hidden group-hover:flex absolute left-0 top-9 bg-surface border border-border shadow-xl rounded-xl p-2.5 z-[60] grid grid-cols-4 gap-2 w-44">
                          {PRESET_COLORS.map((color) => (
                            <button
                              key={color}
                              type="button"
                              className="w-7 h-7 rounded-full hover:scale-110 active:scale-95 transition-all"
                              style={{ backgroundColor: color }}
                              onClick={() => {
                                const updated = [...modalCategories];
                                updated[idx].color = color;
                                setModalCategories(updated);
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      <input
                        type="text"
                        placeholder="Category Name (e.g. FOOD_DINING)"
                        value={cat.name || ""}
                        className="flex-1 px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/30 text-ink"
                        onChange={(e) => {
                          const updated = [...modalCategories];
                          updated[idx].name = e.target.value;
                          setModalCategories(updated);
                        }}
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative flex-1 sm:w-36">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">₹</span>
                        <input
                          type="number"
                          placeholder="0"
                          value={cat.budget === 0 ? "" : cat.budget}
                          className="w-full pl-7 pr-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/30 text-ink"
                          onChange={(e) => {
                            const updated = [...modalCategories];
                            updated[idx].budget = Number(e.target.value);
                            setModalCategories(updated);
                          }}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const updated = modalCategories.filter((_, i) => i !== idx);
                          setModalCategories(updated);
                        }}
                        className="text-expense hover:bg-expense/10 p-2 rounded-lg transition-colors"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {modalCategories.length < 12 ? (
                <button
                  type="button"
                  onClick={() => {
                    const nextColor = PRESET_COLORS[modalCategories.length % PRESET_COLORS.length];
                    setModalCategories([
                      ...modalCategories,
                      { name: "", budget: 0, color: nextColor }
                    ]);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-border hover:border-muted text-muted hover:text-ink rounded-xl transition-all font-medium text-sm"
                >
                  ➕ Add Category
                </button>
              ) : (
                <p className="text-center text-xs text-warning font-medium">
                  Maximum limit of 12 categories reached.
                </p>
              )}
            </div>

            <div className="p-6 border-t border-border bg-canvas/60 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsManageModalOpen(false)}
                className="px-4 py-2 border border-border text-ink font-medium rounded-lg hover:bg-canvas transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const total = modalCategories.reduce((sum, c) => sum + (Number(c.budget) || 0), 0);
                  if (total > monthlyLimit) {
                    alert(`Total allocated budget (₹${total.toLocaleString()}) exceeds your monthly limit (₹${monthlyLimit.toLocaleString()})! Please adjust your allocations or increase your monthly limit in your Profile.`);
                    return;
                  }

                  const nameMap = new Set();
                  for (const cat of modalCategories) {
                    const trimmedName = cat.name?.trim();
                    if (!trimmedName) {
                      alert("Category names cannot be empty!");
                      return;
                    }
                    if (nameMap.has(trimmedName.toUpperCase())) {
                      alert(`Duplicate category name detected: "${trimmedName}". Names must be unique.`);
                      return;
                    }
                    nameMap.add(trimmedName.toUpperCase());

                    if (cat.budget <= 0) {
                      alert(`Allocation for category "${trimmedName}" must be a positive number!`);
                      return;
                    }
                  }

                  const token = localStorage.getItem('token');
                  if (!token) {
                    alert('User not authenticated');
                    return;
                  }

                  try {
                    const res = await fetch('/api/updateBudget', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        categories: modalCategories,
                        month: curmonth,
                        year: curyear
                      }),
                    });

                    if (!res.ok) {
                      alert('Failed to save categories');
                    } else {
                      alert('Categories updated successfully!');
                      setIsManageModalOpen(false);
                      getbudgetcategories();
                      fetchDashboardData();
                    }
                  } catch (error) {
                    console.error('Error saving categories:', error);
                    alert('An error occurred while saving.');
                  }
                }}
                className="px-4 py-2 bg-brand text-white font-medium rounded-lg hover:bg-brand-hover transition-colors text-sm shadow-sm"
              >
                Save Categories
              </button>
            </div>
          </div>
        </div>
      )}
      <GoalModal
        isOpen={showGoalModal}
        editingGoal={editingGoal}
        onClose={() => setShowGoalModal(false)}
        onSave={async (goalData) => {
          await saveGoal(goalData);
        }}
      />
    </div>
  )
}