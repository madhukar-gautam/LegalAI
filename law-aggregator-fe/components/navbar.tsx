import Link from 'next/link'
import { Logo } from './logo'

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-surface/95 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center font-semibold text-slate-100 hover:text-accent transition-colors"
        >
          <Logo size="md" />
        </Link>
        <nav className="flex items-center gap-8">
          <Link
            href="/search"
            className="text-sm text-slate-400 hover:text-slate-100 transition-colors"
          >
            Find Lawyers
          </Link>
          <Link
            href="/register"
            className="text-sm text-slate-400 hover:text-slate-100 transition-colors"
          >
            Register
          </Link>
        </nav>
      </div>
    </header>
  )
}
