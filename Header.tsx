import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { BrandLogo } from './BrandLogo'
import { useReducedMotion } from '../hooks'
import type { Language, NavKey, TranslationCopy } from '../types'

interface HeaderProps {
  copy: TranslationCopy
  language: Language
  activeSection: string
  onLanguageChange: (language: Language) => void
  onBook: () => void
}

const navIds: Array<{ key: NavKey; id: string }> = [
  { key: 'home', id: 'home' }, { key: 'services', id: 'services' }, { key: 'about', id: 'about' }, { key: 'team', id: 'team' }, { key: 'faq', id: 'faq' }, { key: 'contact', id: 'contact' },
]

export function Header({ copy, language, activeSection, onLanguageChange, onBook }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
    setMobileOpen(false)
  }

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container header-inner">
        <BrandLogo descriptor={copy.brand.descriptor} homeLabel={copy.header.nav.home} onClick={(event) => { event.preventDefault(); goTo('home') }} />
        <nav className="desktop-nav" aria-label={copy.header.mainNavigation}>
          {navIds.map(({ key, id }) => <button className={activeSection === id ? 'nav-link is-active' : 'nav-link'} key={id} onClick={() => goTo(id)}>{copy.header.nav[key]}</button>)}
        </nav>
        <div className="header-actions">
          <label className="language-select">
            <span className="sr-only">{copy.header.language}</span>
            <select value={language} onChange={(event) => onLanguageChange(event.target.value as Language)} aria-label={copy.header.language}>
              <option value="fr">FR</option><option value="en">EN</option><option value="ar">عربي</option>
            </select>
          </label>
          <button className="button button-primary button-small header-cta" onClick={onBook}>{copy.header.appointment}<ArrowUpRight className="flip-rtl" size={15} aria-hidden="true" /></button>
          <button className="mobile-menu-button" aria-label={mobileOpen ? copy.header.close : copy.header.menu} aria-expanded={mobileOpen} onClick={() => setMobileOpen((open) => !open)}>{mobileOpen ? <X size={23} /> : <Menu size={23} />}</button>
        </div>
      </div>
      <AnimatePresence>
        {mobileOpen && <motion.div className="mobile-menu" initial={reducedMotion ? false : { opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={reducedMotion ? undefined : { opacity: 0, y: -12 }} transition={{ duration: reducedMotion ? 0 : .2 }}>
          <nav aria-label={copy.header.mobileNavigation}>
            {navIds.map(({ key, id }) => <button className={activeSection === id ? 'mobile-nav-link is-active' : 'mobile-nav-link'} key={id} onClick={() => goTo(id)}>{copy.header.nav[key]}<ArrowUpRight className="flip-rtl" size={16} aria-hidden="true" /></button>)}
          </nav>
          <button className="mobile-menu-cta" onClick={() => { setMobileOpen(false); onBook() }}>{copy.header.appointment}<ArrowUpRight className="flip-rtl" size={16} aria-hidden="true" /></button>
        </motion.div>}
      </AnimatePresence>
    </header>
  )
}
