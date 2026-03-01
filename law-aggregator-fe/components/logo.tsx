import Image from 'next/image'

interface LogoProps {
  className?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizes = { sm: 28, md: 36, lg: 48 }

export function Logo({ className = '', showText = true, size = 'md' }: LogoProps) {
  const px = sizes[size]
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Image
        src="/legalai-logo.png"
        alt="LegalAI"
        width={px}
        height={px}
        className="shrink-0"
        priority
      />
      {showText && (
        <span className="font-semibold text-slate-100 tracking-tight">LegalAI</span>
      )}
    </div>
  )
}
