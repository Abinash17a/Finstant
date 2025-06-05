// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/utils'

export async function PUT(req: NextRequest) {
  try {
    console.log("ïm here" )
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const id = getUserFromToken(req);
    console.log("ïm here2-----",id)
    if (!id) return NextResponse.json({ message: 'Invalid token' }, { status: 401 });

    const body = await req.json();
    console.log("body in update user", body)
    const updatedUser = await prisma.user.update({
      where: { id },
      data: body,
    });
    console.log(updatedUser, "updated user in update user")

    return NextResponse.json({ message: `Updated user with id: ${id}`, data: updatedUser });
  } catch (error) {
    console.log("Im in error")
    return NextResponse.json({ message: 'Error updating user', error }, { status: 500 });
  }
}
