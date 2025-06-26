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

export async function getHuggingFaceAdvice(prompt: string) {
  const HUGGING_FACE_API_TOKEN = process.env.HUGGINGFACE_API_KEY;

  const res = await axios.post(
    'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3',
    {
      inputs: prompt,
      parameters: {
        temperature: 0.8,
        top_p: 0.95,
        max_new_tokens: 200,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${HUGGING_FACE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  );

  // return res.data?.[0]?.generated_text || 'No advice available.';
  console.log("hello", res.data?.[0]?.generated_text)
  const result = await extractSavingTip(res.data?.[0]?.generated_text)
  return result || 'No advice available.';
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


export async function getBudgetCategoriesWithSpent(userId: string, month: number, year: number) {
  // Step 1: Check if categories exist for this month
  const existing = await prisma.budget_cat_allocations.findMany({
    where: { user_id: userId, month, year },
  });

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

  // Step 3: Fetch data using the stored procedure
  const result = await prisma.$queryRaw<any[]>`
    SELECT * FROM usp_getbudgetcategorieswithspent(${userId}::UUID, ${month}::INT, ${year}::INT)
  `;

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
      type: "EXPENSE",
      date: {
        gte: new Date(currentYear, currentMonth - 1, 1), // Start of current month
        lt: new Date(currentYear, currentMonth, 1),      // Start of next month
      },
    },
    _sum: { amount: true },
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
    month: monthNames[summary.month - 1],  // Convert numeric month to string
    salary: Number(summary.salary),
    budget: Number(summary.total_budget),
    spent: Number(summary.total_spent),
  }));
  return monthlyData;
};

export async function generateInsights(data: string) {

  try {
    const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    console.log("GEMINI_API_KEY", GEMINI_API_KEY );
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set in environment variables.");
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: data }]
            }
          ]
        })
      }
    );

    const result = await response.json();
    console.log(result, "raw result from Gemini");

    const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log(rawText, "rawText in generateInsights");

    if (!rawText) {
      throw new Error("Invalid response from Gemini API.");
    }

    // ✅ Clean markdown code block markers (```json ... ```)
    let cleaned = rawText.trim();
    if (cleaned.startsWith("```json") || cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?/, "").replace(/```$/, "").trim();
    }

    let insights;
    try {
      insights = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("Error parsing response:", parseError);
      throw new Error("Failed to parse AI response as JSON.");
    }

    console.log(insights, "insights in generateInsights");
    const res = formatRawInsights(insights);
    console.log(res, "res in generateInsights");

    return res;
  } catch (err) {
    console.error("Error in generateInsights:", err);
    throw new Error("Failed to generate insights from Gemini AI.");
  }
}



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
      return `- ${item.category}: Spent ₹${item.spent} of ₹${item.budget}`;
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

  // Income & Expense Summary
  const income = incomeExpense.find((i: any) => i.type === "Income (Salary)")?.total || 0;
  const repayments = incomeExpense.find((i: any) => i.type === "Repayments Received")?.total || 0;
  const expenses = incomeExpense.find((i: any) => i.type === "Expense")?.total || 0;

  // Instruction + Prompt Builder
  const prompt = `
You are a financial assistant. Analyze the following financial data and return insights in valid JSON string format.

Instructions:
- The output must be a **single JSON object** as a string.
- Do not include any explanations or comments—only return valid JSON in the format described below.
- If a category has spent more than 80% of its budget and it is early in the month, mark it as overspending.
- If a category is within limits, acknowledge it as well-managed.
- Base suggestions on data, budget utilization, and time of month (today is ${today}).

Return the output strictly in this JSON structure:
{
  "sections": [
    { "type": "heading", "level": 2, "text": "Summary" },
    { "type": "paragraph", "text": "..." },
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
- Salary: ₹${income}
- money i got back from friends that i gave them previously: ₹${repayments}
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



