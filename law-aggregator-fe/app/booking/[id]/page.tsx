import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { fetchLawyer } from '@/lib/api'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, CheckCircle2, CreditCard } from 'lucide-react'

export default async function BookingPage({ params }: { params: { id: string } }) {
  let lawyer
  try {
    lawyer = await fetchLawyer(params.id)
  } catch {
    notFound()
  }

  return (
    <div className="max-w-xl space-y-6 animate-fade-in">
      <Link
        href={`/lawyer/${params.id}`}
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-accent transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to {lawyer.name}
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-slate-100">Book Consultation</h1>
        <p className="mt-1 text-slate-400">with {lawyer.name}</p>
      </div>

      <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-6 space-y-6">
        <ol className="space-y-5">
          <li className="flex gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/20 text-accent font-semibold">
              1
            </span>
            <div>
              <h3 className="font-medium text-slate-100 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-accent" />
                Select available slot
              </h3>
              <p className="text-sm text-slate-500 mt-0.5">Choose a date and time that works for you</p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-700/50 text-slate-400 font-semibold">
              2
            </span>
            <div>
              <h3 className="font-medium text-slate-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-500" />
                Confirm details
              </h3>
              <p className="text-sm text-slate-500 mt-0.5">Review your consultation details</p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-700/50 text-slate-400 font-semibold">
              3
            </span>
            <div>
              <h3 className="font-medium text-slate-100 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-slate-500" />
                Pay & receive confirmation
              </h3>
              <p className="text-sm text-slate-500 mt-0.5">Secure payment and instant confirmation</p>
            </div>
          </li>
        </ol>

        <Button className="w-full" size="lg">
          Continue
        </Button>
      </div>
    </div>
  )
}
