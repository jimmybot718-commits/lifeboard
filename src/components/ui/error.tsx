'use client'

export function ErrorCard({ 
  title = "Une erreur s'est produite",
  message,
  retry
}: { 
  title?: string
  message?: string
  retry?: () => void 
}) {
  return (
    <div className="bg-red-900/20 border border-red-500 p-6 rounded-lg">
      <div className="space-y-3">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-red-400 font-semibold">{title}</h3>
            {message && (
              <p className="text-red-300 text-sm mt-1">{message}</p>
            )}
          </div>
        </div>
        {retry && (
          <button
            onClick={retry}
            className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
          >
            Réessayer
          </button>
        )}
      </div>
    </div>
  )
}

export function ErrorPage({ 
  title = "Une erreur s'est produite",
  message = "Nous rencontrons des difficultés techniques. Veuillez réessayer plus tard.",
  retry
}: {
  title?: string
  message?: string
  retry?: () => void
}) {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <ErrorCard title={title} message={message} retry={retry} />
      </div>
    </div>
  )
}
