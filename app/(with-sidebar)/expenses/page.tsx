"use client"

import React, { useState } from 'react';
import { Calendar, DollarSign, Tag, MapPin, FileText, Plus, Minus } from 'lucide-react';

export default function ExpenseTracker() {
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    subcategory: '',
    paymentMethod: '',
    description: '',
    location: '',
    tags: '',
    type: 'expense' // 'expense' or 'income'
  });

  const [recentExpenses] = useState([
    {
      id: 1,
      amount: 24.99,
      date: 'May 15, 2023',
      category: 'Food & Dining',
      subcategory: 'Restaurants',
      description: 'Lunch with colleagues',
      paymentMethod: 'Credit Card',
      type: 'expense'
    },
    {
      id: 2,
      amount: 35.50,
      date: 'May 14, 2023',
      category: 'Transportation',
      subcategory: 'Gas & Fuel',
      description: 'Gas station fill-up',
      paymentMethod: 'Debit Card',
      type: 'expense'
    },
    {
      id: 3,
      amount: 2500.00,
      date: 'May 13, 2023',
      category: 'Income',
      subcategory: 'Salary',
      description: 'Monthly salary',
      paymentMethod: 'Bank Transfer',
      type: 'income'
    },
    {
      id: 4,
      amount: 12.99,
      date: 'May 13, 2023',
      category: 'Entertainment',
      subcategory: 'Subscriptions',
      description: 'Monthly streaming service',
      paymentMethod: 'Digital Wallet',
      type: 'expense'
    }
  ]);

  const categories = [
    'Food & Dining',
    'Transportation',
    'Entertainment',
    'Shopping',
    'Bills & Utilities',
    'Healthcare',
    'Other'
  ];

  const subcategories = {
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
    const transactiontype = [
    'Income',
    'Expense',

  ];

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset subcategory when category changes
      ...(name === 'category' ? { subcategory: '' } : {})
    }));
  };

  const handleTypeChange = (type:any) => {
    setFormData(prev => ({
      ...prev,
      type,
      category: type === 'income' ? 'Income' : ''
    }));
  };

  const handleSubmit = () => {
    // Basic validation
    if (!formData.amount || !formData.date || !formData.category || !formData.paymentMethod) {
      alert('Please fill in all required fields');
      return;
    }

    console.log('Transaction submitted:', formData);
    // Here you would typically send the data to your API
    alert(`${formData.type === 'expense' ? 'Expense' : 'Income'} added successfully!`);

    // Reset form
    setFormData({
      amount: '',
      date: new Date().toISOString().split('T')[0],
      category: '',
      subcategory: '',
      paymentMethod: '',
      description: '',
      location: '',
      tags: '',
      type: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Personal Finance Tracker</h1>
            <div className="flex space-x-4">
              <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                Add Expense
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Analytics
              </button>
            </div>
          </div>
        </div>
      </div> */}

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
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    formData.type === 'expense'
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
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    formData.type === 'income'
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
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
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

                {/* Category and Subcategory */}
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
                      Subcategory
                    </label>
                    <select
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={!formData.category}
                    >
                      <option value="">Select a subcategory</option>
                      {formData.category && subcategories[formData.category]?.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 py-2">
                    Payment Method
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2 py-2">
                    Type of Transaction
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-fit px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Transaction Type</option>
                    {transactiontype.map(method => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
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
                  className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
                    formData.type === 'expense'
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
                {recentExpenses.map((expense) => (
                  <div key={expense.id} className="border-l-4 border-gray-200 pl-4 py-2">
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-lg font-semibold ${
                        expense.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {expense.type === 'income' ? '+' : '-'}${expense.amount}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {expense.paymentMethod}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{expense.date}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-600">{expense.category}</span>
                      <span className="text-xs text-gray-500">{expense.subcategory}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{expense.description}</p>
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