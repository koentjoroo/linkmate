import prisma from '@/lib/prisma'
import * as bcrypt from 'bcrypt'
import { NextResponse } from 'next/server'

type RequestBody = {
  email: string
  username: string
  password: string
  phoneNumber?: string
}

export async function POST(request: Request) {
  const body: RequestBody = await request.json()

  if (!body?.username || !body?.email || !body?.password) {
    return new NextResponse('Missing Fields', { status: 400 })
  }

  const exist = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  })

  if (exist) {
    throw new Error('Email already exist')
  }

  const saltRounds = 10
  const salt = await bcrypt.genSalt(saltRounds)

  const user = await prisma.user.create({
    data: {
      email: body.email,
      name: body.username,
      phoneNumber: body?.phoneNumber ?? null,
      hashedPassword: await bcrypt.hash(body.password, salt),
      setPassword: true,
      passwordSalt: salt,
    },
  })

  const { hashedPassword, ...result } = user
  return NextResponse.json(result)
}
