import ProfileForm from '@/components/profile-form'

export default function Dashboard() {
  return (
    <>
      <section className="mb-8">
        <h1 className="text-xl font-bold">Profil Saya</h1>
      </section>
      <section>
        <ProfileForm />
      </section>
    </>
  )
}
