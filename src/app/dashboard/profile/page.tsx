export default function DashboardProfilePage() {
  return (
    <>
      <section className="mb-8">
        <h1 className="text-xl font-bold">Profil Saya</h1>
      </section>
      <section className="flex flex-col gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Nama Pengguna</span>
          </label>
          <input
            type="text"
            placeholder="linkmate"
            className="input input-bordered"
            disabled
          />
          <label className="label">
            <span className="label-text-alt">
              Nama pengguna tidak bisa diubah
            </span>
          </label>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Nama Lengkap</span>
          </label>
          <input
            type="text"
            placeholder="John Doe"
            className="input input-bordered"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Nomor Telepon</span>
          </label>
          <input
            type="tel"
            placeholder="+6281234567890"
            className="input input-bordered"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            placeholder="john.dower@example.com"
            className="input input-bordered"
          />
        </div>
        <button
          type="submit"
          className="btn btn-wide btn-primary self-end mt-8"
        >
          Simpan Perubahan
        </button>
      </section>
    </>
  )
}
