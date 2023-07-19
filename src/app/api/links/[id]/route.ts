import { verifyJwt } from '@/lib/jwt'
import prisma from '@/lib/prisma'

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
