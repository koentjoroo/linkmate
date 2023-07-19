import { signJwtAccessToken } from '@/lib/jwt'
import prisma from '@/lib/prisma'
import * as bcrypt from 'bcrypt'

type RequestBody = {
  username: string
  password: string
}

export async function POST(request: Request) {
  const body: RequestBody = await request.json()

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email: body.username,
          },
          {
            name: body.username,
          },
        ],
      },
    })

    if (
      user &&
      (await bcrypt.compare(body.password, user.hashedPassword ?? ''))
    ) {
      const { hashedPassword, ...userWithoutPassword } = user
      const accessToken = signJwtAccessToken(userWithoutPassword)
      const result = {
        ...userWithoutPassword,
        accessToken,
      }
      return new Response(JSON.stringify(result))
    } else {
      return new Response(JSON.stringify(null))
    }
  } catch (error) {
    return new Response(JSON.stringify(null))
  }
}
