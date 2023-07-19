'use client'
import { signOut } from 'next-auth/react'

export function SignOutButton() {
  return (
    <button
      className="btn btn-ghost rounded-full px-8"
      onClick={() => signOut()}
    >
      Keluar
    </button>
  )
}
