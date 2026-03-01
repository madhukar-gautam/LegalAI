import Link from 'next/link'
import { Card, CardContent, CardHeader } from './ui/card'
import { Star, MapPin, BadgeCheck } from 'lucide-react'
import { Button } from './ui/button'

export function LawyerCard({ lawyer }: { lawyer: any }) {
  const practices = (lawyer.practiceAreas || []).join(', ')
  const rating = Number(lawyer.ratingAvg ?? 0).toFixed(1)
  const feeMin = lawyer.feeMin ?? 0
  const feeMax = lawyer.feeMax ?? 0

  return (
    <Card className="group overflow-hidden border-slate-700/50 bg-slate-800/30 hover:border-accent/30 hover:shadow-glow-sm transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg text-slate-100 group-hover:text-accent transition-colors">
            {lawyer.name}
          </h3>
          {lawyer.verified && (
            <BadgeCheck className="w-5 h-5 shrink-0 text-accent" aria-label="Verified" />
          )}
        </div>
        <p className="text-sm text-slate-400 line-clamp-2">{practices || 'General practice'}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5 text-accent">
            <Star className="w-4 h-4 fill-accent" />
            {rating}
          </span>
          {lawyer.city && (
            <span className="flex items-center gap-1.5 text-slate-500">
              <MapPin className="w-3.5 h-3.5" />
              {lawyer.city}
            </span>
          )}
        </div>
        <div className="text-sm font-medium text-slate-300">
          ₹{feeMin.toLocaleString()} – ₹{feeMax.toLocaleString()}
        </div>
        <div className="flex gap-2 pt-1">
          <Link href={`/lawyer/${lawyer.id}`} className="flex-1">
            <Button variant="outline" className="w-full" size="sm">
              View
            </Button>
          </Link>
          <Link href={`/booking/${lawyer.id}`} className="flex-1">
            <Button className="w-full" size="sm">
              Book
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
