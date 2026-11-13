const env = (import.meta as ImportMeta & { env: Record<string, string | undefined> }).env

export const chatbotConfig = {
  webhookUrl: env.VITE_N8N_WEBHOOK_URL?.trim() ?? '',
  demoMode: env.VITE_N8N_DEMO_MODE !== 'false' || !env.VITE_N8N_WEBHOOK_URL,
  timeoutMs: Number(env.VITE_N8N_TIMEOUT_MS ?? 9000),
  requestMapping: {
    messageKey: 'message',
    sessionKey: 'sessionId',
    languageKey: 'language',
    intentKey: 'intent',
  },
}

export const isWebhookConfigured = Boolean(chatbotConfig.webhookUrl)
