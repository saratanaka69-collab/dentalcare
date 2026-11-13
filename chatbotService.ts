import { chatbotConfig } from '../config/chatbot'
import type { ChatIntent, ChatRequest, ChatResponse, Language } from '../types'

export class ChatbotServiceError extends Error {
  kind: 'network' | 'timeout' | 'http' | 'invalid' | 'empty'

  constructor(message: string, kind: ChatbotServiceError['kind']) {
    super(message)
    this.name = 'ChatbotServiceError'
    this.kind = kind
  }
}

const createSessionId = () => {
  const key = 'dentalcare-chat-session'
  const existing = window.localStorage.getItem(key)
  if (existing) return existing
  const id = `dc-${crypto.randomUUID()}`
  window.localStorage.setItem(key, id)
  return id
}

const extractText = (payload: unknown): string | null => {
  if (typeof payload === 'string' && payload.trim()) return payload.trim()
  if (!payload || typeof payload !== 'object') return null
  const record = payload as Record<string, unknown>
  const directKeys = ['reply', 'message', 'text', 'output', 'response', 'answer']
  for (const key of directKeys) {
    if (typeof record[key] === 'string' && String(record[key]).trim()) return String(record[key]).trim()
  }
  const nestedKeys = ['data', 'result', 'body']
  for (const key of nestedKeys) {
    const nested = record[key]
    const nestedText = extractText(nested)
    if (nestedText) return nestedText
  }
  if (Array.isArray(payload)) {
    for (const item of payload) {
      const itemText = extractText(item)
      if (itemText) return itemText
    }
  }
  return null
}

const buildPayload = (request: ChatRequest) => ({
  [chatbotConfig.requestMapping.messageKey]: request.message,
  [chatbotConfig.requestMapping.sessionKey]: request.sessionId,
  [chatbotConfig.requestMapping.languageKey]: request.language,
  [chatbotConfig.requestMapping.intentKey]: request.intent,
})

const demoReply = (intent: ChatIntent, language: Language) => {
  const replies: Record<Language, Record<ChatIntent, string>> = {
    fr: {
      booking: 'En mode démonstration, je peux recueillir votre intention. Pour une réservation réelle, connectez le webhook n8n puis laissez le workflow confirmer le créneau.',
      modify: 'Je peux préparer une demande de modification. Aucune modification réelle n’est effectuée en mode démonstration.',
      cancel: 'Je peux préparer une demande d’annulation. L’annulation ne sera confirmée que par le workflow n8n connecté.',
      question: 'Je peux vous orienter vers nos soins, expliquer le parcours ou vous aider à préparer une question pour la clinique.',
    },
    en: {
      booking: 'In demonstration mode, I can collect your intention. For a real booking, connect the n8n webhook and let the workflow confirm the slot.',
      modify: 'I can prepare a change request. No real change is made in demonstration mode.',
      cancel: 'I can prepare a cancellation request. Cancellation is only confirmed by the connected n8n workflow.',
      question: 'I can guide you through our services, explain the journey or help you prepare a question for the clinic.',
    },
    ar: {
      booking: 'في الوضع التوضيحي يمكنني تسجيل نيتك. للحجز الحقيقي، اربط webhook الخاص بـ n8n ودع المسار يؤكد الموعد.',
      modify: 'يمكنني إعداد طلب تعديل. لا يتم تعديل أي موعد فعلي في الوضع التوضيحي.',
      cancel: 'يمكنني إعداد طلب إلغاء. لا يتم تأكيد الإلغاء إلا من خلال مسار n8n المتصل.',
      question: 'يمكنني إرشادك إلى خدماتنا وشرح المسار أو مساعدتك في إعداد سؤال للعيادة.',
    },
  }
  return replies[language][intent]
}

export async function sendChatMessage(message: string, language: Language, intent: ChatIntent): Promise<ChatResponse> {
  if (chatbotConfig.demoMode || !chatbotConfig.webhookUrl) {
    await new Promise((resolve) => window.setTimeout(resolve, 520))
    return { text: demoReply(intent, language), confirmed: false }
  }

  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), chatbotConfig.timeoutMs)
  const request: ChatRequest = { message, sessionId: createSessionId(), language, intent }

  try {
    const response = await fetch(chatbotConfig.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(buildPayload(request)),
      signal: controller.signal,
    })
    if (!response.ok) throw new ChatbotServiceError(`Webhook HTTP ${response.status}`, 'http')
    const contentType = response.headers.get('content-type') || ''
    let payload: unknown

    try {
      if (contentType.includes('application/json')) {
        payload = await response.json()
      } else {
        payload = await response.text()
      }
    } catch {
      throw new ChatbotServiceError('Réponse invalide', 'invalid')
    }
    const text = extractText(payload)
    if (!text) throw new ChatbotServiceError('Réponse vide ou malformée', 'empty')
    const record = payload && typeof payload === 'object' ? payload as Record<string, unknown> : {}
    return { text, raw: payload, confirmed: record.confirmed === true || record.success === true }
  } catch (error) {
    if (error instanceof ChatbotServiceError) throw error
    if (error instanceof DOMException && error.name === 'AbortError') throw new ChatbotServiceError('Délai dépassé', 'timeout')
    throw new ChatbotServiceError('Impossible de joindre le webhook', 'network')
  } finally {
    window.clearTimeout(timeout)
  }
}


