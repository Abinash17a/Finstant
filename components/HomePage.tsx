"use client"

import { useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { PlusIcon } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function ExpenseDashboard() {
  const [expenses, setExpenses] = useState({
    today: 532,
    week: 3284,
    month: 9710,
    year: 102476,
  });

  const recentTransactions = [
    { category: 'Food', detail: 'Lunch at cafe', amount: 350, date: 'May 27' },
    { category: 'Travel', detail: 'Uber ride', amount: 120, date: 'May 27' },
    { category: 'Shopping', detail: 'Clothing store', amount: 890, date: 'May 25' },
    { category: 'Bills', detail: 'Electricity bill', amount: 1200, date: 'May 28' },
    { category: 'Food', detail: 'Groceries', amount: 280, date: 'May 25' },
  ];

  const goals = [
    { title: 'Food Budget', amount: 6200, total: 10000 },
    { title: 'Travel Limit', amount: 1800, total: 3000 },
  ];

  const spendingData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Expenses',
        data: [500, 700, 400, 800, 1200, 300, 900],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div className="p-4 sm:p-6 max-w-screen-xl mx-auto ">
  {/* Header */}
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
    <div>
      <h1 className="text-lg sm:text-xl font-semibold">Expense Dashboard</h1>
      <p className="text-sm text-gray-500">Track your spending and manage your budget</p>
    </div>
    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
      <PlusIcon className="w-4 h-4 mr-2" />
      Add Expense
    </button>
  </div>

  {/* Expenses Overview */}
  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
    {Object.entries(expenses).map(([key, value]) => (
      <div key={key} className="bg-white shadow rounded p-4">
        <p className="capitalize text-sm">{key.replace(/([A-Z])/g, ' $1')}</p>
        <strong className="text-lg">₹{value}</strong>
      </div>
    ))}
  </div>

  {/* Charts */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
    <div className="bg-white shadow rounded p-4 min-w-0">
      <h2 className="text-md font-semibold mb-2">Spending Breakdown</h2>
      <Bar data={spendingData} />
    </div>
    <div className="bg-white shadow rounded p-4 min-w-0">
      <h2 className="text-md font-semibold mb-2">Weekly Spending Trend</h2>
      <Line data={spendingData} />
    </div>
  </div>

  {/* Recent Transactions & Goals */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
    {/* Recent Transactions */}
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-md font-semibold mb-2">Recent Transactions</h2>
      {recentTransactions.map((tx, i) => (
        <div key={i} className="flex justify-between border-b py-2 text-sm">
          <div>
            <p className="font-medium">{tx.category}</p>
            <p className="text-gray-500">{tx.detail}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">₹{tx.amount}</p>
            <p className="text-gray-400">{tx.date}</p>
          </div>
        </div>
      ))}
    </div>

    {/* Goals */}
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-md font-semibold mb-2">Goals & Reminders</h2>
      {goals.map((goal, i) => (
        <div key={i} className="mb-4">
          <div className="flex justify-between mb-1 text-sm">
            <span>{goal.title}</span>
            <span className="text-gray-500">₹{goal.amount} / ₹{goal.total}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-green-500 h-2.5 rounded-full"
              style={{ width: `${(goal.amount / goal.total) * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
      <button className="w-full mt-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition">
        Set New Goal
      </button>
    </div>
  </div>
</div>

  );
}
