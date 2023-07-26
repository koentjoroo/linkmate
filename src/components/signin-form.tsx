'use client'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { CgSpinner } from 'react-icons/cg'
import { useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { useEffect, useMemo } from 'react'
import { FcInfo } from 'react-icons/fc'
import GoogleSignInButton from './google-signin-button'

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

  const callbackUrl = useMemo(() => {
    const url = params.get('callbackUrl') || '/'
    const newParams = new URLSearchParams()
    newParams.append('urlShort', params.get('urlShort') ?? '')
    newParams.append('urlLong', params.get('urlLong') ?? '')
    if (url === '/') {
      return url + '?' + newParams.toString()
    }
    return url
  }, [params])

  const mutation = useMutation(
    async (formData: FormData) => {
      await signIn('credentials', {
        username: formData.username,
        password: formData.password,
        redirect: true,
        callbackUrl,
      }).then((callback) => {
        if (callback?.error) {
          toast.error(callback.error)
        }
        if (callback?.ok && !callback?.error) {
          toast.success('Berhasil Masuk!')
        }
      })
    },
    {
      onError: (error) => {
        if (error instanceof Error) {
          toast.error(error.message)
        }
      },
    }
  )

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data)
  })

  useEffect(() => {
    const type = params.get('redirect')
    if (type === 'signup_success') {
      toast.success('Pendaftaran Berhasil! Silahkan Masuk!')
    }
    if (type === 'session_expired') {
      toast.error('Sesimu telah habis. Mohon masuk kembali.')
    }
    if (type === 'change_password_success') {
      toast.success('Password kamu berhasil diubah! Silahkan login kembali', {
        duration: 2000,
      })
    }
    if (type === 'unauthenticated') {
      toast('Silahkan login terlebih dahulu', {
        icon: <FcInfo />,
      })
    }
  }, [params])

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
        <div className="flex items-center gap-4">
          <span className="h-[2px] rounded-full flex-1 bg-neutral-focus"></span>
          <span>Atau</span>
          <span className="h-[2px] rounded-full flex-1 bg-neutral-focus"></span>
        </div>
        <GoogleSignInButton />
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
