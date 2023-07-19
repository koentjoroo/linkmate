'use client'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { BiUserCircle } from 'react-icons/bi'

export function DashboardProfileDropdown() {
  const { data: session } = useSession()
  return (
    <Link href="/dashboard/profile" className="btn btn-ghost rounded-full">
      <BiUserCircle className="text-2xl" />
      {session?.user?.name}
    </Link>
  )
}
