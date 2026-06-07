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
        const userId = getUserId(req);
        const body = await req.json();
        const { categories, month, year } = body;

        // Validation
        if (!userId || !Array.isArray(categories)) {
            return new NextResponse('Invalid input', { status: 400 });
        }

        if (categories.length > 12) {
            return new NextResponse('Maximum 12 categories allowed', { status: 400 });
        }

        const now = new Date();
        const targetMonth = typeof month === 'number' ? month : (now.getMonth() + 1);
        const targetYear = typeof year === 'number' ? year : now.getFullYear();

        await prisma.$transaction(async (tx) => {
            const categoryNames = categories
                .map((c: any) => c.name?.trim())
                .filter((n: string) => !!n);

            // 1. Delete categories no longer present in the updated list
            await tx.budget_cat_allocations.deleteMany({
                where: {
                    user_id: userId,
                    month: targetMonth,
                    year: targetYear,
                    name: {
                        notIn: categoryNames
                    }
                }
            });

            // 2. Upsert the updated categories list
            for (const cat of categories) {
                const nameTrimmed = cat.name?.trim();
                if (!nameTrimmed) continue;

                const existing = await tx.budget_cat_allocations.findFirst({
                    where: {
                        user_id: userId,
                        name: nameTrimmed,
                        month: targetMonth,
                        year: targetYear
                    }
                });

                if (existing) {
                    await tx.budget_cat_allocations.update({
                        where: { id: existing.id },
                        data: {
                            budget: parseFloat(cat.budget),
                            color: cat.color || existing.color || '#6366F1'
                        }
                    });
                } else {
                    await tx.budget_cat_allocations.create({
                        data: {
                            user_id: userId,
                            name: nameTrimmed,
                            budget: parseFloat(cat.budget),
                            color: cat.color || '#6366F1',
                            month: targetMonth,
                            year: targetYear
                        }
                    });
                }
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating budgets:', error);
        return new NextResponse('Failed to update budgets', { status: 500 });
    }
}

