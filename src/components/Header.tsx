import Link from 'next/link'
import MobileNav from './MobileNav'

export default function Header() {
  return (
    <header className="border-b border-slate-700 p-4 sticky top-0 bg-slate-900/95 backdrop-blur-sm z-30">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:text-blue-400 transition-colors">
          LifeBoard
        </Link>
        <MobileNav />
      </div>
    </header>
  )
}
