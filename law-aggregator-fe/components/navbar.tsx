import Link from 'next/link'
import { Scale } from 'lucide-react'

export function Navbar() {
  const name = process.env.NEXT_PUBLIC_APP_NAME || 'Lexify'
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-surface/95 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-semibold text-slate-100 hover:text-accent transition-colors"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/20 text-accent">
            <Scale className="w-5 h-5" />
          </div>
          {name}
        </Link>
        <nav className="flex items-center gap-8">
          <Link
            href="/search"
            className="text-sm text-slate-400 hover:text-slate-100 transition-colors"
          >
            Find Lawyers
          </Link>
        </nav>
      </div>
    </header>
  )
}
