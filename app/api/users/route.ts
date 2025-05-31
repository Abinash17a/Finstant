// app/api/users/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' // adjust path as needed

export async function GET() {
  try {
    const users = await prisma.user.findMany()
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching users' }, { status: 500 })
  }
}
