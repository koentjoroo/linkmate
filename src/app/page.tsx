import AppBarActions from '@/components/app-bar-actions'
import HomeShortLinkForm from '@/components/home-short-link-form'
import Image from 'next/image'
import Link from 'next/link'
import { FaPaperPlane } from 'react-icons/fa'

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
    href: '#contact',
    label: 'Kontak',
  },
]

const team = [
  {
    imageUrl: '/images/annisa.webp',
    name: 'Annisa Damayati',
    num: '21.11.4260',
    text: 'Front End, PPT',
  },
  {
    imageUrl: '/images/aryo.webp',
    name: 'Aryo Bimo Wicaksono',
    num: '21.11.4311',
    text: 'Back End',
  },
  {
    imageUrl: '/images/salmaa.webp',
    name: 'Mauhiba Salmaa Ghaisani',
    num: '21.11.4264',
    text: 'Front End, PPT',
  },
  {
    imageUrl: '/images/amel.webp',
    name: 'Ameilia Nurcahyandari Sutomo',
    num: '21.11.4314',
    text: 'Front End, Desain',
  },
]

export default async function Home() {
  return (
    <>
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
          <HomeShortLinkForm />
        </section>
        <section
          id="about"
          className="mt-32 bg-secondary text-secondary-content"
        >
          <div className="container prose text-center mx-auto px-4 py-32">
            <h2>Tentang LinkMate</h2>
            <p>
              Introducing LinkMate - Aplikasi shortlink yang memudahkan Anda
              memperpendek tautan web untuk kemudahan berbagi dan mencatat
              statistik kinerja. Bergabunglah sekarang dan jelajahi potensi
              tanpa batas!
            </p>
            <Link href="/auth/signup" className="btn btn-primary btn-lg">
              Bergabung Sekarang!
            </Link>
          </div>
        </section>
        <section id="team" className="mb-32 bg-white">
          <div className="container mx-auto p-32">
            <div className="prose text-center mx-auto mb-8">
              <h2>Tim Kami</h2>
            </div>
            <ul className="flex flex-wrap">
              {team.map((member) => (
                <li
                  key={member.num}
                  className="w-full lg:w-1/2 p-2 py-4 flex gap-8 flex-col items-center text-center xl:text-left xl:flex-row"
                >
                  <div className="min-w-[200px] w-1/3 aspect-square rounded-full overflow-clip">
                    <Image
                      src={member.imageUrl}
                      width={400}
                      height={400}
                      alt={member.name}
                      title={member.name}
                    />
                  </div>
                  <div className="prose">
                    <h3 className="font-bold">{member.name}</h3>
                    <p>
                      <b>{member.num}</b> <br /> {member.text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section id="contact" className="my-32">
          <div className="prose container mx-auto">
            <h2>Kontak</h2>
            <p>
              Kami sangat menghargai masukan Anda mengenai LinkMate. Pesan,
              kesan, atau saran Anda sangat berarti bagi kami dalam terus
              meningkatkan kualitas layanan kami. Silakan berbagi pandangan Anda
              melalui:{' '}
            </p>
            <div className="flex flex-col gap-2 items-start">
              <Link
                href="mailto:shortlinkmate@gmail.com"
                className="btn no-animation"
              >
                <FaPaperPlane className="text-lg" />
                shortlinkmate@gmail.com
              </Link>
              <span className="btn no-animation cursor-default">
                Condongcatur, Depok, Sleman, Yogyakarta
              </span>
            </div>
          </div>
        </section>
      </main>
      <footer className="text-center bg-white p-4">&copy; 2023 LinkMate</footer>
    </>
  )
}
