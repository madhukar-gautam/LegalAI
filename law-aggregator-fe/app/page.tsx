'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Scale, ArrowRight } from 'lucide-react'

const PRACTICES = ['Property', 'Family', 'Criminal', 'Corporate', 'IP', 'Tax']

export default function HomePage() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set('practice', query.trim())
    router.push(`/search${params.toString() ? `?${params}` : ''}`)
  }

  return (
    <div className="relative">
      {/* Hero - split layout */}
      <section className="relative min-h-[85vh] flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        <div className="flex-1 space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/50 bg-slate-800/30 px-4 py-1.5 text-sm text-slate-300">
            <Scale className="w-4 h-4 text-accent" />
            <span>Trusted legal marketplace</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            Find the right
            <br />
            <span className="text-gradient-gold">lawyer for you</span>
          </h1>

          <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
            Search by practice area, city, or experience. Connect with verified lawyers and book consultations in minutes.
          </p>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-xl">
            <Input
              placeholder="Practice area, city, or keyword…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-14 text-base bg-slate-800/50 border-slate-600 placeholder:text-slate-500 focus:border-accent focus:ring-accent/30"
            />
            <Button type="submit" size="lg" className="h-14 px-8 shrink-0">
              <Search className="w-5 h-5 mr-2" />
              Search
            </Button>
          </form>
        </div>

        {/* Right side - visual block */}
        <div className="flex-1 hidden lg:block relative">
          <div className="absolute inset-0 rounded-3xl border border-slate-700/50 bg-slate-800/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-600/30 text-9xl font-serif">
              ⚖
            </div>
          </div>
        </div>
      </section>

      {/* Practice areas */}
      <section className="mt-24 pt-16 border-t border-slate-800">
        <h2 className="text-2xl font-bold mb-8">Browse by practice area</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {PRACTICES.map((area) => (
            <Link
              key={area}
              href={`/search?practice=${encodeURIComponent(area)}`}
              className="group flex items-center justify-between rounded-xl border border-slate-700/50 bg-slate-800/30 px-5 py-4 hover:border-accent/50 hover:bg-slate-800/50 transition-all"
            >
              <span className="font-medium text-slate-200 group-hover:text-accent transition-colors">{area}</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-accent group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
