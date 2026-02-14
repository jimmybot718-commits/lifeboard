export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4'
  }

  return (
    <div className={`animate-spin rounded-full border-slate-200 border-t-blue-500 ${sizeClasses[size]}`} />
  )
}

export function LoadingCard({ title }: { title?: string }) {
  return (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <LoadingSpinner size="lg" />
        {title && <p className="text-slate-400 text-sm">{title}</p>}
      </div>
    </div>
  )
}

export function LoadingPage({ title = "Chargement..." }: { title?: string }) {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-slate-400">{title}</p>
      </div>
    </div>
  )
}

export function LoadingTable({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-slate-800 rounded animate-pulse" />
      ))}
    </div>
  )
}
