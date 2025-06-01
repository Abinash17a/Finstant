import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  // Validate input
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
  }
  try {
    // Find the user by email
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    if (!user.password_hash) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }
    const isPasswordValid = await bcrypt.compare(password, user.password_hash)

    const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '1h' })

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Optionally, return user info or a token
    return NextResponse.json({ token,success: true, userId: user.id }, { status: 200 })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
