import { verifyJwt } from '@/lib/jwt'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

type PatchRequestBody = {
  urlShort: string
  urlLong: string
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token || !verifyJwt(token)) {
    return new Response(
      JSON.stringify({
        error: 'unauthorized',
      }),
      {
        status: 401,
      }
    )
  }
  const link = await prisma.link.findFirst({
    where: {
      id: params.id,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  })

  if (link) {
    return new Response(JSON.stringify(link))
  } else {
    return new Response(JSON.stringify(null))
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body: PatchRequestBody = await request.json()
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
    if (!params.id) {
      return NextResponse.json({ error: 'ID link tidak ada' }, { status: 400 })
    }
    const exist = await prisma.link.findFirst({
      where: {
        urlShort: body.urlShort,
      },
    })
    if (exist) {
      return NextResponse.json(
        { error: 'Link pendek ini sudah digunakan' },
        {
          status: 404,
        }
      )
    }
    const link = await prisma.link.update({
      where: {
        id: params.id,
      },
      data: {
        urlLong: body.urlLong,
        urlShort: body.urlShort,
      },
    })
    return NextResponse.json(link)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token || !verifyJwt(token)) {
    return new Response(
      JSON.stringify({
        error: 'unauthorized',
      }),
      {
        status: 401,
      }
    )
  }
  const link = await prisma.link.delete({
    where: {
      id: params.id,
    },
  })
  if (link) {
    return new Response(JSON.stringify(link))
  } else {
    return new Response(JSON.stringify(null))
  }
}
