import './globals.css'
import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { AIWidget } from '@/components/ai-widget'

export const metadata: Metadata = {
  title: 'LegalAI – Find verified lawyers and book consultations',
  description: 'Find verified lawyers and book consultations',
  icons: { icon: '/legalai-logo.png' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-surface text-slate-100 antialiased bg-grid-pattern">
        <Navbar />
        <main className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {children}
        </main>
        <AIWidget />
      </body>
    </html>
  )
}
