'use client'
import axios from '@/lib/axios'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import GoogleSignInButton from './google-signin-button'
import { useRouter } from 'next/navigation'
import { CgSpinner } from 'react-icons/cg'

type FormData = {
  email: string
  username: string
  password: string
}

export function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const router = useRouter()

  const mutation = useMutation(
    (formData: FormData) => {
      return axios.post('/auth/register', formData)
    },
    {
      onSuccess: (response) => {
        if (response.status === 200) {
          router.push('/auth/signin?redirect=signup_success')
        }
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
          type="email"
          className="input input-primary input-bordered"
          placeholder="Email"
          aria-invalid={errors?.email ? 'true' : 'false'}
          {...register('email', { required: true })}
        />
      </div>
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
          {mutation.isLoading ? 'Loading...' : 'Daftar'}
        </button>
        <div className="flex items-center gap-4">
          <span className="h-[2px] rounded-full flex-1 bg-neutral-focus"></span>
          <span>Atau</span>
          <span className="h-[2px] rounded-full flex-1 bg-neutral-focus"></span>
        </div>
        <GoogleSignInButton />
        <p>
          Sudah punya akun?{' '}
          <Link href="/auth/signin" className="font-bold link-primary">
            Masuk
          </Link>
        </p>
      </div>
    </form>
  )
}
