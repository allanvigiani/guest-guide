import Link from "next/link"
import { MapPin, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div style={{ backgroundColor: "var(--sz-bg)", minHeight: "100dvh" }}>
      <header
        className="flex items-center justify-between px-6 py-4"
        style={{ backgroundColor: "var(--sz-navy)" }}
      >
        <span className="text-white font-extrabold text-xl tracking-tight">seazone</span>
      </header>

      <main className="flex flex-col items-center justify-center text-center px-4" style={{ minHeight: "calc(100dvh - 64px)" }}>
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
          style={{ backgroundColor: "rgba(240,82,82,0.1)" }}
        >
          <MapPin size={28} style={{ color: "var(--sz-coral)" }} />
        </div>

        <h1 className="text-3xl font-extrabold mb-3" style={{ color: "var(--sz-navy)" }}>
          Imóvel não encontrado
        </h1>

        <p className="text-base mb-8 max-w-sm" style={{ color: "var(--sz-muted)" }}>
          O código informado não corresponde a nenhum imóvel cadastrado. Verifique o código com seu anfitrião.
        </p>

        <Link
          href="/"
          className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-colors cursor-pointer"
          style={{ backgroundColor: "var(--sz-coral)" }}
        >
          <ArrowLeft size={16} />
          Voltar à página inicial
        </Link>
      </main>
    </div>
  )
}
