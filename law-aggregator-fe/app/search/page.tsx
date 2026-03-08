'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { fetchLawyers, fetchPracticeAreas } from '@/lib/api'
import { SearchFilters } from '@/components/search-filters'
import { LawyerCard } from '@/components/lawyer-card'
import { FileQuestion } from 'lucide-react'

type QueryState = { city: string; practice: string; expGte: number }

function parseQueryFromUrl(searchParams: URLSearchParams): QueryState {
  return {
    city: searchParams.get('city') ?? '',
    practice: searchParams.get('practice') ?? '',
    expGte: Math.max(0, parseInt(searchParams.get('expGte') ?? '0', 10) || 0),
  }
}

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [items, setItems] = useState<any[]>([])
  const [practices, setPractices] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState<QueryState>(() => parseQueryFromUrl(searchParams))

  useEffect(() => {
    setQuery(parseQueryFromUrl(searchParams))
  }, [searchParams])

  const fetchResults = useCallback(async (q: QueryState) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchLawyers(q)
      setItems(data?.content ?? data?.items ?? data ?? [])
    } catch {
      setError('Failed to load lawyers. Please try again.')
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let mounted = true
    fetchPracticeAreas()
      .then((data) => {
        if (mounted) setPractices(data || [])
      })
      .catch(() => {
        if (mounted) setPractices([])
      })
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    fetchResults(query)
  }, [query.city, query.practice, query.expGte, fetchResults])

  const updateQuery = useCallback((updates: Partial<QueryState>) => {
    setQuery((prev) => {
      const next = { ...prev, ...updates }
      const params = new URLSearchParams()
      if (next.city) params.set('city', next.city)
      if (next.practice) params.set('practice', next.practice)
      if (next.expGte > 0) params.set('expGte', String(next.expGte))
      router.replace(`/search${params.toString() ? `?${params}` : ''}`, { scroll: false })
      return next
    })
  }, [router])

  return (
    <div className="grid grid-cols-12 gap-8 animate-fade-in">
      <aside className="col-span-12 lg:col-span-3">
        <SearchFilters value={query} onChange={updateQuery} practices={practices} />
      </aside>

      <section className="col-span-12 lg:col-span-9 space-y-6">
        {loading && (
          <div className="flex items-center gap-3 py-16 text-slate-400">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-600 border-t-accent" />
            <span>Searching lawyers…</span>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-4 text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-8">
              <FileQuestion className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-200">No lawyers found</h3>
              <p className="mt-2 text-slate-500">Try adjusting your filters or search in a different area.</p>
            </div>
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 animate-slide-up">
            {items.map((l, i) => (
              <div key={l.id} style={{ animationDelay: `${i * 50}ms` }}>
                <LawyerCard lawyer={l} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-accent" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  )
}
