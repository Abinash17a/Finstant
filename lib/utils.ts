import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import jwt from 'jsonwebtoken'
import axios from 'axios';
import { prisma } from "./prisma";
// import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";




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

  console.log(`[generateLastMonthSummary] For userId: ${userId}`);
  console.log(`[generateLastMonthSummary] Current month: ${currentMonth}, Year: ${currentYear}`);

  // Get user info (salary and monthly budget)
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      base_salary: true,
      monthly_budget: true,
    },
  });

  console.log(`[generateLastMonthSummary] User data:`, user);

  if (!user) {
    console.log(`[generateLastMonthSummary] No user found with ID: ${userId}`);
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

  console.log(`[generateLastMonthSummary] Total spent:`, spent._sum.amount ?? 0);

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

    console.log(`[generateLastMonthSummary] Monthly summary updated:`, updated);
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

    console.log(`[generateLastMonthSummary] Monthly summary created:`, created);
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
console.log("monthlyData", monthlyData, "userId", userId)
  return monthlyData;
};