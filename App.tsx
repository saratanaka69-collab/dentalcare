import { motion, useReducedMotion as useFramerReducedMotion } from 'framer-motion'
import { ArrowDownRight, ArrowRight, CalendarDays, Check, ChevronDown, Clock3, HeartHandshake, Layers3, Mail, MoveUpRight, ScanLine, ShieldCheck, Sparkles, Stethoscope, Users } from 'lucide-react'
import { FormEvent, useEffect, useState, type ComponentType, type KeyboardEvent as ReactKeyboardEvent, type TouchEvent as ReactTouchEvent } from 'react'
import { Chatbot } from './components/Chatbot'
import { Header } from './components/Header'
import { useActiveSection, usePersistedLanguage, useReducedMotion } from './hooks'
import { translations } from './i18n/translations'
import type { ChatIntent, Language, TranslationCopy } from './types'

const assetBase = '/manus-storage/async-images/jp6l55iFPoPOo1LtcSqt66/'
const images = {
  clinic: `${assetBase}image-1.webp`,
  prevention: `${assetBase}image-2.webp`,
  aesthetic: `${assetBase}image-3.webp`,
  orthodontics: `${assetBase}image-4.webp`,
  team: `${assetBase}image-5.webp`,
}
const serviceArt = [
  { image: images.prevention, className: 'art-photo art-prevention', icon: ShieldCheck },
  { image: images.aesthetic, className: 'art-photo art-aesthetic', icon: Sparkles },
  { image: images.orthodontics, className: 'art-photo art-orthodontics', icon: ScanLine },
  { image: '', className: 'art-abstract art-implant', icon: Layers3 },
  { image: '', className: 'art-abstract art-whitening', icon: Sparkles },
  { image: '', className: 'art-abstract art-general', icon: HeartHandshake },
]
const technologyIcons = [Stethoscope, CalendarDays, HeartHandshake]

const ease = [0.22, 1, 0.36, 1] as const
const reveal = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: .65, ease } } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: .08 } } }

function SectionHeading({ eyebrow, title, body, align = 'left' }: { eyebrow: string; title: string; body?: string; align?: 'left' | 'center' }) {
  return <div className={`section-heading ${align === 'center' ? 'is-center' : ''}`}><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{body && <p>{body}</p>}</div>
}

function App() {
  const [language, setLanguage] = usePersistedLanguage<Language>('dentalcare-language', 'fr', ['fr', 'en', 'ar'] as const)
  const copy = translations[language]
  const [chatSignal, setChatSignal] = useState<ChatIntent | null>(null)
  const [faqOpen, setFaqOpen] = useState<number | null>(0)
  const [testimonialIndex, setTestimonialIndex] = useState(0)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [contactState, setContactState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({})
  const reducedMotion = Boolean(useReducedMotion() || useFramerReducedMotion())
  const activeSection = useActiveSection(['home', 'services', 'about', 'technology', 'team', 'experience', 'appointment', 'faq', 'contact'])
  const [ToothSceneComponent, setToothSceneComponent] = useState<ComponentType<{ copy: TranslationCopy; reducedMotion?: boolean }> | null>(null)

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    const skipLink = document.querySelector('.skip-link')
    if (skipLink) skipLink.textContent = copy.brand.skipToContent
  }, [copy.brand.skipToContent, language])

  useEffect(() => {
    if (reducedMotion) return
    let cancelled = false
    const timer = window.setTimeout(() => {
      import('./components/ToothScene').then(({ ToothScene: Component }) => {
        if (!cancelled) setToothSceneComponent(() => Component)
      }).catch(() => undefined)
    }, 650)
    return () => { cancelled = true; window.clearTimeout(timer) }
  }, [reducedMotion])

  const sectionMotion = reducedMotion ? { hidden: {}, visible: {} } : reveal
  const changeLanguage = (next: Language) => setLanguage(next)
  const openBooking = () => setChatSignal('booking')
  const consumeChatSignal = () => setChatSignal(null)

  const testimonial = copy.testimonials.items[testimonialIndex]
  const nextTestimonial = () => setTestimonialIndex((current) => (current + 1) % copy.testimonials.items.length)
  const previousTestimonial = () => setTestimonialIndex((current) => (current - 1 + copy.testimonials.items.length) % copy.testimonials.items.length)
  const handleTestimonialKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); nextTestimonial() }
    if (event.key === 'ArrowLeft') { event.preventDefault(); previousTestimonial() }
    if (event.key === 'Home') { event.preventDefault(); setTestimonialIndex(0) }
    if (event.key === 'End') { event.preventDefault(); setTestimonialIndex(copy.testimonials.items.length - 1) }
  }
  const handleTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => setTouchStartX(event.touches[0]?.clientX ?? null)
  const handleTouchEnd = (event: ReactTouchEvent<HTMLDivElement>) => {
    if (touchStartX === null) return
    const delta = (event.changedTouches[0]?.clientX ?? touchStartX) - touchStartX
    setTouchStartX(null)
    if (Math.abs(delta) > 44) delta < 0 ? nextTestimonial() : previousTestimonial()
  }

  const validateContact = (form: HTMLFormElement) => {
    const data = new FormData(form)
    const errors: Record<string, string> = {}
    const requiredFields = ['name', 'email', 'subject', 'message']
    requiredFields.forEach((key) => { if (!String(data.get(key) ?? '').trim()) errors[key] = copy.contact.required })
    const email = String(data.get('email') ?? '').trim()
    if (email && !/^\S+@\S+\.\S+$/.test(email)) errors.email = copy.contact.invalidEmail
    return errors
  }

  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const errors = validateContact(form)
    setContactErrors(errors)
    if (Object.keys(errors).length) { setContactState('error'); return }
    setContactState('sending')
    window.setTimeout(() => setContactState('success'), 800)
  }

  const focusNext = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })

  return <div className="app-shell" data-language={language} dir={language === 'ar' ? 'rtl' : 'ltr'}>
    <Header copy={copy} language={language} activeSection={activeSection} onLanguageChange={changeLanguage} onBook={openBooking} />

    <main id="main-content">
      <section id="home" className="hero-section">
        <div className="hero-orb orb-one" aria-hidden="true" /><div className="hero-orb orb-two" aria-hidden="true" />
        <div className="container hero-grid">
          <motion.div className="hero-copy" variants={stagger} initial="hidden" animate="visible">
            <motion.div variants={sectionMotion} className="hero-eyebrow"><span className="eyebrow-dot" />{copy.hero.eyebrow}</motion.div>
            <motion.h1 variants={sectionMotion}><span>{copy.hero.titleLead}</span><em>{copy.hero.titleAccent}</em></motion.h1>
            <motion.p variants={sectionMotion} className="hero-description">{copy.hero.body}</motion.p>
            <motion.div variants={sectionMotion} className="hero-actions"><button className="button button-primary" onClick={openBooking}>{copy.hero.primary}<MoveUpRight className="flip-rtl" size={17} aria-hidden="true" /></button><button className="button button-ghost" onClick={() => focusNext('services')}>{copy.hero.secondary}<ArrowDownRight className="flip-rtl" size={17} aria-hidden="true" /></button></motion.div>
            <motion.div variants={sectionMotion} className="hero-note"><span className="note-check"><Check size={13} /></span><span>{copy.hero.note}</span></motion.div>
          </motion.div>
          <motion.div className="hero-visual-wrap" initial={reducedMotion ? false : { opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .9, delay: .22, ease }}>{ToothSceneComponent ? <ToothSceneComponent copy={copy} reducedMotion={reducedMotion} /> : <div className={reducedMotion ? 'tooth-fallback' : 'tooth-loading'} aria-label={copy.hero.visualFallback}>{reducedMotion ? <div className="fallback-tooth" /> : <div className="loading-ring" />}<span>{copy.hero.visualFallback}</span></div>}</motion.div>
        </div>
        <button className="scroll-cue" onClick={() => focusNext('trust')} aria-label={copy.hero.scroll}><span>{copy.hero.scroll}</span><span className="scroll-line" /></button>
      </section>

      <section id="trust" className="trust-strip" aria-label={`${copy.brand.name} — ${copy.brand.descriptor}`}>
        <div className="container trust-grid">{copy.trust.map((item, index) => <motion.div className="trust-item" key={item.title} initial={reducedMotion ? false : { opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .5 }} transition={{ delay: index * .06, duration: .5 }}><span className="trust-index">0{index + 1}</span><div><h3>{item.title}</h3><p>{item.body}</p></div></motion.div>)}</div>
      </section>

      <section id="services" className="section services-section">
        <div className="container"><SectionHeading eyebrow={copy.services.eyebrow} title={copy.services.title} body={copy.services.body} />
          <motion.div className="services-grid" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: .14 }}>{copy.services.items.map((service, index) => { const art = serviceArt[index]; const Icon = art.icon; return <motion.article className="service-card" variants={sectionMotion} key={service.title}><div className={`service-art ${art.className}`}>{art.image ? <img src={art.image} alt={`${service.title} — ${copy.brand.name}`} loading="lazy" /> : <div className="art-lines" aria-hidden="true"><span /><span /><span /></div>}<span className="service-icon"><Icon size={19} aria-hidden="true" /></span><span className="service-tag">{service.tag}</span></div><div className="service-content"><h3>{service.title}</h3><p>{service.body}</p><button className="text-link" onClick={() => focusNext('contact')}>{copy.services.learnMore}<ArrowRight className="flip-rtl" size={16} aria-hidden="true" /></button></div></motion.article> })}</motion.div>
        </div>
      </section>

      <section id="about" className="section about-section">
        <div className="container about-grid"><motion.div className="about-media" initial={reducedMotion ? false : { opacity: 0, x: -25 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .7, ease }}><img src={images.clinic} alt={copy.about.imageAlt} loading="lazy" /><span className="media-badge"><span className="badge-dot" />{copy.about.demo}</span><div className="media-caption"><span>01</span><span>{copy.about.caption}</span></div></motion.div><motion.div className="about-copy" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: .2 }}><motion.div variants={sectionMotion}><SectionHeading eyebrow={copy.about.eyebrow} title={copy.about.title} body={copy.about.body} /></motion.div><motion.div className="value-list" variants={stagger}>{copy.about.values.map((value, index) => <motion.div className="value-item" variants={sectionMotion} key={value.title}><span className="value-number">0{index + 1}</span><div><h3>{value.title}</h3><p>{value.body}</p></div></motion.div>)}</motion.div></motion.div></div>
      </section>

      <section id="technology" className="section technology-section"><div className="container"><div className="technology-top"><SectionHeading eyebrow={copy.technology.eyebrow} title={copy.technology.title} body={copy.technology.body} /><div className="tech-mark" aria-hidden="true"><span /><span /><span /></div></div><motion.div className="technology-grid" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: .2 }}>{copy.technology.items.map((item, index) => { const TechIcon = technologyIcons[index]; return <motion.article className="technology-card" variants={sectionMotion} key={item.number}><span className="tech-number">{item.number}</span><div className="tech-icon"><TechIcon size={23} strokeWidth={1.5} /></div><h3>{item.title}</h3><p>{item.body}</p><span className="card-arrow"><ArrowDownRight className="flip-rtl" size={16} /></span></motion.article> })}</motion.div></div></section>

      <section id="team" className="section team-section"><div className="container"><div className="team-heading"><SectionHeading eyebrow={copy.team.eyebrow} title={copy.team.title} body={copy.team.body} /><div className="team-image"><img src={images.team} alt={copy.team.imageAlt} loading="lazy" /><span>{copy.team.demo}</span></div></div><motion.div className="team-grid" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: .18 }}>{copy.team.members.map((member, index) => <motion.article className="team-card" variants={sectionMotion} key={member.name}><div className={`team-avatar avatar-${index}`}><span>{member.initials}</span><i /></div><span className="illustrative-label">{copy.team.demo}</span><h3>{member.name}</h3><p className="team-role">{member.role}</p><p>{member.body}</p><div className="team-line" /></motion.article>)}</motion.div></div></section>

      <section id="experience" className="section experience-section"><div className="container experience-grid"><div className="experience-aside"><SectionHeading eyebrow={copy.testimonials.eyebrow} title={copy.testimonials.title} body={copy.testimonials.body} /><div className="experience-quote-mark">“</div><div className="carousel-controls"><button onClick={previousTestimonial} aria-label={copy.testimonials.previous}><ArrowRight size={18} className="flip-rtl" /></button><button onClick={nextTestimonial} aria-label={copy.testimonials.next}><ArrowRight size={18} /></button></div></div><div className="testimonial-panel" tabIndex={0} role="region" aria-label={copy.testimonials.title} onKeyDown={handleTestimonialKeyDown} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}><motion.div key={`${language}-${testimonialIndex}`} className="testimonial-card" aria-live="polite" initial={reducedMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35 }}><span className="quote-label">{copy.testimonials.demo}</span><blockquote>“{testimonial.quote}”</blockquote><div className="testimonial-author"><div className="mini-avatar">{testimonial.name.charAt(0)}</div><div><strong>{testimonial.name}</strong><span>{testimonial.context}</span></div></div></motion.div><div className="carousel-dots" role="tablist" aria-label={copy.testimonials.title}>{copy.testimonials.items.map((item, index) => <button key={item.name} className={index === testimonialIndex ? 'is-active' : ''} onClick={() => setTestimonialIndex(index)} role="tab" aria-selected={index === testimonialIndex} aria-label={`${copy.testimonials.slide} ${index + 1}`} />)}</div></div></div></section>

      <section id="appointment" className="appointment-section"><div className="appointment-glow" aria-hidden="true" /><div className="container appointment-inner"><span className="eyebrow eyebrow-light">{copy.appointment.eyebrow}</span><h2>{copy.appointment.title}</h2><p>{copy.appointment.body}</p><button className="button button-light" onClick={openBooking}>{copy.appointment.cta}<MoveUpRight className="flip-rtl" size={17} /></button><small><Check size={14} />{copy.appointment.note}</small></div></section>

      <section id="faq" className="section faq-section"><div className="container faq-grid"><SectionHeading eyebrow={copy.faq.eyebrow} title={copy.faq.title} body={copy.faq.body} /><div className="faq-list">{copy.faq.items.map((item, index) => { const panelId = `faq-panel-${index}`; return <div className={`faq-item ${faqOpen === index ? 'is-open' : ''}`} key={item.question}><button className="faq-question" onClick={() => setFaqOpen(faqOpen === index ? null : index)} aria-expanded={faqOpen === index} aria-controls={faqOpen === index ? panelId : undefined}><span>{item.question}</span><span className="faq-icon"><ChevronDown size={18} /></span></button>{faqOpen === index && <motion.div id={panelId} className="faq-answer" role="region" aria-label={item.question} initial={reducedMotion ? false : { opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: .25 }}><p>{item.answer}</p></motion.div>}</div> })}</div></div></section>

      <section id="contact" className="section contact-section"><div className="container contact-grid"><div className="contact-intro"><SectionHeading eyebrow={copy.contact.eyebrow} title={copy.contact.title} body={copy.contact.body} /><div className="contact-details"><div><span className="detail-icon"><Mail size={17} /></span><div><span className="detail-label">{copy.contact.details.emailLabel}</span><strong>bonjour@dentalcare.demo</strong></div></div><div><span className="detail-icon"><Clock3 size={17} /></span><div><span className="detail-label">{copy.contact.details.availabilityLabel}</span><strong>{copy.contact.details.availabilityValue}</strong></div></div><div><span className="detail-icon"><Users size={17} /></span><div><span className="detail-label">{copy.contact.details.teamLabel}</span><strong>{copy.contact.details.teamValue}</strong></div></div></div></div><form className="contact-form" onSubmit={submitContact} noValidate><div className="form-demo-note"><Sparkles size={15} />{copy.contact.demo}</div><div className="form-row"><label><span>{copy.contact.fields.name} *</span><input id="contact-name" name="name" placeholder={copy.contact.placeholders.name} aria-invalid={Boolean(contactErrors.name)} aria-describedby={contactErrors.name ? 'contact-name-error' : undefined} />{contactErrors.name && <small id="contact-name-error" className="field-error">{contactErrors.name}</small>}</label><label><span>{copy.contact.fields.email} *</span><input id="contact-email" type="email" name="email" placeholder={copy.contact.placeholders.email} aria-invalid={Boolean(contactErrors.email)} aria-describedby={contactErrors.email ? 'contact-email-error' : undefined} />{contactErrors.email && <small id="contact-email-error" className="field-error">{contactErrors.email}</small>}</label></div><div className="form-row"><label><span>{copy.contact.fields.phone}</span><input id="contact-phone" name="phone" placeholder={copy.contact.placeholders.phone} /></label><label><span>{copy.contact.fields.subject} *</span><input id="contact-subject" name="subject" placeholder={copy.contact.placeholders.subject} aria-invalid={Boolean(contactErrors.subject)} aria-describedby={contactErrors.subject ? 'contact-subject-error' : undefined} />{contactErrors.subject && <small id="contact-subject-error" className="field-error">{contactErrors.subject}</small>}</label></div><label><span>{copy.contact.fields.message} *</span><textarea id="contact-message" name="message" placeholder={copy.contact.placeholders.message} rows={4} aria-invalid={Boolean(contactErrors.message)} aria-describedby={contactErrors.message ? 'contact-message-error' : undefined} />{contactErrors.message && <small id="contact-message-error" className="field-error">{contactErrors.message}</small>}</label><div className="form-footer" aria-live="polite"><button className="button button-primary" type="submit" disabled={contactState === 'sending'}>{contactState === 'sending' ? copy.contact.sending : copy.contact.submit}<ArrowRight className="flip-rtl" size={16} /></button>{contactState === 'success' && <span className="form-status success"><Check size={15} />{copy.contact.success}</span>}{contactState === 'error' && !Object.keys(contactErrors).length && <span className="form-status error">{copy.contact.error}</span>}</div></form></div></section>
    </main>

    <footer className="site-footer"><div className="container footer-top"><div><a className="footer-wordmark" href="#home">DENTALCARE<span>®</span></a><p>{copy.footer.descriptor}</p><span className="footer-demo">{copy.footer.demo}</span></div><div className="footer-links"><span>{copy.footer.links}</span><div><button onClick={() => focusNext('services')}>{copy.header.nav.services}</button><button onClick={() => focusNext('about')}>{copy.header.nav.about}</button><button onClick={() => focusNext('faq')}>{copy.header.nav.faq}</button><button onClick={() => focusNext('contact')}>{copy.header.nav.contact}</button></div></div><div className="footer-statement"><span>01 — 03</span><strong>{copy.footer.calmCare}<br />{copy.footer.clearNextSteps}</strong></div></div><div className="container footer-bottom"><span>{copy.footer.copyright}</span><div><a href="#contact">{copy.footer.legal}</a><a href="#contact">{copy.footer.privacy}</a><a href="#main-content">{copy.footer.accessibility}</a></div></div></footer>
    <Chatbot copy={copy} language={language} openSignal={chatSignal} onSignalConsumed={consumeChatSignal} />
  </div>
}

export default App
