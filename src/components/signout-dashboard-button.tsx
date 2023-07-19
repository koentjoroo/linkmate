'use client'
import { signOut } from 'next-auth/react'
import { FiLogOut } from 'react-icons/fi'

export function SignOutDashboardButton() {
  return (
    <button
      className="btn btn-ghost hover:bg-error/20 hover:text-error w-full"
      onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
    >
      <FiLogOut /> Keluar
    </button>
  )
}
