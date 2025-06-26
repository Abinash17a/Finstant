import { generateLastMonthSummary, getMonthlySummaryData } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest ,res: NextResponse) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

  const data = await getMonthlySummaryData(userId);
  if (!Array.isArray(data) || data.length === 0) {
    return NextResponse.json({ error: 'No summary data found' }, { status: 404 });
  }
  const result = data;
  return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: 'Failed to get dashboard data' }, { status: 500 });
  }
}
