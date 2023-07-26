import { verifyJwt } from '@/lib/jwt'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

type PostRequestBody = {
  urlShort: string
  urlLong: string
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
  const links = await prisma.link.findMany({
    where: {
      userId: jwtPayload.id,
    },
  })

  if (links) {
    return new Response(JSON.stringify(links))
  } else {
    return new Response(JSON.stringify(null))
  }
}

export async function POST(request: Request) {
  try {
    const body: PostRequestBody = await request.json()
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const jwtPayload = verifyJwt(token ?? '')
    const exist = await prisma.link.findFirst({
      where: {
        urlShort: body.urlShort,
      },
    })
    if (exist) {
      return NextResponse.json(
        { error: 'Link pendek ini sudah digunakan' },
        { status: 409 }
      )
    }
    const link = await prisma.link.create({
      data: {
        urlLong: body.urlLong,
        urlShort: body.urlShort,
        userId: jwtPayload?.id || null,
      },
    })
    return NextResponse.json(link)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error }, { status: 500 })
  }
}
