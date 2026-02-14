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
    console.error('Nastia page error:', error)
  }, [error])

  return (
    <ErrorPage
      title="Erreur de chargement"
      message={error.message || "Impossible de charger les données de Nastia. Veuillez réessayer."}
      retry={reset}
    />
  )
}
