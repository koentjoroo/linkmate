'use client'
import { useMutation, useQuery } from '@tanstack/react-query'
import { BiCopy, BiPencil, BiPlus, BiTrash } from 'react-icons/bi'
import useAxiosAuth from '@/lib/hooks/useAxiosAuth'
import { CgSpinner } from 'react-icons/cg'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { AxiosError } from 'axios'

type FormData = {
  id: string
  urlShort: string
  urlLong: string
}

export default function ListTable() {
  const axiosAuth = useAxiosAuth()
  const { handleSubmit, register, watch, reset, setValue } = useForm<FormData>()

  const query = useQuery({
    queryKey: ['links'],
    queryFn: async () => {
      const response = await axiosAuth.get('/links')
      if (!response?.data) {
        throw new Error('Gagal mendapatkan data :(')
      }
      return response.data
    },
  })

  const editMutation = useMutation(
    async (data: FormData) => {
      const { id, ...updates } = data
      return await axiosAuth.patch(`/links/${id}`, updates)
    },
    {
      onSuccess: (response) => {
        if (response.status === 200) {
          modalRef.current?.close()
          toast.success('Link berhasil diedit')
          query.refetch()
        }
      },
      onError: (error) => {
        modalRef.current?.close()
        if (error instanceof AxiosError) {
          toast.error(error.response?.data?.error)
        } else if (error instanceof Error) {
          toast.error(error.message)
        }
      },
    }
  )

  const addMutation = useMutation(
    async (formData: FormData) => {
      const { id, ...data } = formData
      return await axiosAuth.post('/links', data)
    },
    {
      onSuccess: (response) => {
        if (response.status === 200) {
          modalRef.current?.close()
          toast.success('Link berhasil ditambahkan')
          query.refetch()
        }
      },
      onError: (error) => {
        modalRef.current?.close()
        if (error instanceof AxiosError) {
          toast.error(error.response?.data?.error)
        } else if (error instanceof Error) {
          toast.error(error.message)
        }
      },
    }
  )

  const deleteMutation = useMutation(
    async (id) => {
      return await axiosAuth.delete(`/links/${id}`)
    },
    {
      onSuccess: (response) => {
        if (response.status === 200) {
          toast.success('Link berhasil dihapus')
          query.refetch()
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

  const onCopy = async (link: any) => {
    const url = [
      process.env.NEXT_PUBLIC_SHORTLINK_BASE_URL,
      '/',
      link.urlShort,
    ].join('')
    await navigator.clipboard.writeText(url)
    toast.success('Link berhasil disalin ke papan klip')
  }

  const onClickEditLink = async (link: any) => {
    if (modalRef.current) {
      setValue('id', link.id)
      setValue('urlLong', link.urlLong)
      setValue('urlShort', link.urlShort)
      modalRef.current.showModal()
    }
  }

  const onClickAddLink = async () => {
    if (modalRef.current) {
      modalRef.current.showModal()
    }
  }

  const onFormSubmit = handleSubmit((formData: FormData) => {
    if (formData.id) {
      editMutation.mutate(formData)
    } else {
      addMutation.mutate(formData)
    }
  })

  const onDialogClose = () => {
    reset()
  }

  const onDelete = (link: any) => {
    deleteMutation.mutate(link.id)
  }

  const modalRef = useRef<HTMLDialogElement>(null)

  return (
    <>
      <dialog
        id="edit"
        className="modal"
        ref={modalRef}
        onClose={onDialogClose}
      >
        <form method="dialog" className="modal-box" onSubmit={onFormSubmit}>
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
            onClick={() => modalRef.current?.close()}
          >
            ✕
          </button>
          <h3 className="font-bold text-lg">
            {watch('id') ? 'Edit Link' : 'Tambah Link'}
          </h3>
          <div className="flex flex-col gap-4 my-4">
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
          </div>
          <div className="modal-action">
            <button
              type="button"
              className="btn btn-error btn-outline"
              onClick={() => modalRef.current?.close()}
            >
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              {watch('id') ? 'Edit' : 'Tambah'}
            </button>
          </div>
        </form>
      </dialog>
      <div className="flex flex-row-reverse p-2">
        <button className="btn btn-primary" onClick={onClickAddLink}>
          <BiPlus />
          Tambah Link
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Tanggal</th>
            <th>Link Panjang</th>
            <th>Link Pendek</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {query.isLoading && (
            <tr>
              <td colSpan={100}>
                <span className="flex justify-center">
                  <CgSpinner className="text-2xl animate-spin" />
                </span>
              </td>
            </tr>
          )}
          {!query.isLoading && !query.data?.length && (
            <tr>
              <td colSpan={100} className="text-center">
                No Data
              </td>
            </tr>
          )}
          {!query.isLoading &&
            !query.isError &&
            query.data?.map((link: any) => {
              return (
                <tr className="hover" key={link?.id}>
                  <td>{format(new Date(link?.createdAt), 'MM/dd/yyyy')}</td>
                  <td>{link?.urlLong}</td>
                  <td>{link?.urlShort}</td>
                  <td>
                    <div className="flex items-center">
                      <div className="tooltip" data-tip="Salin">
                        <button
                          className="btn btn-ghost btn-circle"
                          onClick={() => onCopy(link)}
                        >
                          <BiCopy className="text-xl" />
                        </button>
                      </div>
                      <div className="tooltip" data-tip="Ubah">
                        <button
                          className="btn btn-ghost btn-circle"
                          onClick={() => onClickEditLink(link)}
                        >
                          <BiPencil className="text-xl" />
                        </button>
                      </div>
                      <div className="tooltip" data-tip="Hapus">
                        <button
                          className="btn btn-ghost btn-circle"
                          onClick={() => onDelete(link)}
                          disabled={deleteMutation.isLoading}
                        >
                          {deleteMutation.isLoading ? (
                            <CgSpinner className="text-xl" />
                          ) : (
                            <BiTrash className="text-xl" />
                          )}
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              )
            })}
        </tbody>
      </table>
    </>
  )
}
