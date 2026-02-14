'use client'

import { useEffect } from 'react'
import { ErrorPage } from '@/components/ui/error'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Page error:', error)
  }, [error])

  return (
    <ErrorPage
      title="Erreur de chargement"
      message={error.message || "Une erreur s'est produite lors du chargement de la page."}
      retry={reset}
    />
  )
}
