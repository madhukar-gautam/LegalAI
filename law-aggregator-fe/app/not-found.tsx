import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-12">
        <FileQuestion className="w-20 h-20 text-slate-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-slate-100">Page not found</h1>
        <p className="mt-2 text-slate-500 max-w-sm">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="mt-6 inline-block">
          <Button>Go home</Button>
        </Link>
      </div>
    </div>
  )
}
