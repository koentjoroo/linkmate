import { SignInForm } from '@/components/signin-form'
import Head from 'next/head'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sign In - LinkMate',
  description: 'Sign in to LinkMate short link generator',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function SignIn() {
  return (
    <>
      <Head>
        <title>Masuk - LinkMate</title>
      </Head>
      <main className="flex items-center justify-center min-h-screen max-h-screen w-full bg-white">
        <div className="card p-8 shadow-xl bg-base-100 max-w-screen-sm w-full">
          <div className="card-body">
            <Link href="/">
              <h1 className="font-bold text-center mb-8">LinkMate</h1>
            </Link>
            <SignInForm />
          </div>
        </div>
      </main>
    </>
  )
}
