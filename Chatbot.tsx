import { AnimatePresence, motion } from 'framer-motion'
import { Bot, Check, ChevronDown, LoaderCircle, MessageCircle, Minus, RotateCcw, Send, X } from 'lucide-react'
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'
import { isWebhookConfigured } from '../config/chatbot'
import { useReducedMotion } from '../hooks'
import { sendChatMessage } from '../services/chatbotService'
import type { ChatIntent, ChatMessage, Language, TranslationCopy } from '../types'

interface ChatbotProps {
  language: Language
  copy: TranslationCopy
  openSignal: ChatIntent | null
  onSignalConsumed: () => void
}

const now = () => new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(new Date())
const id = () => `msg-${crypto.randomUUID()}`

export function Chatbot({ language, copy, openSignal, onSignalConsumed }: ChatbotProps) {
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [activeIntent, setActiveIntent] = useState<ChatIntent>('question')
  const [failed, setFailed] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: id(), role: 'assistant', text: copy.chatbot.welcome, timestamp: now() }])
  const scrollRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    setMessages((current) => current.length === 1 ? [{ ...current[0], text: copy.chatbot.welcome }] : current)
  }, [copy.chatbot.welcome])

  useEffect(() => {
    if (!openSignal) return
    setOpen(true)
    setMinimized(false)
    setActiveIntent(openSignal)
    onSignalConsumed()
  }, [openSignal, onSignalConsumed])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: reducedMotion ? 'auto' : 'smooth' })
  }, [messages, sending, open, reducedMotion])

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => setMessages((current) => [...current, { ...message, id: id(), timestamp: now() }])

  const submit = async (text: string, intent: ChatIntent = activeIntent) => {
    const value = text.trim()
    if (!value || sending) return
    setFailed(null)
    setInput('')
    setActiveIntent(intent)
    addMessage({ role: 'user', text: value, intent })
    setSending(true)
    try {
      const response = await sendChatMessage(value, language, intent)
      const isAction = intent !== 'question'
      const safeText = isAction && !response.confirmed ? copy.chatbot.unconfirmed : response.text
      addMessage({ role: 'assistant', text: safeText, intent })
    } catch {
      setFailed(value)
      addMessage({ role: 'error', text: copy.chatbot.error, intent })
    } finally {
      setSending(false)
    }
  }

  const submitForm = (event: FormEvent) => { event.preventDefault(); void submit(input) }
  const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void submit(input) } }

  const quickAction = (intent: ChatIntent) => {
    const label = copy.chatbot.quickActions[intent]
    void submit(label, intent)
  }

  return <>
    <AnimatePresence>
      {open && !minimized && <motion.section className="chat-window" role="dialog" aria-label={copy.chatbot.label} aria-modal="false" initial={reducedMotion ? false : { opacity: 0, y: 18, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reducedMotion ? undefined : { opacity: 0, y: 18, scale: .96 }} transition={{ duration: reducedMotion ? 0 : .22 }}>
        <div className="chat-header">
          <div className="chat-identity"><span className="chat-avatar"><Bot size={18} aria-hidden="true" /></span><div><strong>{copy.chatbot.label}</strong><span><i className="online-indicator" />{copy.chatbot.online}</span></div></div>
          <div className="chat-controls"><button onClick={() => setMinimized(true)} aria-label={copy.chatbot.minimize}><Minus size={17} /></button><button onClick={() => setOpen(false)} aria-label={copy.chatbot.close}><X size={17} /></button></div>
        </div>
        <div className="chat-mode"><span className="mode-pill"><span className="mode-pill-dot" />{isWebhookConfigured ? copy.chatbot.connectedNote : copy.chatbot.demoMode}</span></div>
        <div className="chat-messages" ref={scrollRef} aria-live="polite">
          {messages.map((message) => <div className={`chat-message-row ${message.role === 'user' ? 'is-user' : ''}`} key={message.id}><div className={`chat-bubble ${message.role}`}><p>{message.text}</p>{message.role !== 'error' && <time>{message.timestamp}</time>}{message.role === 'error' && <button className="retry-button" onClick={() => failed && void submit(failed, activeIntent)}><RotateCcw size={13} />{copy.chatbot.retry}</button>}</div></div>)}
          {sending && <div className="chat-message-row"><div className="chat-bubble assistant typing"><span /><span /><span /><em>{copy.chatbot.typing}</em></div></div>}
        </div>
        <div className="chat-quick"><span>{copy.chatbot.quickTitle}</span><div className="quick-actions">{(['booking', 'modify', 'cancel', 'question'] as ChatIntent[]).map((intent) => <button key={intent} onClick={() => quickAction(intent)} disabled={sending}>{copy.chatbot.quickActions[intent]}</button>)}</div></div>
        <form className="chat-form" onSubmit={submitForm}><input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={onInputKeyDown} placeholder={copy.chatbot.inputPlaceholder} aria-label={copy.chatbot.inputPlaceholder} disabled={sending} /><button type="submit" disabled={!input.trim() || sending} aria-label={copy.chatbot.send}><Send size={17} /></button></form>
        <p className="chat-disclaimer"><Check size={13} />{copy.chatbot.networkNote}</p>
      </motion.section>}
    </AnimatePresence>
    <motion.button className={`chat-launcher ${open ? 'is-open' : ''}`} onClick={() => { setOpen((current) => !current); setMinimized(false) }} aria-label={open ? copy.chatbot.close : copy.chatbot.label} initial={reducedMotion ? false : { opacity: 0, scale: .8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: reducedMotion ? 0 : .6, duration: reducedMotion ? 0 : .25 }}>
      {open ? <ChevronDown size={23} /> : <MessageCircle size={23} />}<span className="chat-launcher-pulse" />
    </motion.button>
  </>
}
