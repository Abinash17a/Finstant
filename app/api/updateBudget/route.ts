import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'your-secret-key';

function getUserId(req: NextRequest) {
    const authHeader = req.headers.get('authorization');

    console.log('Authorization Header:', authHeader);

    if (!authHeader) {
        console.log('❌ No Authorization Header');
        return null;
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, SECRET) as { userId: string };

        console.log('✅ JWT Payload:', payload);

        return payload.userId;
    } catch (err) {
        console.error('❌ JWT Verify Failed:', err);
        return null;
    }
}

export async function POST(req: NextRequest) {
    try {
        const userId = getUserId(req);

        const body = await req.json();

        console.log('📦 Request Body:', body);

        const { categories, month, year } = body;

        console.log('👤 userId:', userId);
        console.log('📂 categories:', categories);
        console.log('📂 isArray:', Array.isArray(categories));

        // Validation
        if (!userId) {
            return NextResponse.json(
                {
                    error: 'User not authenticated',
                    userId
                },
                { status: 400 }
            );
        }

        if (!Array.isArray(categories)) {
            return NextResponse.json(
                {
                    error: 'Categories must be an array',
                    received: categories
                },
                { status: 400 }
            );
        }

        if (categories.length > 12) {
            return NextResponse.json(
                {
                    error: 'Maximum 12 categories allowed'
                },
                { status: 400 }
            );
        }

        const now = new Date();

        const targetMonth =
            typeof month === 'number'
                ? month
                : now.getMonth() + 1;

        const targetYear =
            typeof year === 'number'
                ? year
                : now.getFullYear();

        console.log('📅 Target Month:', targetMonth);
        console.log('📅 Target Year:', targetYear);

        await prisma.$transaction(async (tx) => {
            const categoryNames = categories
                .map((c: any) => c.name?.trim())
                .filter((n: string) => !!n);

            console.log('📋 Category Names:', categoryNames);

            await tx.budget_cat_allocations.deleteMany({
                where: {
                    user_id: userId,
                    month: targetMonth,
                    year: targetYear,
                    name: {
                        notIn: categoryNames,
                    },
                },
            });

            for (const cat of categories) {
                const nameTrimmed = cat.name?.trim();

                if (!nameTrimmed) continue;

                console.log('🔄 Processing Category:', nameTrimmed);

                const existing =
                    await tx.budget_cat_allocations.findFirst({
                        where: {
                            user_id: userId,
                            name: nameTrimmed,
                            month: targetMonth,
                            year: targetYear,
                        },
                    });

                if (existing) {
                    console.log('✏️ Updating:', existing.id);

                    await tx.budget_cat_allocations.update({
                        where: { id: existing.id },
                        data: {
                            budget: Number(cat.budget),
                            color:
                                cat.color ||
                                existing.color ||
                                '#6366F1',
                        },
                    });
                } else {
                    console.log('➕ Creating:', nameTrimmed);

                    await tx.budget_cat_allocations.create({
                        data: {
                            user_id: userId,
                            name: nameTrimmed,
                            budget: Number(cat.budget),
                            color: cat.color || '#6366F1',
                            month: targetMonth,
                            year: targetYear,
                        },
                    });
                }
            }
        });

        return NextResponse.json({
            success: true,
        });
    } catch (error: any) {
        console.error('❌ Error updating budgets:', error);

        return NextResponse.json(
            {
                error: error?.message || 'Unknown Error',
            },
            { status: 500 }
        );
    }
}