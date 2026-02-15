export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3'
  }

  return (
    <div className={`animate-spin rounded-full border-white/20 border-t-neon-cyan ${sizeClasses[size]}`} />
  )
}

export function LoadingCard({ title }: { title?: string }) {
  return (
    <div className="glass-card p-6">
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <LoadingSpinner size="lg" />
        {title && <p className="text-white/40 text-sm">{title}</p>}
      </div>
    </div>
  )
}

export function LoadingPage({ title = "Loading..." }: { title?: string }) {
  return (
    <div className="min-h-screen bg-carbon-950 flex items-center justify-center">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-white/40">{title}</p>
      </div>
    </div>
  )
}

export function LoadingTable({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-white/[0.03] rounded-lg animate-pulse" />
      ))}
    </div>
  )
}
