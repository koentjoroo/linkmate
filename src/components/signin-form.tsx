'use client'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { CgSpinner } from 'react-icons/cg'
import { useSearchParams } from 'next/navigation'

type FormData = {
  username: string
  password: string
}

export function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const params = useSearchParams()

  const mutation = useMutation(
    async (formData: FormData) => {
      await signIn('credentials', {
        username: formData.username,
        password: formData.password,
        redirect: true,
        callbackUrl: params.get('callbackUrl') || '/dashboard',
      })
    },
    {
      onError: (error) => {
        alert(error)
      },
    }
  )

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data)
  })

  return (
    <form
      className="mx-auto max-w-xs w-full flex flex-col gap-8"
      onSubmit={onSubmit}
    >
      <div className="form-control w-full">
        <input
          type="text"
          className="input input-primary input-bordered"
          placeholder="Nama Pengguna"
          aria-invalid={errors?.username ? 'true' : 'false'}
          {...register('username', { required: true })}
        />
        {errors?.username && (
          <label className="label">
            {errors?.username && (
              <span className="label-text text-error">
                Nama pengguna dibutuhkan
              </span>
            )}
          </label>
        )}
      </div>
      <div className="form-control w-full">
        <input
          type="password"
          className="input input-primary input-bordered"
          placeholder="Kata Sandi"
          aria-invalid={errors?.password ? 'true' : 'false'}
          {...register('password', { required: true, minLength: 6 })}
        />
        <label className="label">
          <span className="label-text">Kata sandi minimal 6 karakter</span>
        </label>
      </div>
      <div className="flex flex-col gap-4 text-center">
        <button
          type="submit"
          className="btn btn-outline rounded-full w-48 mx-auto"
          disabled={mutation.isLoading}
        >
          {mutation.isLoading && <CgSpinner className="animate-spin" />}
          {mutation.isLoading ? 'Memuat...' : 'Masuk'}
        </button>
        <p>
          Tidak punya akun?{' '}
          <Link href="/auth/signup" className="font-bold link-primary">
            Daftar
          </Link>
        </p>
      </div>
    </form>
  )
}
