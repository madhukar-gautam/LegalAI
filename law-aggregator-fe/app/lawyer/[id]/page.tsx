import { fetchLawyer } from '@/lib/api'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Star, MapPin, Briefcase, BadgeCheck, ArrowLeft } from 'lucide-react'

export default async function LawyerProfile({ params }: { params: { id: string } }) {
  let lawyer
  try {
    lawyer = await fetchLawyer(params.id)
  } catch {
    notFound()
  }

  const practices = (lawyer.practiceAreas || []).join(', ')
  const rating = Number(lawyer.ratingAvg ?? 0).toFixed(1)
  const yearsExp = lawyer.yearsExp ?? 0

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <Link
        href="/search"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-accent transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to search
      </Link>

      <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-100">{lawyer.name}</h1>
              {lawyer.verified && (
                <BadgeCheck className="w-6 h-6 text-accent" aria-label="Verified" />
              )}
            </div>
            <p className="mt-1 text-slate-400">{practices || 'General practice'}</p>
            {lawyer.city && (
              <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                <MapPin className="w-4 h-4" />
                {lawyer.city}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-6 text-sm">
          <span className="flex items-center gap-1.5 text-accent">
            <Star className="w-4 h-4 fill-accent" />
            {rating} rating
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <Briefcase className="w-4 h-4" />
            {yearsExp}+ years experience
          </span>
        </div>

        <div className="mt-6 flex gap-3">
          <Link href={`/booking/${lawyer.id}`}>
            <Button>Book Consultation</Button>
          </Link>
          <Button variant="outline">Message</Button>
        </div>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-slate-100 mb-2">About</h2>
        <p className="text-slate-400 leading-7">
          {lawyer.bio ||
            'Detailed bio goes here. Areas of expertise, notable cases, languages, and fees.'}
        </p>
      </section>
    </div>
  )
}
