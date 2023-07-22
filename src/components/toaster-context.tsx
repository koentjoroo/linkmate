'use client'

import { Toaster } from 'react-hot-toast'

export default function ToasterContext() {
  return (
    <div>
      <Toaster
        containerStyle={{
          zIndex: 100,
        }}
        toastOptions={{
          style: {
            padding: '1rem 2rem',
            borderRadius: '1rem',
          },
        }}
      />
    </div>
  )
}
