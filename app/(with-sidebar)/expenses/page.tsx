"use client"

import React, { useEffect, useState } from 'react';
import { Calendar, DollarSign, Tag, MapPin, FileText, Plus, Minus } from 'lucide-react';
import { getUserFromauthToken } from '@/lib/utils';

export default function ExpenseTracker() {
  const [formData, setFormData] = useState({
    user_id: '', // make sure to set this (e.g. from session/user context)
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    sub_category: '',
    payment_method: '',
    description: '',
    location: '',
    tags: '',
    type: 'expense', // 'expense' or 'income'
  });

const getRecentTransactions = async () => {
  try {
    const token = localStorage.getItem('token');
    const user_id = await getUserFromauthToken(token ?? '');

    if (!user_id) {
      alert('User not authenticated');
      return;
    }

    const limit = 5;

    const res = await fetch(`/api/gettransactions?user_id=${user_id}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await res.json();

    if (res.ok) {
      console.log(JSON.stringify(result.transactions), "result in getRecentTransactions");
      setrecentTransactions(result.transactions);
      console.log('Transaction fetched successfully!');
    } else {
      alert(`Error: ${result.error}`);
    }
  } catch (error) {
    console.error('Error fetching recent transactions:', error);
  }
};



  const [recentTransactions, setrecentTransactions] = useState([{}] as any[])

  useEffect(() => {
    getRecentTransactions();
  }, [])

  const categories = [
    'Food & Dining',
    'Transportation',
    'Entertainment',
    'Shopping',
    'Bills & Utilities',
    'Healthcare',
    'Other'
  ];
  const categoryMap: Record<string, string> = {
    'Food & Dining': 'FOOD_DINING',
    'Transportation': 'TRANSPORTATION',
    'Shopping': 'SHOPPING',
    'Entertainment': 'ENTERTAINMENT',
    'Bills & Utilities': 'BILLS_UTILITIES',
    'Healthcare': 'HEALTHCARE',
    'Income': 'SALARY',
    'Other': 'OTHER',
  };

  const subcategories: { [key: string]: string[] } = {
    'Food & Dining': ['Restaurants', 'Groceries', 'Fast Food', 'Coffee'],
    'Transportation': ['Gas & Fuel', 'Public Transit', 'Parking', 'Maintenance'],
    'Entertainment': ['Movies', 'Subscriptions', 'Games', 'Events'],
    'Shopping': ['Clothing', 'Electronics', 'Home & Garden', 'Books'],
    'Bills & Utilities': ['Electricity', 'Water', 'Internet', 'Phone'],
    'Healthcare': ['Doctor', 'Medicine', 'Insurance', 'Dental'],
    'Income': ['Salary', 'Freelance', 'Investment', 'Other'],
    'Other': ['Miscellaneous']
  };

  const paymentMethods = [
    'Credit Card',
    'Debit Card',
    'Cash',
    'Digital Wallet',
    'Bank Transfer',
    'Check',
    'UPI'
  ];

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset sub_category when category changes
      ...(name === 'category' ? { sub_category: '' } : {})
    }));
  };

  const handleTypeChange = (type: any) => {
    setFormData(prev => ({
      ...prev,
      type,
      category: type === 'income' ? 'Income' : ''
    }));
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const user_id = await getUserFromauthToken(token ?? '');

      if (!user_id) {
        alert('User not authenticated');
        return;
      }

      const mappedCategory = categoryMap[formData.category] ?? 'OTHER';

      const dataToSend = {
        ...formData,
        user_id,
        category: mappedCategory, // enum-safe value for db insertion
      };

      const res = await fetch('/api/expense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await res.json();

      if (res.ok) {
        console.log('Transaction created successfully!');
        getRecentTransactions();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Something went wrong. Please try again.');
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Expense Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center mb-6">
                <DollarSign className="h-6 w-6 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Add New Transaction</h2>
              </div>

              <p className="text-gray-600 mb-6">Enter the details of your transaction to track and analyze your spending</p>

              {/* Transaction Type Toggle */}
              <div className="flex mb-6 p-1 bg-gray-100 rounded-lg w-fit">
                <button
                  type="button"
                  onClick={() => handleTypeChange('expense')}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${formData.type === 'expense'
                    ? 'bg-red-500 text-white shadow-sm'
                    : 'text-gray-700 hover:text-gray-900'
                    }`}
                >
                  <Minus className="h-4 w-4 mr-2" />
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange('income')}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${formData.type === 'income'
                    ? 'bg-green-500 text-white shadow-sm'
                    : 'text-gray-700 hover:text-gray-900'
                    }`}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Income
                </button>
              </div>

              <div className="space-y-6">
                {/* Amount and Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount
                    </label>
                    <div className="relative">
                      {/* <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span> */}
                      <input
                        type="number"
                        name="amount"
                        step="0.01"
                        value={formData.amount}
                        onChange={handleInputChange}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Category and sub_category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sub Category
                    </label>
                    <select
                      name="sub_category"
                      value={formData.sub_category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={!formData.category}
                    >
                      <option value="">Select a sub_category</option>
                      {formData.category && subcategories[formData.category]?.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 pt-4">
                    Payment Method
                  </label>
                  <select
                    name="payment_method"
                    value={formData.payment_method}
                    onChange={handleInputChange}
                    className="w-fit px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select payment method</option>
                    {paymentMethods.map(method => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                  <div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Add notes about this transaction"
                    />
                  </div>
                </div>

                {/* Location and Tags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location (Optional)
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Where did you spend this?"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags (Optional)
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Comma separated tags"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Separate multiple tags with commas</p>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${formData.type === 'expense'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'
                    }`}
                >
                  Add {formData.type === 'expense' ? 'Expense' : 'Income'}
                </button>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
              <p className="text-sm text-gray-600 mb-6">Your most recently added transactions</p>

              <div className="space-y-4">
                {recentTransactions?.map((Transaction) => (
                  <div key={Transaction.id} className="border-l-4 border-gray-200 pl-4 py-2">
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-lg font-semibold ${Transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {Transaction.type === 'INCOME' ? '+' : '-'}${Transaction.amount}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {Transaction.payment_Method}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{Transaction.date}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-600">{Transaction.category}</span>
                      <span className="text-xs text-gray-500">{Transaction.sub_category}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{Transaction.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}