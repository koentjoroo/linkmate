'use client'
import { useSession } from 'next-auth/react'
import { BiUserCircle } from 'react-icons/bi'

export function DashboardProfileDropdown() {
  const { data: session } = useSession()
  return (
    <span className="btn btn-ghost rounded-full">
      <BiUserCircle className="text-2xl" />
      {session?.user?.name}
    </span>
  )
}
