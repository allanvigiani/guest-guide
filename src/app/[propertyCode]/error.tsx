"use client"

import { useEffect } from "react"
import { AlertTriangle, RotateCcw, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div style={{ backgroundColor: "var(--sz-bg)", minHeight: "100dvh" }}>
      <header
        className="flex items-center justify-between px-6 py-4"
        style={{ backgroundColor: "var(--sz-navy)" }}
      >
        <span className="text-white font-extrabold text-xl tracking-tight">seazone</span>
      </header>

      <main
        className="flex flex-col items-center justify-center text-center px-4"
        style={{ minHeight: "calc(100dvh - 64px)" }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
          style={{ backgroundColor: "rgba(240,82,82,0.1)" }}
        >
          <AlertTriangle size={28} style={{ color: "var(--sz-coral)" }} />
        </div>

        <h1 className="text-3xl font-extrabold mb-3" style={{ color: "var(--sz-navy)" }}>
          Algo deu errado
        </h1>

        <p className="text-base mb-8 max-w-sm" style={{ color: "var(--sz-muted)" }}>
          Não foi possível carregar o guia do imóvel. Isso pode ser uma instabilidade temporária.
          Tente novamente ou entre em contato com seu anfitrião.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: "var(--sz-coral)" }}
          >
            <RotateCcw size={16} />
            Tentar novamente
          </button>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold transition-colors cursor-pointer"
            style={{
              backgroundColor: "transparent",
              color: "var(--sz-navy)",
              border: "2px solid var(--sz-navy)",
            }}
          >
            <ArrowLeft size={16} />
            Voltar ao início
          </Link>
        </div>
      </main>
    </div>
  )
}
