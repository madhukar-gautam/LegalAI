'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { fetchCities, fetchPracticeAreas } from '@/lib/api'
import { Search, Scale, ArrowRight, Briefcase, BadgeCheck } from 'lucide-react'

const FALLBACK_PRACTICES = ['Property Law', 'Family Law', 'Criminal Law', 'Corporate Law', 'Tax Law', 'Immigration']

export default function HomePage() {
  const router = useRouter()
  const [practice, setPractice] = useState('')
  const [city, setCity] = useState('')
  const [expGte, setExpGte] = useState('')
  const [practices, setPractices] = useState<string[]>(FALLBACK_PRACTICES)
  const [cities, setCities] = useState<string[]>([])

  useEffect(() => {
    let mounted = true

    fetchPracticeAreas()
      .then((data) => {
        if (!mounted) return
        if (Array.isArray(data) && data.length > 0) {
          setPractices(data)
        }
      })
      .catch(() => {
        if (mounted) setPractices(FALLBACK_PRACTICES)
      })

    fetchCities()
      .then((data) => {
        if (!mounted) return
        if (Array.isArray(data)) {
          setCities(data)
        }
      })
      .catch(() => {
        if (mounted) setCities([])
      })

    return () => {
      mounted = false
    }
  }, [])

  const featuredPractices = useMemo(() => practices.slice(0, 6), [practices])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (practice.trim()) params.set('practice', practice.trim())
    if (city.trim()) params.set('city', city.trim())
    const exp = Math.max(0, parseInt(expGte || '0', 10) || 0)
    if (exp > 0) params.set('expGte', String(exp))
    router.push(`/search${params.toString() ? `?${params}` : ''}`)
  }

  return (
    <div className="relative">
      <section className="relative min-h-[78vh] grid items-center gap-10 lg:grid-cols-2">
        <div className="space-y-7 animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/50 bg-slate-800/30 px-4 py-1.5 text-sm text-slate-300">
            <Scale className="w-4 h-4 text-accent" />
            <span>LegalAI - Trusted legal marketplace</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            Find the right
            <br />
            <span className="text-gradient-gold">lawyer for you</span>
          </h1>

          <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
            Search by practice area, city, and experience. Connect with verified lawyers and book consultations in minutes.
          </p>

          <form onSubmit={handleSearch} className="rounded-2xl border border-slate-700/60 bg-slate-800/35 p-4 sm:p-5">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Select
                value={practice}
                onChange={setPractice}
                options={['', ...practices]}
                className="h-12"
              />
              <Input
                list="city-options"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="h-12 bg-slate-800/50 border-slate-600"
              />
              <Input
                type="number"
                min={0}
                placeholder="Min years exp"
                value={expGte}
                onChange={(e) => setExpGte(e.target.value)}
                className="h-12 bg-slate-800/50 border-slate-600"
              />
            </div>
            <datalist id="city-options">
              {cities.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            <div className="mt-3 flex justify-end">
              <Button type="submit" size="lg" className="h-12 px-7">
                <Search className="w-5 h-5 mr-2" />
                Find lawyers
              </Button>
            </div>
          </form>

          <div>
            <h2 className="text-lg font-semibold mb-3">Browse by practice area</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl">
              {featuredPractices.map((area) => (
                <Link
                  key={area}
                  href={`/search?practice=${encodeURIComponent(area)}`}
                  className="group flex items-center justify-between rounded-xl border border-slate-700/50 bg-slate-800/30 px-4 py-3 hover:border-accent/50 hover:bg-slate-800/50 transition-all"
                >
                  <span className="text-sm font-medium text-slate-200 group-hover:text-accent transition-colors">{area}</span>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden lg:block relative h-[460px] -translate-y-8">
          <div className="absolute inset-0 rounded-3xl border border-slate-700/50 bg-slate-800/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/15 via-slate-900/10 to-transparent" />
            <div className="absolute inset-0 bg-grid-pattern opacity-35" />
            <div className="absolute left-1/2 top-[44%] h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-3xl hero-pulse" />

            <div className="hero-orbit absolute left-1/2 top-[44%] h-[310px] w-[310px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/20">
              <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_18px_rgba(251,191,36,0.8)]" />
              <span className="absolute left-1/2 top-full h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-300/80" />
            </div>

            <div className="hero-float absolute top-[44%] left-1/2 flex h-44 w-44 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-slate-500/40 bg-slate-900/40 backdrop-blur-sm">
              <Scale className="h-20 w-20 text-amber-300/80" />
            </div>

            <div className="absolute left-8 top-10 rounded-xl border border-slate-600/50 bg-slate-900/60 px-3 py-2 text-slate-200 hero-float">
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="h-4 w-4 text-accent" />
                <span>Lawyer</span>
              </div>
            </div>

            <div className="absolute right-8 top-16 rounded-xl border border-slate-600/50 bg-slate-900/60 px-3 py-2 text-slate-200 hero-float" style={{ animationDelay: '0.8s' }}>
              <div className="flex items-center gap-2 text-sm">
                <BadgeCheck className="h-4 w-4 text-accent" />
                <span>Judge</span>
              </div>
            </div>

            <div className="absolute right-14 top-36 rounded-xl border border-slate-600/50 bg-slate-900/60 px-3 py-2 text-slate-200 hero-float" style={{ animationDelay: '1.1s' }}>
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="h-4 w-4 text-accent" />
                <span>Constitution</span>
              </div>
            </div>

            <div className="absolute left-12 bottom-24 rounded-xl border border-slate-600/50 bg-slate-900/60 px-3 py-2 text-slate-200 hero-float" style={{ animationDelay: '1.6s' }}>
              <div className="flex items-center gap-2 text-sm">
                <Scale className="h-4 w-4 text-accent" />
                <span>Courtroom</span>
              </div>
            </div>

            <div className="absolute right-10 bottom-20 rounded-xl border border-slate-600/50 bg-slate-900/60 px-3 py-2 text-slate-200 hero-float" style={{ animationDelay: '2.4s' }}>
              <div className="flex items-center gap-2 text-sm">
                <Scale className="h-4 w-4 text-accent" />
                <span>Justice</span>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
          </div>
        </div>
      </section>
    </div>
  )
}
