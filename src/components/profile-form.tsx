'use client'

import useAxiosAuth from '@/lib/hooks/useAxiosAuth'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { signOut, useSession } from 'next-auth/react'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { CgSpinner } from 'react-icons/cg'

type FormData = {
  name: string
  fullName: string
  phoneNumber: string
  email: string
}

type PasswordFormData = {
  oldPassword?: string
  newPassword: string
  confirmPassword: string
}

export default function ProfileForm() {
  const { data: session } = useSession()
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

  const {
    handleSubmit: handlePasswordFormSubmit,
    register: registerPasswordForm,
    formState: { errors },
    reset: resetPasswordForm,
    setError,
    setFocus,
  } = useForm<PasswordFormData>()

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

  const changePasswordMutation = useMutation(
    (formData: Omit<PasswordFormData, 'confirmPassword'>) => {
      return axiosAuth.patch('/user/password', formData)
    },
    {
      onSuccess: (response) => {
        if (response.status === 200) {
          modalRef.current?.close()
          resetPasswordForm()
          signOut({
            callbackUrl: '/auth/signin?redirect=change_password_success',
            redirect: true,
          })
        }
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data?.error)
        } else if (error instanceof Error) {
          toast.error(error.message)
        }
      },
    }
  )

  const onSubmit = handleSubmit((formData) => {
    const { fullName, phoneNumber, email } = formData
    mutation.mutate({ fullName, phoneNumber, email })
  })

  const onSubmitChangePassword = handlePasswordFormSubmit((formData) => {
    if (formData.confirmPassword !== formData.newPassword) {
      setError('confirmPassword', { message: 'Kata sandi tidak sama' })
      setFocus('confirmPassword')
      return
    }

    const { confirmPassword, ...data } = formData
    changePasswordMutation.mutate(data)
  })

  const onDialogClose = () => {}

  const modalRef = useRef<HTMLDialogElement>(null)

  return (
    <>
      <dialog
        id="changePassword"
        className="modal"
        ref={modalRef}
        onClose={onDialogClose}
      >
        <form
          method="dialog"
          className="modal-box"
          onSubmit={onSubmitChangePassword}
        >
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
            onClick={() => modalRef.current?.close()}
          >
            ✕
          </button>
          <h3 className="font-bold text-lg">Ubah Password</h3>
          <div className="flex flex-col gap-4 my-4">
            {session?.user?.setPassword && (
              <div>
                <div className="label">
                  <span className="label-text-alt">Password Lama</span>
                </div>
                <input
                  className="input input-bordered w-full"
                  type="password"
                  placeholder="Masukkan password lama kamu"
                  {...registerPasswordForm('oldPassword')}
                />
              </div>
            )}
            <div>
              <div className="label">
                <span className="label-text-alt">Password Baru</span>
              </div>
              <input
                className="input input-bordered join-item w-full"
                type="password"
                placeholder="Masukkan password baru kamu"
                {...registerPasswordForm('newPassword', { minLength: 6 })}
              />
            </div>
            <div className="form-control">
              <div className="label">
                <span className="label-text-alt">Konfirmasi Password Baru</span>
              </div>
              <input
                className="input input-bordered join-item w-full"
                type="password"
                placeholder="Konfirmasi password baru kamu"
                {...registerPasswordForm('confirmPassword', { minLength: 6 })}
              />
              {errors?.confirmPassword?.message && (
                <div className="label">
                  <span className="label-text-alt text-error">
                    {errors.confirmPassword.message}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="modal-action">
            <button
              type="button"
              className="btn btn-error btn-outline"
              onClick={() => modalRef.current?.close()}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={changePasswordMutation.isLoading}
            >
              {changePasswordMutation.isLoading && (
                <CgSpinner className="animate-spin" />
              )}
              Ubah
            </button>
          </div>
        </form>
      </dialog>
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
        <div className="flex justify-center mt-8 gap-4">
          <button
            type="button"
            className="btn btn-wide btn-warning"
            onClick={() => modalRef.current?.showModal()}
          >
            Ubah Password
          </button>
          <button type="submit" className="btn btn-wide btn-primary-8">
            Simpan Perubahan
          </button>
        </div>
      </form>
    </>
  )
}
