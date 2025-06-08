import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Parse query parameters
    const user_id = searchParams.get('user_id');
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '5', 10); // default limit = 5

    // Build dynamic filter object
    const whereClause: any = {};

    if (user_id) whereClause.user_id = user_id;
    if (category) whereClause.category = category;
    if (type) whereClause.type = type;

    const transactions = await prisma.transactions.findMany({
      where: whereClause,
      orderBy: {
        date: 'desc',
      },
      take: limit,
    });

    return NextResponse.json({ success: true, transactions }, { status: 200 });
  } catch (err) {
    console.error('GET /api/expense error:', err);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
