import './font.css'
import './globals.css'
import Providers from '@/utils/provider'
import ToasterContext from '@/components/toaster-context'
import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LinkMate',
  description: 'Your Friendly Short Link Generator',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <ToasterContext />
        </Providers>
      </body>
    </html>
  )
}
