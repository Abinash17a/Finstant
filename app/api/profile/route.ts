import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'your-secret-key'

function getUserId(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader) return null

  const token = authHeader.split(' ')[1]
  try {
    const payload = jwt.verify(token, SECRET) as { userId: string }
    return payload.userId
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  const userId = getUserId(req)
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      first_name: true,
      last_name: true,
      phone_number: true,
      email: true,
      avatar_url: true,
      base_salary: true,
      monthly_budget: true,
      position: true,
      address: true,
      zip_code: true,
      country: true,
      created_at: true,
    },
  })

  return NextResponse.json(user)
}
