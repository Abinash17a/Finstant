// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' // adjust path as needed
import { getUserFromToken } from '@/lib/utils'

export async function GET(req: NextRequest) {
  try {

    const userId = getUserFromToken(req)
    if (!userId) {
      return NextResponse.json({ error: 'User not found or authenticated' }, { status: 401 })
    }
    const user = await prisma.user.findUnique({ where: { id: userId } })
    // const users = await prisma.user.findMany()
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching users' }, { status: 500 })
  }
}
