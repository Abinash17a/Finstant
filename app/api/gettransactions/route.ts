import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    console.log('================ API /expense START ================');

    const { searchParams } = new URL(req.url);

    console.log('Full URL:', req.url);

    // ✅ Query params
    const user_id =
      searchParams.get('user_id') ||
      searchParams.get('userId');

    const category = searchParams.get('category');
    const type = searchParams.get('type');

    // ✅ Safe limit
    const limitParam = searchParams.get('limit');

    const limit =
      limitParam && !isNaN(Number(limitParam))
        ? Number(limitParam)
        : 5;

    console.log('Parsed Query Params:', {
      user_id,
      category,
      type,
      limit,
    });

    // ✅ Dynamic where clause
    const whereClause: any = {};

    // Only add filter if value exists
    if (user_id?.trim()) {
      whereClause.user_id = user_id.trim();

      console.log(
        'Added user_id filter:',
        whereClause.user_id
      );
    }

    if (category?.trim()) {
      whereClause.category =
        category.trim().toUpperCase();

      console.log(
        'Added category filter:',
        whereClause.category
      );
    }

    if (type?.trim()) {
      whereClause.type =
        type.trim().toUpperCase();

      console.log(
        'Added type filter:',
        whereClause.type
      );
    }

    console.log(
      'Final whereClause:',
      JSON.stringify(whereClause, null, 2)
    );

    // ✅ Query still works even if whereClause = {}
    console.log('Executing Prisma Query...');

    const transactions =
      await prisma.transactions.findMany({
        where:
          Object.keys(whereClause).length > 0
            ? whereClause
            : undefined,

        orderBy: {
          date: 'desc',
        },

        take: limit,
      });

    console.log(
      `Transactions fetched successfully. Count: ${transactions.length}`
    );

    console.log('Transactions Data:', transactions);

    console.log(
      '================ API /expense SUCCESS ================'
    );

    return NextResponse.json(
      {
        success: true,
        count: transactions.length,
        filtersApplied: whereClause,
        transactions,
      },
      { status: 200 }
    );

  } catch (err: any) {

    console.error(
      '================ API /expense ERROR ================'
    );

    console.error('Error Message:', err?.message);

    console.error('Full Error:', err);

    console.error('Stack Trace:', err?.stack);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
        message: err?.message,
      },
      { status: 500 }
    );
  }
}