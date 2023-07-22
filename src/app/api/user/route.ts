import { verifyJwt } from '@/lib/jwt'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

type PostRequestBody = {
  fullName: string
  phoneNumber: string
  email: string
}

export async function GET(request: Request) {
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
    const user = await prisma.user.findFirst({
      where: {
        id: jwtPayload.id,
      },
      select: {
        phoneNumber: true,
        fullName: true,
        name: true,
        email: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Pengguna tidak ditemukan' },
        { status: 401 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error }, { status: 500 })
  }
}

export async function POST(request: Request) {
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
    const emailExist = await prisma.user.findFirst({
      where: {
        OR: [{ email: body.email }],
        NOT: {
          id: jwtPayload.id,
        },
      },
    })

    if (emailExist) {
      return NextResponse.json(
        {
          error: 'Email sudah digunakan pengguna lain',
        },
        {
          status: 409,
        }
      )
    }

    const user = await prisma.user.update({
      where: {
        id: jwtPayload.id,
      },
      data: {
        fullName: body.fullName,
        phoneNumber: body.phoneNumber,
        email: body.email,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Gagal memperbarui data pengguna' },
        { status: 500 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error }, { status: 500 })
  }
}
