// /app/api/test-db/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma'

export async function GET() {
  try {
    // Just try to read from the DB
    const users = await prisma.user.findMany({
      take: 1,
    });

    return NextResponse.json({ message: 'DB connected ✅', users });
  } catch (error) {
    console.error('DB connection failed ❌', error);
    return NextResponse.json(
      { message: 'DB connection failed ❌', error: (error as Error).message },
      { status: 500 }
    );
  }
}
