import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { path: string } }
) {
  const link = await prisma.link.findFirst({
    where: {
      urlShort: params.path,
    },
  })
  if (link) {
    return NextResponse.redirect(link.urlLong)
  } else {
    return NextResponse.redirect(process.env.NEXTAUTH_URL ?? '/')
  }
}
