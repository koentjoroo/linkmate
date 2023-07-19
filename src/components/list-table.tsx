'use client'
import { useMutation, useQuery } from '@tanstack/react-query'
import { BiCopy, BiTrash } from 'react-icons/bi'
import useAxiosAuth from '@/lib/hooks/useAxiosAuth'
import { CgSpinner } from 'react-icons/cg'
import { format } from 'date-fns'

export default function ListTable() {
  const axiosAuth = useAxiosAuth()

  const query = useQuery({
    queryKey: ['links'],
    queryFn: async () => {
      const response = await axiosAuth.get('/api/links')
      if (!response?.data) {
        throw new Error('Oops! Something wrong when fetching the data.')
      }
      return response.data
    },
  })

  const mutation = useMutation(
    async (id) => {
      return await axiosAuth.delete(`/api/links/${id}`)
    },
    {
      onSuccess: (response) => {
        if (response.status === 200) {
          alert('behasil delete')
          query.refetch()
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
    alert('berhasil copy ke clipboard')
  }

  const onDelete = (link: any) => {
    mutation.mutate(link.id)
  }
  return (
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
          query.data?.map((link: any) => {
            return (
              <tr className="hover" key={link?.id}>
                <td>{format(new Date(link?.createdAt), 'MM/dd/yyyy')}</td>
                <td>{link?.urlLong}</td>
                <td>{link?.urlShort}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="tooltip" data-tip="Salin">
                      <button
                        className="btn btn-ghost btn-circle"
                        onClick={() => onCopy(link)}
                      >
                        <BiCopy className="text-xl" />
                      </button>
                    </div>
                    <div className="tooltip" data-tip="Hapus">
                      <button
                        className="btn btn-ghost btn-circle"
                        onClick={() => onDelete(link)}
                        disabled={mutation.isLoading}
                      >
                        {mutation.isLoading ? (
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
  )
}
