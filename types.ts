export type Language = 'fr' | 'en' | 'ar'
export type ChatIntent = 'booking' | 'modify' | 'cancel' | 'question'

export type NavKey = 'home' | 'services' | 'about' | 'team' | 'faq' | 'contact'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'error'
  text: string
  timestamp: string
  intent?: ChatIntent
}

export interface ChatRequest {
  message: string
  sessionId: string
  language: Language
  intent: ChatIntent
}

export interface ChatResponse {
  text: string
  raw?: unknown
  confirmed?: boolean
}

export interface TranslationCopy {
  brand: {
    name: string
    descriptor: string
    demo: string
    illustrative: string
    skipToContent: string
  }
  header: {
    nav: Record<NavKey, string>
    appointment: string
    menu: string
    close: string
    language: string
    mainNavigation: string
    mobileNavigation: string
  }
  hero: {
    eyebrow: string
    titleLead: string
    titleAccent: string
    body: string
    primary: string
    secondary: string
    note: string
    scroll: string
    visualLabel: string
    visualFallback: string
  }
  trust: Array<{ title: string; body: string }>
  services: {
    eyebrow: string
    title: string
    body: string
    learnMore: string
    items: Array<{ title: string; body: string; tag: string }>
  }
  about: {
    eyebrow: string
    title: string
    body: string
    values: Array<{ title: string; body: string }>
    imageAlt: string
    demo: string
    caption: string
  }
  technology: {
    eyebrow: string
    title: string
    body: string
    items: Array<{ number: string; title: string; body: string }>
  }
  team: {
    eyebrow: string
    title: string
    body: string
    demo: string
    imageAlt: string
    members: Array<{ name: string; role: string; body: string; initials: string }>
  }
  testimonials: {
    eyebrow: string
    title: string
    body: string
    previous: string
    next: string
    slide: string
    demo: string
    items: Array<{ quote: string; name: string; context: string }>
  }
  appointment: {
    eyebrow: string
    title: string
    body: string
    cta: string
    note: string
  }
  faq: {
    eyebrow: string
    title: string
    body: string
    items: Array<{ question: string; answer: string }>
  }
  contact: {
    eyebrow: string
    title: string
    body: string
    demo: string
    fields: { name: string; email: string; phone: string; subject: string; message: string }
    placeholders: { name: string; email: string; phone: string; subject: string; message: string }
    details: { emailLabel: string; availabilityLabel: string; availabilityValue: string; teamLabel: string; teamValue: string }
    submit: string
    sending: string
    success: string
    error: string
    required: string
    invalidEmail: string
    placeholderContact: string
  }
  footer: {
    descriptor: string
    demo: string
    links: string
    legal: string
    privacy: string
    accessibility: string
    copyright: string
    calmCare: string
    clearNextSteps: string
  }
  chatbot: {
    label: string
    online: string
    demoMode: string
    connectedNote: string
    welcome: string
    quickTitle: string
    quickActions: Record<ChatIntent, string>
    inputPlaceholder: string
    send: string
    close: string
    minimize: string
    typing: string
    error: string
    retry: string
    demoReplies: Record<ChatIntent, string>
    unconfirmed: string
    networkNote: string
  }
}
