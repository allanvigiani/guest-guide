"use client"

import { useState, useEffect } from "react"

const LOADING_MESSAGES = [
  "Preparando sua mensagem de boas-vindas...",
  "Buscando os melhores restaurantes...",
  "Encontrando os pontos turísticos...",
  "Mapeando os serviços essenciais...",
  "Selecionando a dica da temporada...",
]

export function ExperiencesSkeleton() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % LOADING_MESSAGES.length), 2000)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{ position: "relative" }}>
      <div className="flex flex-col gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl p-5 animate-pulse"
            style={{ backgroundColor: "var(--sz-card)", border: "1px solid var(--sz-border)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: "var(--sz-border)" }} />
              <div className="h-4 w-40 rounded" style={{ backgroundColor: "var(--sz-border)" }} />
            </div>
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((j) => (
                <div key={j} className="flex flex-col gap-1.5">
                  <div className="flex justify-between">
                    <div className="h-3 w-36 rounded" style={{ backgroundColor: "var(--sz-border)" }} />
                    <div className="h-3 w-20 rounded" style={{ backgroundColor: "var(--sz-border)" }} />
                  </div>
                  <div className="h-3 w-full rounded" style={{ backgroundColor: "var(--sz-border)" }} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(243,244,248,0.82)",
          backdropFilter: "blur(2px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          borderRadius: "16px",
        }}
      >
        <div
          style={{
            width: 22,
            height: 22,
            border: "2.5px solid var(--sz-border)",
            borderTopColor: "var(--sz-coral)",
            borderRadius: "50%",
            animation: "spin 0.7s linear infinite",
          }}
        />
        <div
          key={idx}
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "var(--sz-navy)",
            textAlign: "center",
            maxWidth: 180,
            lineHeight: 1.4,
            animation: "sz-fade-in 0.4s ease both",
          }}
        >
          {LOADING_MESSAGES[idx]}
        </div>
      </div>
    </div>
  )
}
