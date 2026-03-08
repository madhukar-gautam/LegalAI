'use client'

import { Input } from './ui/input'
import { Select } from './ui/select'
import { Filter } from 'lucide-react'

export function SearchFilters({
  value,
  onChange,
  practices,
}: {
  value: any
  onChange: (v: any) => void
  practices: string[]
}) {
  return (
    <div className="sticky top-24 rounded-2xl border border-slate-700/50 bg-slate-800/30 p-5">
      <h3 className="flex items-center gap-2 font-semibold text-slate-100 mb-5">
        <Filter className="w-4 h-4 text-accent" />
        Filters
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
            City
          </label>
          <Input
            placeholder="e.g. Mumbai, Delhi"
            value={value.city}
            onChange={(e) => onChange({ ...value, city: e.target.value })}
            className="bg-slate-800/50 border-slate-600"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
            Practice area
          </label>
          <Select
            value={value.practice}
            onChange={(v) => onChange({ ...value, practice: v })}
            options={['', ...practices]}
            className="bg-slate-800/50 border-slate-600"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
            Min. experience (years)
          </label>
          <Input
            placeholder="0"
            type="number"
            min={0}
            value={value.expGte || ''}
            onChange={(e) => onChange({ ...value, expGte: parseInt(e.target.value, 10) || 0 })}
            className="bg-slate-800/50 border-slate-600"
          />
        </div>
      </div>
    </div>
  )
}
