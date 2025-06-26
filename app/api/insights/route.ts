import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();




export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    if (!userId || !month || !year) {
      return new NextResponse(JSON.stringify({ error: 'Missing required query parameters' }), {
        status: 400,
      });
    }

    const insights = await prisma.$queryRawUnsafe<any[]>(
      `SELECT get_user_financial_insights($1::UUID, $2::INT, $3::INT)`,
      userId,
      parseInt(month, 10),
      parseInt(year, 10)
    );

    return NextResponse.json({ insights: insights[0]?.get_user_financial_insights ?? null });
  } catch (error) {
    console.error('Error in /user-insights route:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
