import { DashboardProfileDropdown } from '@/components/dashboard-profile-dropdown'
import { SignOutDashboardButton } from '@/components/signout-dashboard-button'
import { Metadata } from 'next'
import Link from 'next/link'
import { CgList } from 'react-icons/cg'
import { HiMenu } from 'react-icons/hi'
import { IoSpeedometerOutline } from 'react-icons/io5'

export const metadata: Metadata = {
  title: 'Dasbor - LinkMate',
  description: 'Dasbor LinkMate',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="sidenav-container">
      <input
        id="drawer"
        className="sidenav-toggle"
        type="checkbox"
        defaultChecked={true}
      />
      <aside className="sidenav-menu border-r border-r-base">
        <div className="flex flex-col h-full">
          <div className="h-24 px-4 flex justify-center items-center text-center font-bold bg-base-100">
            <Link href="/">LinkMate</Link>
          </div>
          <ul className="menu menu-lg p-4 w-80 flex-1 bg-white text-base-content">
            <li>
              <Link href="/dashboard">
                <IoSpeedometerOutline /> Dasbor
              </Link>
            </li>
            <li>
              <Link href="/dashboard/list">
                <CgList /> List
              </Link>
            </li>
          </ul>
          <div className="p-4 bg-white">
            <SignOutDashboardButton />
          </div>
        </div>
      </aside>
      <main className="sidenav-content h-screen max-h-screen overflow-y-auto flex flex-col bg-white">
        <div className="flex items-center w-full h-24 px-4 justify-between">
          <label htmlFor="drawer" className="btn btn-circle btn-ghost">
            <HiMenu className="text-xl" />
          </label>
          <DashboardProfileDropdown />
        </div>
        <div className="flex-1 p-4">
          <div className="container mx-auto">{children}</div>
        </div>
      </main>
    </div>
  )
}
