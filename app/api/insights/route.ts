import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { getUserFromauthToken } from '@/lib/utils';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const authenticatedUserId = await getUserFromauthToken(token);
    if (!authenticatedUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const month = parseInt(searchParams.get('month') ?? '', 10);
    const year = parseInt(searchParams.get('year') ?? '', 10);

    if (!userId || isNaN(month) || isNaN(year) || month < 1 || month > 12) {
      return NextResponse.json({ error: 'Missing or invalid query parameters' }, { status: 400 });
    }

    if (authenticatedUserId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const result = await prisma.$queryRawUnsafe<any[]>(
      `SELECT get_user_financial_insights($1::UUID, $2::INT, $3::INT)`,
      userId,
      month,
      year
    );

    const data = result[0]?.get_user_financial_insights ?? null;

    return NextResponse.json({ insights: data });
  } catch (error) {
    console.error('Error in /api/insights route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}