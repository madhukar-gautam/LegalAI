'use client'

import { useState } from 'react'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Sparkles, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react'

export function AIWidget() {
  const [input, setInput] = useState('')
  const [answer, setAnswer] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [collapsed, setCollapsed] = useState(false)

  async function ask() {
    setLoading(true)
    setAnswer(null)
    setError(null)
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: input }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Request failed')
      setAnswer(data?.label ?? 'No result')
    } catch {
      setError('Unable to get suggestion. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="fixed bottom-6 right-6 flex items-center gap-2 rounded-xl border border-slate-700/50 bg-slate-800/90 px-4 py-2.5 shadow-glow-sm hover:border-accent/50 transition-all"
        aria-label="Open AI Intake"
      >
        <Sparkles className="w-4 h-4 text-accent" />
        <span className="text-sm font-medium text-slate-200">AI Intake</span>
        <ChevronUp className="w-4 h-4 text-slate-500" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 rounded-2xl border border-slate-700/50 bg-slate-800/95 backdrop-blur-xl shadow-xl overflow-hidden">
      <button
        onClick={() => setCollapsed(true)}
        className="w-full flex items-center justify-between px-4 py-3 border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors"
        aria-label="Collapse AI Intake"
      >
        <span className="flex items-center gap-2 font-medium text-slate-100">
          <Sparkles className="w-4 h-4 text-accent" />
          AI Intake
        </span>
        <ChevronDown className="w-4 h-4 text-slate-500" />
      </button>
      <div className="p-4 space-y-3">
        <Textarea
          placeholder="Describe your legal issue…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-[80px] bg-slate-800/50 border-slate-600 placeholder:text-slate-500"
        />
        <Button onClick={ask} disabled={loading || !input.trim()} className="w-full">
          {loading ? 'Thinking…' : 'Suggest practice area'}
        </Button>
        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-950/30 border border-red-900/50 px-3 py-2 text-sm text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}
        {answer && !error && (
          <p className="text-sm text-slate-400">
            Suggested: <strong className="text-accent">{answer}</strong>
          </p>
        )}
      </div>
    </div>
  )
}
