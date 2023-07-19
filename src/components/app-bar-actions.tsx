'use client'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { UserNameDisplay } from './user-name-display'
import { SignOutButton } from './signout-button'

export default function AppBarActions() {
  const { data: session } = useSession()
  return session?.user ? (
    <>
      <UserNameDisplay />
      <SignOutButton />
    </>
  ) : (
    <>
      <Link href="/auth/signin" className="btn btn-ghost rounded-full px-8">
        Masuk
      </Link>
      <Link href="/auth/signup" className="btn btn-primary rounded-full px-8">
        Daftar
      </Link>
    </>
  )
}
