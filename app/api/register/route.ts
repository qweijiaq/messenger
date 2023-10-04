import bcrypt from 'bcrypt'

import prisma from '@/app/libs/prismadb'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, name, password } = body

    if (!name || !email || !password) {
      return new NextResponse(undefined, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    console.log(1)

    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
    })
    console.log(2)
    return NextResponse.json(user)
  } catch (error: any) {
    return new NextResponse(undefined, { status: 500 })
  }
}
