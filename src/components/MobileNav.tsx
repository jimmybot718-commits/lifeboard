'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  const links = [
    { href: '/', label: 'Dashboard' },
    { href: '/schedule', label: 'Planning' },
    { href: '/nastia', label: '🎬 Nastia' },
    { href: '/projects', label: 'Projets' },
    { href: '/tasks', label: 'Tasks' },
    { href: '/videos', label: 'Videos' },
    { href: '/emails', label: 'Emails' },
    { href: '/stats', label: 'Stats' },
  ]

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-2 rounded-lg hover:bg-slate-700 transition-colors"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Desktop Nav (hidden on mobile) */}
      <nav className="hidden lg:flex gap-4">
        {links.slice(1).map(link => (
          <Link
            key={link.href}
            href={link.href}
            className="hover:text-blue-400 transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-slate-800 border-b border-slate-700 shadow-xl z-50">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="px-4 py-3 rounded-lg hover:bg-slate-700 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Overlay (close menu when clicking outside) */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
