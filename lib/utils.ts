import { type ClassValue, clsx } from "clsx"

import { twMerge } from "tailwind-merge"

import jwt from 'jsonwebtoken'

import axios from 'axios';

import { prisma } from "./prisma";

// import { prisma } from "@/lib/prisma";

import dayjs from "dayjs";

// import { Section } from "@/components/InsightRenderer";











const SECRET = process.env.JWT_SECRET || 'your-secret-key'



export function cn(...inputs: ClassValue[]) {

  return twMerge(clsx(inputs))

}







export function getUserFromToken(req: any) {

  const authHeader = req.headers.get('authorization')

  if (!authHeader) return null

  console.log(authHeader, "authHeader in getUserFromToken")

  const token = authHeader.split(' ')[1]

  console.log("token in getUserFromToken", token)

  try {

    const payload = jwt.verify(token, SECRET) as { userId: string }

    console.log("payload in getUserFromToken", payload)

    return payload.userId

  } catch (err) {

    return null

  }

}



export const getUserFromauthToken = async (token: string) => {

  if (!token) return null

  const decoded = jwt.decode(token);

  if (decoded === null) {

    throw new Error("Invalid token format");

  }

  try {

    // const payload = jwt.verify(token, SECRET) as { userId: string }

    const decoded = jwt.decode(token);

    if (decoded && typeof decoded === 'object' && 'userId' in decoded) {

      return (decoded as { userId: string }).userId;

    }

    return null;

  } catch (err) {

    console.log("error occured in getUserFromauthToken", err)

    return null

  }

}



export function formatWord(input: any) {

  return input

    ?.toLowerCase()

    .split('_')

    .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))

    .join(' ');

}


export async function extractSavingTip(advice: string) {

  console.log(advice, "advice in extractSavingTip")

  const firstQuoteIndex = advice.indexOf('"');

  if (firstQuoteIndex === -1) return 'No tip found.';



  const actualAdvice = advice.slice(firstQuoteIndex + 1).trim();

  const sentences = actualAdvice.split(/[.!?]\s+/);

  if (sentences.length < 2) return 'No tip found.';



  return sentences.slice(1).join('. ') + '.';

}

// Define proper types for budget categories with spent amounts
interface BudgetCategoryWithSpent {
  id: number;
  user_id: string;
  name: string;
  budget: number;
  color: string;
  month: number;
  year: number;
  created_at: Date;
  spent: number;
}

export async function getBudgetCategoriesWithSpent(userId: string, month: number, year: number): Promise<BudgetCategoryWithSpent[]> {

  console.log('🔍 getBudgetCategoriesWithSpent called with:', { userId, month, year });

  // Step 1: Check if categories exist for this month

  const existing = await prisma.budget_cat_allocations.findMany({

    where: { user_id: userId, month, year },

  });

  console.log('📊 Existing budget categories for month:', existing.length, existing);



  // Step 2: If not, clone from the most recent previous month

  if (existing.length === 0) {

    const latest = await prisma.budget_cat_allocations.findFirst({

      where: { user_id: userId },

      orderBy: [{ year: 'desc' }, { month: 'desc' }],

    });

    if (latest) {

      const previousMonthData = await prisma.budget_cat_allocations.findMany({

        where: { user_id: userId, month: latest.month, year: latest.year },

      });

      if (previousMonthData.length > 0) {

        for (const item of previousMonthData) {

          try {

            await prisma.budget_cat_allocations.create({

              data: {

                user_id: item.user_id,

                name: item.name,

                budget: item.budget,

                color: item.color,

                month,

                year,

                created_at: new Date(),

              },

            });

          } catch (err) {

            console.error(`Failed to insert ${item.name}`, err);

          }

        }
      }

    }

  }

  // Step 3: Fetch data using PostgreSQL function
  console.log('🔎 Calling PostgreSQL function usp_getbudgetcategorieswithspent...');

  const result = await prisma.$queryRaw<BudgetCategoryWithSpent[]>`
    SELECT * FROM usp_getbudgetcategorieswithspentv2(${userId}::UUID, ${month}::INT, ${year}::INT)
  `;

  console.log('✅ Result from PostgreSQL function:', result);
  return result;

}


export const generateLastMonthSummary = async (userId: string) => {

  const now = dayjs();

  const currentMonth = now.month() + 1;

  const currentYear = now.year();



  // Get user info (salary and monthly budget)

  const user = await prisma.user.findUnique({

    where: { id: userId },

    select: {

      base_salary: true,

      monthly_budget: true,

    },

  });



  if (!user) {

    return;

  }



  // Calculate total spent in current month

  const spent = await prisma.transactions.aggregate({

    where: {

      user_id: userId,



      type: {

        equals: "expense",

        mode: "insensitive",

      },



      date: {

        gte: new Date(currentYear, currentMonth - 1, 1),

        lt: new Date(currentYear, currentMonth, 1),

      },

    },



    _sum: {

      amount: true,

    },

  });



  // Check if current month's summary already exists

  const existing = await prisma.monthly_summary.findUnique({

    where: {

      user_id_month_year: {

        user_id: userId,

        month: currentMonth,

        year: currentYear,

      },

    },

  });



  if (existing) {

    // Update it if it exists — allowed only for current month

    const updated = await prisma.monthly_summary.update({

      where: {

        user_id_month_year: {

          user_id: userId,

          month: currentMonth,

          year: currentYear,

        },

      },

      data: {

        salary: user.base_salary ?? 0,

        total_budget: user.monthly_budget ?? 0,

        total_spent: spent._sum.amount ?? 0,

      },

    });



  } else {

    // Create new if it doesn't exist

    const created = await prisma.monthly_summary.create({

      data: {

        user_id: userId,

        month: currentMonth,

        year: currentYear,

        salary: user.base_salary ?? 0,

        total_budget: user.monthly_budget ?? 0,

        total_spent: spent._sum.amount ?? 0,

      },

    });

  }

};

export const getMonthlySummaryData = async (userId: string) => {

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const summaries = await prisma.monthly_summary.findMany({

    where: { user_id: userId },

    orderBy: [

      { year: 'asc' },

      { month: 'asc' }

    ],

  });



  const monthlyData = summaries.map((summary) => ({

    month: summary.month ? monthNames[summary.month - 1] : '',  // Convert numeric month to string

    salary: Number(summary.salary),

    budget: Number(summary.total_budget),

    spent: Number(summary.total_spent),

  }));

  return monthlyData;

};

// utils/formatInsights.ts

export function formatRawInsights(insightText: string | any): { sections: any[] } {

  // 1. Handle already parsed and structured input

  if (typeof insightText === "object") {

    if (Array.isArray(insightText.sections)) {

      return { sections: insightText.sections };

    }

    // If it's a single section or malformed structure

    return { sections: [insightText] };

  }



  // 2. Try to parse JSON string input

  if (typeof insightText === "string") {

    try {

      const parsed = JSON.parse(insightText);

      if (parsed && Array.isArray(parsed.sections)) {

        return { sections: parsed.sections };

      }

      if (parsed.sections) {

        return { sections: [parsed.sections] };

      }

    } catch {

      // Fall through to raw text parsing

    }

  }



  // 3. Manual parsing from raw string input

  const sections: any[] = [];



  const summaryMatch = insightText.match(/Summary:?([\s\S]*?)(?=\n{0,1}(Suggestions|Savings|$))/i);

  if (summaryMatch) {

    sections.push({ type: "heading", level: 2, text: "Summary" });



    const summaryContent = summaryMatch[1].trim();

    const paragraphMatch = summaryContent.match(/([^.]+?\.)/); // get first sentence

    if (paragraphMatch) {

      sections.push({ type: "paragraph", text: paragraphMatch[1].trim() });

    }



    const listItems = [...summaryContent.matchAll(/([A-Z_&\s]+):\s?₹?[\d,]+/gi)].map((match) => ({

      text: match[0].trim(),

    }));

    if (listItems.length > 0) {

      sections.push({ type: "list", items: listItems });

    }

  }



  const savingsMatch = insightText.match(/Savings:?([\s\S]*?)(?=\n{0,1}(Suggestions|Summary|$))/i);

  if (savingsMatch) {

    const text = savingsMatch[1].trim();

    sections.push({ type: "heading", level: 2, text: "Savings" });



    const savingsItems = [...text.matchAll(/(May|June|July|August)[\s:]+₹?[\d,]+/gi)].map((match) => ({

      text: match[0].trim(),

    }));



    if (savingsItems.length > 0) {

      sections.push({ type: "list", items: savingsItems });

    }

  }



  const suggestionsMatch = insightText.match(/Suggestions:?([\s\S]*)/i);

  if (suggestionsMatch) {

    const text = suggestionsMatch[1].trim();



    interface SuggestionItem {

      text: string;

    }



    const suggestionLines: SuggestionItem[] = text

      .split(/\n|\. /)

      .map((line: string) => line.trim())

      .filter((line: string) => line.length > 10)

      .map((line: string) => ({ text: line }));



    if (suggestionLines.length) {

      sections.push({ type: "heading", level: 2, text: "Suggestions" });

      sections.push({ type: "list", items: suggestionLines });

    }

  }



  return { sections };

}



export const dbinsightsDataModifier = async (dbinsightsData: any): Promise<string> => {
  if (!dbinsightsData) throw new Error("Missing DB insights data");

  const {
    incomeExpense = [],
    budgetUtilization = [],
    savingsTrend = [],
    budgetDistribution = [],
    topSpending = [],
    today
  } = dbinsightsData;

  // Build top spending section
  const topSpendingFormatted = topSpending
    .map((item: any) => `- ${item.category}: ₹${item.total_spent}`)
    .join("\n");

  // Budget utilization
  const budgetUtilizationFormatted = budgetUtilization
    .map((item: any) => {
      const pct = item.budget > 0 ? ((item.spent / item.budget) * 100).toFixed(1) : "0";
      return `- ${item.category}: Spent ₹${item.spent} of ₹${item.budget} (${pct}%)`;
    })
    .join("\n");

  // Savings trend (pick last two for recent comparison)
  const sortedSavings = [...savingsTrend].sort((a: any, b: any) =>
    b.year !== a.year ? b.year - a.year : b.month - a.month
  );

  const recentSavings = sortedSavings.slice(0, 2);
  const savingsFormatted = recentSavings
    .map((item: any) => `- ${getMonthName(item.month)}: ₹${item.savings}`)
    .join("\n");

  // Income & Expense Summary — matches the SQL function's three-way split:
  // salary (from user profile), other income (logged transactions), and expenses
  const salary = incomeExpense.find((i: any) => i.type === "Salary")?.total || 0;
  const otherIncome = incomeExpense.find((i: any) => i.type === "Other Income")?.total || 0;
  const expenses = incomeExpense.find((i: any) => i.type === "Expense")?.total || 0;
  const totalIncome = salary + otherIncome;

  // Day-of-month context, computed explicitly rather than left for the model to infer from a date string
  const todayDate = today ? new Date(today) : new Date();
  const dayOfMonth = todayDate.getDate();
  const daysInMonth = new Date(todayDate.getFullYear(), todayDate.getMonth() + 1, 0).getDate();
  const monthProgressPct = ((dayOfMonth / daysInMonth) * 100).toFixed(0);

  const prompt = `
You are a sharp, no-fluff personal finance analyst. Analyze this user's real financial data and return insights in valid JSON string format.

CRITICAL RULES:
- Never give generic advice that could apply to anyone (e.g. "track your spending," "create a budget," "save more"). Every insight must reference a specific number, category, or trend from the data below.
- Actively look for ANOMALIES: a category spiking compared to others, spending that doesn't match the budget allocated to it, a savings trend reversing direction, income that's missing or unusually low/high, or a category with 0% utilization that might mean a missed budget entry rather than good discipline.
- Do not praise "good behavior" unless the data actually shows restraint (e.g. spending meaningfully below budget AND below the prior month). Low spending in a category with no transactions at all is not evidence of good discipline — say so plainly if that's the case, don't fabricate praise.
- For "Suggestions," propose a concrete next action tied to a specific number (e.g. "Shopping is 37.5% of total spend at ₹3000 — consider capping it at ₹2000 next month to bring savings back toward last month's level"), not a restated observation.
- Salary is a fixed monthly figure from the user's profile, not something logged as a transaction each month — so a salary of ₹0 is a real data problem worth flagging (the user likely hasn't set it up), but "Other Income" being ₹0 in a given month is normal and not worth commenting on unless prior months show a pattern of regular extra income that's now missing.
- If something in the data looks contradictory or incomplete (e.g. expenses recorded with no matching income, or a budget category with spend but no allocation), flag it directly as a possible tracking gap rather than ignoring it.
- The month is ${monthProgressPct}% complete (day ${dayOfMonth} of ${daysInMonth}). Weight your risk assessment accordingly — a category at 80% of budget on day 5 is a serious warning; the same percentage on day 28 is normal pacing.

Return the output strictly in this JSON structure:
{
  "sections": [
    { "type": "heading", "level": 2, "text": "Summary" },
    { "type": "paragraph", "text": "..." },
    { "type": "list", "items": [{ "text": "..." }] },
    { "type": "heading", "level": 2, "text": "What's Unusual" },
    { "type": "list", "items": [{ "text": "..." }] },
    { "type": "heading", "level": 2, "text": "Suggestions" },
    { "type": "list", "items": [{ "text": "..." }] }
  ]
}

Data:
Top Spending:
${topSpendingFormatted || "- None"}

Budget Utilization:
${budgetUtilizationFormatted || "- None"}

Savings:
${savingsFormatted || "- None"}

Income:
- Salary: ₹${salary}
- Other Income: ₹${otherIncome}
- Total Income: ₹${totalIncome}
Expenses: ₹${expenses}
  `.trim();

  console.log("Generated prompt---------------------:", prompt);

  return prompt;
};

// Utility to convert month number to name

const getMonthName = (monthNum: number): string => {

  const date = new Date();

  date.setMonth(monthNum - 1);

  return date.toLocaleString("default", { month: "long" });

};







