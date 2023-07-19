import AppBarActions from '@/components/app-bar-actions'
import HomeShortLinkForm from '@/components/home-short-link-form'
import Link from 'next/link'

const routes = [
  {
    href: '/',
    label: 'Beranda',
  },
  {
    href: '/',
    label: 'Tentang',
    options: [
      {
        href: '#about',
        label: 'LinkMate',
      },
      {
        href: '#team',
        label: 'Tim Kita',
      },
    ],
  },
  {
    href: '/dashboard/list',
    label: 'List',
  },
  {
    href: '/contact',
    label: 'Kontak',
  },
]

export default async function Home() {
  return (
    <main>
      <nav className="navbar p-8 px-16">
        <div className="navbar-start">
          <label tabIndex={0} className="font-bold">
            LinkMate
          </label>
          <ul className="menu menu-horizontal">
            {routes.map((route) => (
              <li key={route.href + route.label}>
                {route.options?.length ? (
                  <details className="dropdown">
                    <summary>{route.label}</summary>
                    <ul className="p-2 shadow-lg border border-black/10 menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
                      {route.options.map((option) => (
                        <li key={option.href + route.label}>
                          <Link href={option.href}>{option.label}</Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : (
                  <Link href={route.href}>{route.label}</Link>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="navbar-end gap-2">
          <AppBarActions />
        </div>
      </nav>
      <section id="hero" className="hero min-h-[720px]">
        <div className="hero-content w-full">
          <div>
            <article className="prose prose-2xl">
              <h1>Perpendek link dengan sekali klik!</h1>
              <p>Deskripsi singkat mengenai short link uhuy</p>
            </article>
            <div className="mt-4">
              <HomeShortLinkForm />
            </div>
          </div>
          <div className="ml-8 card card-bordered flex-shrink-0 w-full max-w-sm shadow-2xl">
            <div className="card-body text-center">Lottie</div>
          </div>
        </div>
      </section>
      <section id="about"></section>
      <section id="team"></section>
    </main>
  )
}
