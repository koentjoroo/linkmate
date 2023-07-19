import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession as nextAuthGetServerSession } from 'next-auth'

export async function getServerSession() {
  return await nextAuthGetServerSession(authOptions)
}
