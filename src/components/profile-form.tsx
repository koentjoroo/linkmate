'use client'

import useAxiosAuth from '@/lib/hooks/useAxiosAuth'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

type FormData = {
  name: string
  fullName: string
  phoneNumber: string
  email: string
}

export default function ProfileForm() {
  const axiosAuth = useAxiosAuth()
  const { handleSubmit, register } = useForm<FormData>({
    defaultValues: async () => {
      const response = await axiosAuth.get('/user')
      if (!response?.data) {
        return null
      }
      return response.data
    },
  })

  const mutation = useMutation(
    (formData: Omit<FormData, 'name'>) => {
      return axiosAuth.post('/user', formData)
    },
    {
      onSuccess: (response) => {
        if (response.status === 200) {
          toast.success('Profil berhasil diperbarui!')
        }
      },
    }
  )

  const onSubmit = handleSubmit((formData) => {
    const { fullName, phoneNumber, email } = formData
    mutation.mutate({ fullName, phoneNumber, email })
  })

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Nama Pengguna</span>
        </label>
        <input
          type="text"
          placeholder="linkmate"
          className="input input-bordered"
          disabled
          {...register('name')}
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
          {...register('fullName')}
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
          {...register('phoneNumber')}
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
          {...register('email')}
        />
      </div>
      <button type="submit" className="btn btn-wide btn-primary self-end mt-8">
        Simpan Perubahan
      </button>
    </form>
  )
}
