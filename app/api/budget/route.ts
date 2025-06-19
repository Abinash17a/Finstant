import { NextRequest, NextResponse } from 'next/server'
import { getBudgetCategoriesWithSpent } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')
  const month = parseInt(req.nextUrl.searchParams.get('month') || '')
  const year = parseInt(req.nextUrl.searchParams.get('year') || '')

  if (!userId || isNaN(month) || isNaN(year)) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 })
  }

  const data = await getBudgetCategoriesWithSpent(userId, month, year)
  return NextResponse.json(data)
}
