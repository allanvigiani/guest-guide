'use client'

import { useState, useEffect, useRef, useCallback } from "react"
import { MessageCircle, X, Send } from "lucide-react"

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface VirtualAssistantProps {
  propertyCode: string
  propertyName: string
}

export default function VirtualAssistant({ propertyCode, propertyName }: VirtualAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Olá! Sou o assistente virtual de ${propertyName}. Posso responder dúvidas sobre WiFi, acesso, regras, check-in, restaurantes próximos e muito mais. Como posso ajudar?`,
    },
  ])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  const sendMessage = useCallback(async () => {
    if (isStreaming || !input.trim()) return

    const userContent = input.trim()
    setIsStreaming(true)
    setError(null)
    setInput('')

    // Ignora a welcome message (índice 0) ao montar o payload da API
    const apiMessages = [
      ...messages.slice(1).map(m => ({ role: m.role, content: m.content })),
      { role: 'user' as const, content: userContent },
    ]

    setMessages(prev => [
      ...prev,
      { role: 'user', content: userContent },
      { role: 'assistant', content: '' },
    ])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyCode, messages: apiMessages }),
      })

      if (!response.ok || !response.body) {
        throw new Error(`Erro ao conectar com o assistente (${response.status})`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        // Updater funcional: acrescenta chunk sem closure stale
        setMessages(prev => [
          ...prev.slice(0, -1),
          { role: 'assistant', content: prev[prev.length - 1].content + chunk },
        ])
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Ocorreu um erro inesperado'
      setError(msg)
      setMessages(prev => {
        const last = prev[prev.length - 1]
        return last.role === 'assistant' && last.content === ''
          ? prev.slice(0, -1)
          : prev
      })
    } finally {
      setIsStreaming(false)
    }
  }, [isStreaming, input, messages, propertyCode])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className="fixed inset-y-0 right-0 z-50 flex flex-col w-full sm:w-96"
        style={{
          backgroundColor: 'var(--sz-bg)',
          borderLeft: '1px solid var(--sz-border)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          boxShadow: isOpen ? '-4px 0 24px rgba(0,0,0,0.12)' : 'none',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-4 shrink-0"
          style={{ backgroundColor: 'var(--sz-navy)' }}
        >
          <div className="flex items-center gap-2">
            <MessageCircle size={16} style={{ color: 'var(--sz-coral)' }} />
            <span className="font-semibold text-sm text-white">Assistente Virtual</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center w-8 h-8 rounded-full transition-opacity hover:opacity-80"
            style={{ backgroundColor: 'var(--sz-coral)' }}
            aria-label="Fechar"
          >
            <X size={16} color="#fff" />
          </button>
        </div>

        {/* Message list */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
                style={
                  msg.role === 'user'
                    ? { backgroundColor: 'var(--sz-coral)', color: '#fff' }
                    : {
                        backgroundColor: 'var(--sz-card)',
                        color: 'var(--sz-text)',
                        border: '1px solid var(--sz-border)',
                      }
                }
              >
                {msg.content || (
                  <span className="inline-flex gap-1 items-center">
                    {[0, 1, 2].map(dot => (
                      <span
                        key={dot}
                        className="inline-block w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor: 'var(--sz-muted)',
                          animation: `sz-fade-in 0.6s ease ${dot * 0.2}s infinite alternate`,
                        }}
                      />
                    ))}
                  </span>
                )}
              </div>
            </div>
          ))}

          {error && (
            <p className="text-xs text-center px-2" style={{ color: '#DC2626' }}>
              {error}
            </p>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div
          className="shrink-0 px-4 py-3 flex gap-2 items-center"
          style={{ borderTop: '1px solid var(--sz-border)', backgroundColor: 'var(--sz-card)' }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isStreaming}
            placeholder="Digite sua dúvida..."
            className="flex-1 text-sm rounded-xl px-3 py-2 outline-none"
            style={{
              backgroundColor: 'var(--sz-bg)',
              border: '1px solid var(--sz-border)',
              color: 'var(--sz-text)',
            }}
          />
          <button
            onClick={sendMessage}
            disabled={isStreaming || !input.trim()}
            className="flex items-center justify-center w-9 h-9 rounded-xl transition-colors shrink-0"
            style={{
              backgroundColor:
                isStreaming || !input.trim() ? 'var(--sz-border)' : 'var(--sz-coral)',
              color: isStreaming || !input.trim() ? 'var(--sz-muted)' : '#fff',
            }}
            aria-label="Enviar"
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* Floating button — hidden when drawer is open */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-transform hover:scale-105"
          style={{ backgroundColor: 'var(--sz-coral)' }}
          aria-label="Assistente Virtual"
          title="Assistente Virtual"
        >
          <MessageCircle size={22} color="#fff" />
        </button>
      )}
    </>
  )
}
