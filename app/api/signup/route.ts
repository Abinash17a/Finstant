// app/api/signup/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

export async function POST(req: NextRequest) {
  const { email, firstName ,lastName , password, country } = await req.json()

  if (!email || !firstName || !lastName || !password || !country) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        first_name:firstName,
        last_name:lastName,
        password_hash: hashedPassword,
        country,
      },
    })

    return NextResponse.json({ success: true, userId: user.id }, { status: 201 })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
