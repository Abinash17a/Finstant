// app/api/dashboard/route.ts
import { prisma } from '@/lib/prisma';
import { generateLastMonthSummary, getMonthlySummaryData } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const limit = searchParams.get('limit') || '5'; // Default limit to 10 if not provided

    console.log('🔍 Dashboard API called with:', { userId, limit });

    if (!userId) {
      console.log('❌ Missing userId parameter');
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    console.log('📊 Generating last month summary...');
    await generateLastMonthSummary(userId);
    
    console.log('🔎 Executing dashboard query...');
    const data = await prisma.$queryRaw<
    { get_dashboard_data: any }[]
  >`SELECT get_dashboard_data(${userId}::UUID, ${limit}::INT)`;

    console.log('📈 Raw query result:', data);
    
  const result = data[0]?.get_dashboard_data;
    console.log('✅ Final dashboard result:', result);
    
    if (!result) {
      console.log('⚠️ No dashboard data returned');
      return NextResponse.json({ error: 'No data found' }, { status: 404 });
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ Error fetching dashboard data:', error);
    return NextResponse.json({ error: 'Failed to get dashboard data' }, { status: 500 });
  }
}
