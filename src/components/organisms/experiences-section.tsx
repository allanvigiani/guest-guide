import { UtensilsCrossed, Landmark, ShoppingBag, Sparkles, RefreshCw, Leaf } from "lucide-react"
import { getOrGenerateExperiences } from "@/domain/experiences/experiences.service"
import type { PropertyWithRelations } from "@/domain/property/property.types"
import type { Restaurant, Attraction, Essential } from "@/domain/experiences/experiences.types"

export async function ExperiencesSection({ property }: { property: PropertyWithRelations }) {
  let experiences: Awaited<ReturnType<typeof getOrGenerateExperiences>>
  try {
    experiences = await getOrGenerateExperiences(property)
  } catch (err) {
    console.error("[ExperiencesSection] Failed to generate experiences:", err)
    const message = err instanceof Error ? err.message : "Erro desconhecido"
    return (
      <div
        className="rounded-2xl p-5 text-sm"
        style={{ backgroundColor: "var(--sz-card)", border: "1px dashed var(--sz-border)", color: "var(--sz-muted)" }}
      >
        Não foi possível carregar as experiências locais. {message}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4" style={{ animation: "sz-fade-in 0.45s ease both" }}>
      {/* Welcome message */}
      <div
        className="rounded-2xl p-5"
        style={{ backgroundColor: "var(--sz-card)", border: "1px solid var(--sz-border)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={18} style={{ color: "var(--sz-coral)" }} />
          <h2 className="text-base font-bold" style={{ color: "var(--sz-navy)" }}>
            Mensagem do guia
          </h2>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "var(--sz-muted)" }}>
          {experiences.welcomeMessage}
        </p>
      </div>

      {/* Restaurants */}
      <ExperienceCard title="Restaurantes próximos" icon={<UtensilsCrossed size={18} />}>
        <div className="flex flex-col gap-3">
          {experiences.restaurants.map((r: Restaurant) => (
            <PlaceRow key={r.name} name={r.name} distance={r.distance} description={r.description} />
          ))}
        </div>
      </ExperienceCard>

      {/* Attractions */}
      <ExperienceCard title="Atrações e pontos turísticos" icon={<Landmark size={18} />}>
        <div className="flex flex-col gap-3">
          {experiences.attractions.map((a: Attraction) => (
            <PlaceRow key={a.name} name={a.name} distance={a.distance} description={a.description} />
          ))}
        </div>
      </ExperienceCard>

      {/* Essentials */}
      <ExperienceCard title="Serviços essenciais" icon={<ShoppingBag size={18} />}>
        <div className="flex flex-col gap-3">
          {experiences.essentials.map((e: Essential) => (
            <PlaceRow key={e.name} name={e.name} distance={e.distance} description={e.description} badge={ESSENTIAL_LABELS[e.type] ?? e.type} />
          ))}
        </div>
      </ExperienceCard>

      {/* Seasonal tip */}
      <div
        className="rounded-2xl p-5"
        style={{ backgroundColor: "var(--sz-card)", border: "1px solid var(--sz-border)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Leaf size={18} style={{ color: "var(--sz-coral)" }} />
          <h2 className="text-base font-bold" style={{ color: "var(--sz-navy)" }}>
            Dica da temporada
          </h2>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "var(--sz-muted)" }}>
          {experiences.seasonalTip}
        </p>
      </div>

      {/* Regenerate button (no action yet) */}
      <button
        type="button"
        disabled
        className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-semibold cursor-not-allowed"
        style={{
          backgroundColor: "var(--sz-card)",
          border: "1px dashed var(--sz-border)",
          color: "var(--sz-muted)",
        }}
      >
        <RefreshCw size={15} />
        Gerar mais experiências
      </button>
    </div>
  )
}

export { ExperiencesSkeleton } from "./experiences-skeleton"

function ExperienceCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ backgroundColor: "var(--sz-card)", border: "1px solid var(--sz-border)" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span style={{ color: "var(--sz-coral)" }}>{icon}</span>
        <h2 className="text-base font-bold" style={{ color: "var(--sz-navy)" }}>{title}</h2>
      </div>
      {children}
    </div>
  )
}

function PlaceRow({ name, distance, description, badge }: { name: string; distance: string; description: string; badge?: string }) {
  return (
    <div className="pb-3" style={{ borderBottom: "1px solid var(--sz-border)" }}>
      <div className="flex items-baseline justify-between gap-2 mb-0.5">
        <span className="text-sm font-semibold" style={{ color: "var(--sz-navy)" }}>{name}</span>
        <div className="flex items-center gap-2 shrink-0">
          {badge && (
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "rgba(255,107,74,0.1)", color: "var(--sz-coral)" }}
            >
              {badge}
            </span>
          )}
          <span className="text-xs" style={{ color: "var(--sz-muted)" }}>{distance}</span>
        </div>
      </div>
      <p className="text-xs leading-relaxed" style={{ color: "var(--sz-muted)" }}>{description}</p>
    </div>
  )
}

const ESSENTIAL_LABELS: Record<string, string> = {
  pharmacy: "Farmácia",
  supermarket: "Mercado",
  hospital: "Hospital",
  atm: "Caixa 24h",
  gas_station: "Posto",
  laundry: "Lavanderia",
}
