'use client'

import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { CgSpinner } from 'react-icons/cg'

type FormData = {
  urlLong: string
  urlShort: string
}

export default function HomeShortLinkForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const router = useRouter()
  const { data: session } = useSession()

  const mutation = useMutation(async (formData: FormData) => {
    const response = await axios.post('/api/links', formData, {
      headers: {
        Authorization: session?.user?.accessToken,
      },
    })
    if (response.status === 401) {
      router.push('/auth/signin')
    }
    if (!response?.data) {
      toast.error('Oops! Something wrong when shortening your URL.')
      return
    }
    toast.success('Successfully shortened the URL!')
  })

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data)
  })

  return (
    <>
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <div>
          <input
            className="input input-bordered w-full"
            type="text"
            placeholder="Masukkan link panjangmu"
            {...register('urlLong')}
          />
        </div>
        <div className="join">
          <span className="join-item p-3 bg-primary text-primary-content">
            linkmate/
          </span>
          <input
            className="input input-bordered join-item w-full"
            type="text"
            placeholder="Masukkan nama linkmu"
            {...register('urlShort', { minLength: 3 })}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary btn-wide"
          disabled={mutation.isLoading}
        >
          {mutation.isLoading && <CgSpinner className="animate-spin" />}
          {mutation.isLoading ? 'Memuat...' : 'Potong!'}
        </button>
      </form>
    </>
  )
}
