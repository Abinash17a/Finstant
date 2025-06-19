import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken'


const SECRET = process.env.JWT_SECRET || 'your-secret-key'
function getUserId(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader) return null

  const token = authHeader.split(' ')[1]
  try {
    const payload = jwt.verify(token, SECRET) as { userId: string }
    return payload.userId
  } catch {
    return null
  }
}
export async function POST(req: NextRequest) {
    try {
       const userId=getUserId(req);
        const { categories } = await req.json();

        // Validation (optional but good)
        if (!userId || !Array.isArray(categories)) {
            return new NextResponse('Invalid input', { status: 400 });
        }
        console.log(JSON.stringify(categories), "categories in updateBudget route");
        const updatePromises = categories.map((cat: { name: string; budget: number }) =>
            prisma.budget_cat_allocations.updateMany({
                where: {
                    user_id: userId,
                    name: cat.name,

                },
                data: { budget: cat.budget },
            })
        );

        await Promise.all(updatePromises);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating budgets:', error);
        return new NextResponse('Failed to update budgets', { status: 500 });
    }
}
