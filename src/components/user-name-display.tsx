'use client'
import { useSession } from 'next-auth/react'

export function UserNameDisplay() {
  const { data: session } = useSession()
  return <p>Halo, {session?.user?.name}</p>
}
