// export const dynamic = "force-dynamic"

import Link from "next/link"
import Image from "next/image"
import { BedDouble, Bath, Users, MapPin, MessageCircle } from "lucide-react"
import { findAllProperties } from "@/domain/property/property.repository"

export default async function Home() {
  const properties = await findAllProperties()

  return (
    <div style={{ backgroundColor: "var(--sz-bg)", minHeight: "100dvh" }}>
      <Header />

      {/* Hero */}
      <section className="relative flex items-center justify-center" style={{ minHeight: "500px" }}>
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600"
            alt="Propriedade Seazone"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, rgba(13,27,42,0.65) 0%, rgba(13,27,42,0.55) 100%)" }}
          />
        </div>

        <div className="relative z-10 text-center px-4 py-20 max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-3">
            Bem-vindo à sua experiência{" "}
            <span style={{ color: "var(--sz-coral)" }}>inesquecível</span>
          </h1>
          <p className="text-white/80 text-lg mb-8">
            Exclusividade e conforto em cada detalhe da sua hospedagem
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://wa.me/5500000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-colors cursor-pointer"
              style={{ backgroundColor: "var(--sz-coral)" }}
            >
              <MessageCircle size={18} />
              Falar com o Suporte
            </a>
            <button
              className="px-6 py-3 rounded-full font-semibold text-white border border-white/40 transition-colors cursor-pointer"
              style={{ backgroundColor: "rgba(255,255,255,0.12)", backdropFilter: "blur(6px)" }}
            >
              Explorar imóveis ↓
            </button>
          </div>
        </div>
      </section>

      {/* Properties grid */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8" style={{ color: "var(--sz-navy)" }}>
          Imóveis cadastrados
        </h2>
        {properties.length === 0 ? (
          <p style={{ color: "var(--sz-muted)" }}>Nenhum imóvel cadastrado ainda.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p) => (
              <Link
                key={p.id}
                href={`/${p.code}`}
                className="block rounded-2xl overflow-hidden transition-shadow hover:shadow-lg cursor-pointer"
                style={{ backgroundColor: "var(--sz-card)", border: "1px solid var(--sz-border)" }}
              >
                <div className="relative h-44">
                  {p.images[0] ? (
                    <Image
                      src={p.images[0]}
                      alt={p.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full" style={{ backgroundColor: "var(--sz-border)" }} />
                  )}
                  <span
                    className="absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-md text-white"
                    style={{ backgroundColor: "var(--sz-navy)" }}
                  >
                    {p.code}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-base mb-1 leading-snug" style={{ color: "var(--sz-navy)" }}>
                    {p.name}
                  </h3>
                  {p.address && (
                    <p className="flex items-center gap-1 text-xs mb-3" style={{ color: "var(--sz-muted)" }}>
                      <MapPin size={11} />
                      {p.address.neighborhood}, {p.address.city} — {p.address.state}
                    </p>
                  )}
                  <div className="flex gap-3 text-xs font-medium" style={{ color: "var(--sz-muted)" }}>
                    <span className="flex items-center gap-1"><BedDouble size={12} />{p.bedroomQty} qts</span>
                    <span className="flex items-center gap-1"><Bath size={12} />{p.bathroomQty} ban</span>
                    <span className="flex items-center gap-1"><Users size={12} />até {p.guestCapacity}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}

function Header() {
  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
      style={{ backgroundColor: "var(--sz-navy)" }}
    >
      <span className="text-white font-extrabold text-xl tracking-tight">seazone</span>
      <div className="flex items-center gap-4">
        <span className="text-white/60 text-sm hidden sm:block">Guia do Hóspede</span>
        <a
          href="https://wa.me/5500000000000"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white transition-colors cursor-pointer"
          style={{ backgroundColor: "var(--sz-coral)" }}
        >
          <MessageCircle size={14} />
          Contate o Suporte
        </a>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer
      className="py-6 text-center text-xs"
      style={{ backgroundColor: "var(--sz-navy)", color: "rgba(255,255,255,0.4)" }}
    >
      © {new Date().getFullYear()} Allan · Guia do Hóspede
    </footer>
  )
}
