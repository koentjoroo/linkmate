import { verifyJwt } from '@/lib/jwt'
import prisma from '@/lib/prisma'
import * as bcrypt from 'bcrypt'
import { NextResponse } from 'next/server'

type PostRequestBody = {
  oldPassword: string
  newPassword: string
}

export async function PATCH(request: Request) {
  const body: PostRequestBody = await request.json()
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  const jwtPayload = verifyJwt(token ?? '')
  if (!token || !jwtPayload) {
    return new Response(
      JSON.stringify({
        error: 'unauthorized',
      }),
      {
        status: 401,
      }
    )
  }

  try {
    const existing = await prisma.user.findFirst({
      where: {
        id: jwtPayload.id,
      },
      select: {
        hashedPassword: true,
        passwordSalt: true,
      },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Pengguna tidak dapat ditemukan' },
        { status: 500 }
      )
    }

    if (
      existing.passwordSalt &&
      existing.hashedPassword &&
      existing.hashedPassword !==
        bcrypt.hashSync(body.oldPassword, existing.passwordSalt)
    ) {
      return NextResponse.json(
        { error: 'Password lama tidak cocok' },
        { status: 400 }
      )
    }
    const saltRounds = 10
    const salt = await bcrypt.genSalt(saltRounds)
    const hashedPassword = await bcrypt.hash(body.newPassword, salt)

    const user = await prisma.user.update({
      where: {
        id: jwtPayload.id,
      },
      data: {
        hashedPassword,
        passwordSalt: salt,
        setPassword: true,
      },
    })

    const { hashedPassword: password, ...result } = user

    return NextResponse.json(result)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error }, { status: 500 })
  }
}
