import type { MouseEvent } from 'react'

interface BrandLogoProps {
  compact?: boolean
  descriptor?: string
  homeLabel?: string
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void
}

export function BrandLogo({ compact = false, descriptor = 'premium dental experience', homeLabel = 'DENTALCARE — Home', onClick }: BrandLogoProps) {
  return (
    <a className="brand-lockup" href="#home" onClick={onClick} aria-label={homeLabel}>
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 46 46" role="presentation">
          <defs><linearGradient id="brand-gradient" x1="7" y1="5" x2="39" y2="41" gradientUnits="userSpaceOnUse"><stop stopColor="#57C7E8"/><stop offset="1" stopColor="#2878C7"/></linearGradient></defs>
          <path d="M15.4 9.8C10.8 12.1 9.8 18.7 12 25l3.8 10.6c.9 2.7 3.2 2.7 4.1-.1l2.2-7.4 2.2 7.4c.9 2.8 3.2 2.8 4.1.1L32.2 25c2.2-6.3 1.2-12.9-3.4-15.2-2.5-1.2-5.2.2-6.7 1.3-1.5-1.1-4.2-2.5-6.7-1.3Z" fill="url(#brand-gradient)" />
          <path d="M14.4 30.4c4.7 3.7 11.1 3.7 15.8 0" fill="none" stroke="#fff" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      </span>
      {!compact && <span className="brand-text"><strong>DENTALCARE</strong><small>{descriptor}</small></span>}
    </a>
  )
}
