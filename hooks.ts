import { useEffect, useState } from 'react'

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  return reduced
}

export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? '')
  useEffect(() => {
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    if (!elements.length) return
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)
      if (visible[0]?.target.id) setActive(visible[0].target.id)
    }, { rootMargin: '-25% 0px -58% 0px', threshold: [0.05, 0.25, 0.55] })
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [ids])
  return active
}

export function usePersistedLanguage<T extends string>(key: string, fallback: T, supported: readonly T[]) {
  const [value, setValue] = useState<T>(() => {
    const stored = window.localStorage.getItem(key) as T | null
    return stored && supported.includes(stored) ? stored : fallback
  })
  const update = (next: T) => {
    setValue(next)
    window.localStorage.setItem(key, next)
  }
  return [value, update] as const
}
