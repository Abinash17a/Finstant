// app/api/dashboard/route.ts
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const limit = searchParams.get('limit') || '5'; // Default limit to 10 if not provided

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const data = await prisma.$queryRaw<
    { get_dashboard_data: any }[]
  >`SELECT get_dashboard_data(${userId}::UUID, ${limit}::INT)`;

  const result = data[0]?.get_dashboard_data;
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: 'Failed to get dashboard data' }, { status: 500 });
  }
}
