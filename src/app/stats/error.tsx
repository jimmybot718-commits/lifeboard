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
    console.error('Stats page error:', error)
  }, [error])

  return (
    <ErrorPage
      title="Erreur de chargement des stats"
      message={error.message || "Impossible de charger les statistiques. Veuillez réessayer."}
      retry={reset}
    />
  )
}
