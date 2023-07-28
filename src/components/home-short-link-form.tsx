'use client'

import useAxiosAuth from '@/lib/hooks/useAxiosAuth'
import { Player } from '@lottiefiles/react-lottie-player'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { BiCopy } from 'react-icons/bi'
import { CgSpinner } from 'react-icons/cg'

type FormData = {
  urlLong: string
  urlShort: string
}

export default function HomeShortLinkForm() {
  const [link, setLink] = useState<string>('')

  const axiosAuth = useAxiosAuth()
  const { register, handleSubmit, setValue } = useForm<FormData>()

  const mutation = useMutation(
    async (formData: FormData) => {
      return await axiosAuth.post('/links', formData)
    },
    {
      onSuccess: (response) => {
        setLink(shapeLink(response.data.urlShort))
        toast.success('Berhasil memperpendek link!')
      },
      onError: (error) => {
        setLink('')
        if (error instanceof AxiosError) {
          toast.error(String(error.response?.data?.error))
        } else if (error instanceof Error) {
          toast.error(String(error.message))
        }
      },
    }
  )

  const onSubmit = handleSubmit((data) => {
    setLink('')
    mutation.mutate(data)
  })

  const onCopy = async () => {
    await navigator.clipboard.writeText(link)
    toast.success('Link telah disalin ke papan klip!')
  }

  const shapeLink = (shortUrl: string) => {
    return [process.env.NEXT_PUBLIC_SHORTLINK_BASE_URL, '/', shortUrl].join('')
  }

  const inputRef = useRef<HTMLInputElement | null>(null)
  const params = useSearchParams()

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = link
    }

    if (params.get('urlShort') && params.get('urlLong')) {
      setValue('urlShort', params.get('urlShort') ?? '')
      setValue('urlLong', params.get('urlLong') ?? '')
    }

    return () => {}
  }, [link])

  return (
    <>
      <div className="hero-content flex-col-reverse lg:flex-row w-full container mx-auto p-16">
        <div>
          <article className="prose prose-2xl">
            <h1>Perpendek link dengan sekali klik!</h1>
            <p>Deskripsi singkat mengenai short link uhuy</p>
          </article>
          <div className="mt-4">
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
                  {process.env.NEXT_PUBLIC_SHORTLINK_BASE_URL}/
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
              {!mutation.isLoading && mutation.isSuccess && link && (
                <div
                  className="relative w-1/2 flex items-center tooltip tooltip-right"
                  data-tip="Salin Link"
                >
                  <input
                    className="input input-bordered w-full"
                    readOnly
                    type="text"
                    value={link}
                    onClick={onCopy}
                  />
                  <button
                    type="button"
                    onClick={onCopy}
                    className="absolute right-0 btn btn-ghost"
                  >
                    <BiCopy className="text-xl" />
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
        <div
          className={`ml-8 card flex-shrink-0 w-full max-w-sm ${
            mutation.isSuccess
              ? 'bg-success text-success-content shadow-2xl shadow-success'
              : mutation.isError
              ? 'bg-error text-error-content shadow-2xl shadow-error'
              : ''
          }`}
        >
          <Player
            autoplay
            loop
            src="https://assets5.lottiefiles.com/packages/lf20_1cazwtnc.json"
          ></Player>
        </div>
      </div>
    </>
  )
}
