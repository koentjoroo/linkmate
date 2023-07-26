import { JwtPayload } from 'jsonwebtoken'
import NextAuth from 'next-auth/next'

declare module 'next-auth' {
  interface User {
    accessToken?: string
  }
  interface Session {
    user: {
      id: string
      email: string
      image: string
      name: string
      accessToken: string
      setPassword: boolean
    }
  }
}
