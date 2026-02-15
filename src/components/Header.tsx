'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navLinks = [
  { href: '/', label: 'Dashboard', icon: '◎' },
  { href: '/schedule', label: 'Schedule', icon: '◷' },
  { href: '/tasks', label: 'Tasks', icon: '☑' },
  { href: '/projects', label: 'Projects', icon: '◈' },
  { href: '/goals', label: 'Goals', icon: '◉' },
  { href: '/stats', label: 'Stats', icon: '◫' },
]

const secondaryLinks = [
  { href: '/videos', label: 'Videos' },
  { href: '/emails', label: 'Emails' },
  { href: '/activity', label: 'Activity' },
  { href: '/nastia', label: 'Nastia' },
]

export default function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-carbon-950/80 border-b border-white/[0.05]">
      <div className="container mx-auto px-4 max-w-[1600px]">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-blue flex items-center justify-center">
              <span className="text-carbon-950 font-bold text-lg">L</span>
            </div>
            <span className="text-xl font-bold tracking-tight">
              Life<span className="text-gradient-cyan">Board</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive
                      ? 'text-white bg-white/[0.08]'
                      : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
                    }
                  `}
                >
                  <span className="flex items-center gap-2">
                    <span className={`text-xs ${isActive ? 'text-neon-cyan' : 'opacity-50'}`}>
                      {link.icon}
                    </span>
                    {link.label}
                  </span>
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-transparent via-neon-cyan to-transparent" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Secondary Links & More */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2">
              {secondaryLinks.slice(0, 2).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    px-3 py-1.5 rounded-md text-xs font-medium transition-colors
                    ${pathname === link.href
                      ? 'text-white/80 bg-white/[0.06]'
                      : 'text-white/40 hover:text-white/60'
                    }
                  `}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Time Display */}
            <TimeDisplay />

            {/* Help Link */}
            <Link
              href="/help"
              className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] flex items-center justify-center text-white/40 hover:text-white/60 transition-colors text-sm"
            >
              ?
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-10 h-10 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] flex items-center justify-center transition-colors"
            aria-label="Toggle menu"
          >
            <div className="flex flex-col gap-1">
              <span className={`block w-5 h-0.5 bg-white/60 transition-transform ${mobileOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`block w-5 h-0.5 bg-white/60 transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-white/60 transition-transform ${mobileOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="lg:hidden absolute top-16 left-0 right-0 bg-carbon-900 border-b border-white/[0.05] z-50 animate-slide-up">
            <nav className="container mx-auto px-4 py-4 space-y-1">
              {[...navLinks, ...secondaryLinks].map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`
                      block px-4 py-3 rounded-lg text-sm font-medium transition-colors
                      ${isActive
                        ? 'text-white bg-white/[0.08]'
                        : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                      }
                    `}
                  >
                    {'icon' in link && (
                      <span className={`mr-2 ${isActive ? 'text-neon-cyan' : 'opacity-50'}`}>
                        {link.icon}
                      </span>
                    )}
                    {link.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </>
      )}
    </header>
  )
}

function TimeDisplay() {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05]">
      <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
      <span className="text-xs font-mono text-white/50">
        {new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
      </span>
    </div>
  )
}
