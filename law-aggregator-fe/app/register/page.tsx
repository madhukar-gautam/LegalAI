'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

type Role = 'USER' | 'LAWYER'

type RegisterResponse = {
  userId: number
  lawyerId: number | null
  name: string
  email: string
  phone: string
  role: 'USER' | 'LAWYER' | 'ADMIN'
  verified: boolean
}

function parseCsvList(value: string): string[] | undefined {
  const cleaned = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
  return cleaned.length ? cleaned : undefined
}

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState<Role>('USER')
  const [city, setCity] = useState('')
  const [yearsExp, setYearsExp] = useState('')
  const [languages, setLanguages] = useState('')
  const [practiceAreas, setPracticeAreas] = useState('')
  const [bio, setBio] = useState('')
  const [feeMin, setFeeMin] = useState('')
  const [feeMax, setFeeMax] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<RegisterResponse | null>(null)

  const isLawyer = role === 'LAWYER'
  const selectedPractices = useMemo(() => parseCsvList(practiceAreas) || [], [practiceAreas])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setResult(null)
    setLoading(true)

    const payload: Record<string, unknown> = {
      name,
      email,
      phone,
      role,
    }

    if (isLawyer) {
      payload.city = city || undefined
      payload.yearsExp = yearsExp ? Number(yearsExp) : undefined
      payload.languages = parseCsvList(languages)
      payload.practiceAreas = parseCsvList(practiceAreas)
      payload.bio = bio || undefined
      payload.feeMin = feeMin ? Number(feeMin) : undefined
      payload.feeMax = feeMax ? Number(feeMax) : undefined
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data?.message || data?.error || 'Registration failed')
        return
      }

      setResult(data as RegisterResponse)
    } catch {
      setError('Could not reach server. Ensure backend is running on port 8080.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-6 sm:p-8">
        <h1 className="text-3xl font-bold">Create your account</h1>
        <p className="mt-2 text-slate-400">Register as a user or lawyer. Lawyer details are optional unless you choose Lawyer role.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="h-10 w-full rounded-xl border border-slate-600 px-3 text-sm text-slate-100 bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            >
              <option value="USER" className="bg-slate-800 text-slate-100">User</option>
              <option value="LAWYER" className="bg-slate-800 text-slate-100">Lawyer</option>
            </select>
          </div>

          {isLawyer && (
            <div className="space-y-4 rounded-xl border border-slate-700/50 bg-slate-900/30 p-4">
              <p className="text-sm font-medium text-slate-200">Lawyer profile</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                <Input placeholder="Years of experience" type="number" min={0} value={yearsExp} onChange={(e) => setYearsExp(e.target.value)} />
                <Input placeholder="Languages (comma separated)" value={languages} onChange={(e) => setLanguages(e.target.value)} />
                <Input placeholder="Practice areas (comma separated)" value={practiceAreas} onChange={(e) => setPracticeAreas(e.target.value)} />
                <Input placeholder="Fee min" type="number" min={0} step="0.01" value={feeMin} onChange={(e) => setFeeMin(e.target.value)} />
                <Input placeholder="Fee max" type="number" min={0} step="0.01" value={feeMax} onChange={(e) => setFeeMax(e.target.value)} />
              </div>
              <Textarea placeholder="Short bio" value={bio} onChange={(e) => setBio(e.target.value)} className="min-h-[100px]" />
              {selectedPractices.length > 0 && (
                <p className="text-xs text-slate-400">Preview: {selectedPractices.join(' | ')}</p>
              )}
            </div>
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Register'}
            </Button>
            <Link href="/search" className="text-sm text-slate-400 hover:text-slate-100 transition-colors">
              Skip to search
            </Link>
          </div>
        </form>
      </div>

      {result && (
        <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <p className="font-medium text-emerald-300">Registration successful</p>
          <p className="mt-1 text-sm text-slate-300">User ID: {result.userId}{result.lawyerId ? ` | Lawyer ID: ${result.lawyerId}` : ''}</p>
          <p className="mt-2 text-sm text-slate-300">You can now browse lawyers and book consultations.</p>
        </div>
      )}
    </div>
  )
}
