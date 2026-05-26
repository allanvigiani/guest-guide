import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Wifi, DoorOpen, CheckCircle2, XCircle, Clock,
  Users, BedDouble, Bath, PawPrint, Cigarette,
  PartyPopper, Baby, Tv, Wind, ChefHat, WashingMachine,
  Building2, Flower2, Flame, Waves, Car, ArrowLeft, MessageCircle, MapPin,
} from "lucide-react"
import { findPropertyByCode } from "@/domain/property/property.repository"
import { getPropertyByCode } from "@/domain/property/property.service"
import type { PropertyAmenities } from "@/domain/property/property.types"
import { ExperiencesSection, ExperiencesSkeleton } from "./experiences-section"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ propertyCode: string }>
}) {
  const { propertyCode } = await params
  const property = await findPropertyByCode(propertyCode.toUpperCase())
  if (!property) return { title: "Imóvel não encontrado" }
  return {
    title: `${property.name} — Guia do Hóspede`,
    description: `Seu guia digital para ${property.name} em ${property.address?.city ?? "destino"}.`,
  }
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ propertyCode: string }>
}) {
  const { propertyCode } = await params
  const property = await getPropertyByCode(propertyCode.toUpperCase())

  const { address, operational, rules, amenities, host } = property

  return (
    <div style={{ backgroundColor: "var(--sz-bg)", minHeight: "100dvh" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ backgroundColor: "var(--sz-navy)" }}
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span className="font-extrabold text-white text-xl tracking-tight">seazone</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-white/60 text-sm hidden sm:block">Guia do Hóspede</span>
          {host && (
            <a
              href={`https://wa.me/${host.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white transition-colors cursor-pointer"
              style={{ backgroundColor: "var(--sz-coral)" }}
            >
              <MessageCircle size={14} />
              Atendimento
            </a>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex items-center justify-center" style={{ minHeight: "460px" }}>
        <div className="absolute inset-0 z-0">
          {property.images[0] ? (
            <Image
              src={property.images[0]}
              alt={property.name}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          ) : (
            <div className="w-full h-full" style={{ backgroundColor: "var(--sz-navy)" }} />
          )}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, rgba(13,27,42,0.6) 0%, rgba(13,27,42,0.75) 100%)" }}
          />
        </div>

        <div className="relative z-10 text-center px-4 py-16 max-w-2xl mx-auto">
          <span
            className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-4"
            style={{ backgroundColor: "var(--sz-coral)", color: "#fff" }}
          >
            {property.code}
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-2">
            Bem-vindo à sua experiência{" "}
            <span style={{ color: "var(--sz-coral)" }}>inesquecível</span>
          </h1>
          <p className="text-white/80 text-lg mb-1">{property.name}</p>
          {address && (
            <p className="text-white/60 text-sm">
              {address.neighborhood}, {address.city} — {address.state}
            </p>
          )}
        </div>

        {/* Floating quick-info cards */}
        {rules && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20 w-full max-w-2xl px-4">
            <div className="grid grid-cols-3 gap-3">
              <QuickCard
                icon={<CheckCircle2 size={22} style={{ color: "#3B82F6" }} />}
                label="Check-in"
                value={`A partir das ${rules.checkInTime}`}
              />
              <QuickCard
                icon={<Clock size={22} style={{ color: "var(--sz-coral)" }} />}
                label="Check-out"
                value={`Até as ${rules.checkOutTime}`}
              />
              <QuickCard
                icon={<Wifi size={22} style={{ color: "#8B5CF6" }} />}
                label="Wi-Fi"
                value={operational?.wifiNetwork ?? "—"}
              />
            </div>
          </div>
        )}
      </section>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-4 pb-16" style={{ paddingTop: rules ? "72px" : "24px" }}>
        {/* Stats bar */}
        <div
          className="flex items-center justify-center gap-6 py-4 mb-6 rounded-2xl text-sm font-medium"
          style={{ backgroundColor: "var(--sz-card)", border: "1px solid var(--sz-border)" }}
        >
          <StatItem icon={<BedDouble size={16} />} label={`${property.bedroomQty} quarto${property.bedroomQty > 1 ? "s" : ""}`} />
          <Divider />
          <StatItem icon={<Bath size={16} />} label={`${property.bathroomQty} banheiro${property.bathroomQty > 1 ? "s" : ""}`} />
          <Divider />
          <StatItem icon={<Users size={16} />} label={`Até ${property.guestCapacity} hóspedes`} />
        </div>

        <div className="flex flex-col gap-4">
          {/* Access */}
          {operational && (
            <SectionCard title="Acesso ao imóvel" icon={<DoorOpen size={18} />}>
              <InfoRow label="Tipo de acesso" value={
                operational.propertyAccessType === "smart_lock" ? "Fechadura eletrônica"
                  : operational.propertyAccessType === "keybox" ? "Cofre de chaves"
                  : operational.propertyAccessType
              } />
              <InfoRow label="Código" value={operational.propertyPassword} mono />
              {operational.propertyAccessInstructions && (
                <p className="text-sm mt-2" style={{ color: "var(--sz-muted)" }}>
                  {operational.propertyAccessInstructions}
                </p>
              )}
              {operational.hasParkingSpot && (
                <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--sz-border)" }}>
                  <div className="flex items-center gap-1.5 mb-2 text-sm font-semibold" style={{ color: "var(--sz-navy)" }}>
                    <Car size={14} /> Estacionamento
                  </div>
                  {operational.parkingSpotIdentifier && (
                    <InfoRow label="Vaga" value={operational.parkingSpotIdentifier} />
                  )}
                  {operational.parkingSpotInstructions && (
                    <p className="text-sm mt-1" style={{ color: "var(--sz-muted)" }}>
                      {operational.parkingSpotInstructions}
                    </p>
                  )}
                </div>
              )}
            </SectionCard>
          )}

          {/* Rules */}
          {rules && (
            <SectionCard title="Regras da casa" icon={<CheckCircle2 size={18} />}>
              <div className="grid grid-cols-2 gap-2">
                <RuleItem icon={<PawPrint size={13} />} label="Pets permitidos" allowed={rules.allowPet} />
                <RuleItem icon={<Cigarette size={13} />} label="Fumar" allowed={rules.smokingPermitted} />
                <RuleItem icon={<Users size={13} />} label="Crianças" allowed={rules.suitableForChildren} />
                <RuleItem icon={<Baby size={13} />} label="Bebês" allowed={rules.suitableForBabies} />
                <RuleItem icon={<PartyPopper size={13} />} label="Eventos" allowed={rules.eventsPermitted} />
              </div>
            </SectionCard>
          )}

          {/* Experiences */}
          <Suspense fallback={<ExperiencesSkeleton />}>
            <ExperiencesSection property={property} />
          </Suspense>

          {/* Amenities */}
          {amenities && (
            <SectionCard title="Comodidades" icon={<CheckCircle2 size={18} />}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {AMENITY_LIST.filter(({ key }) => amenities[key as keyof PropertyAmenities] === true).map(({ key, label, icon }) => (
                  <div key={key} className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--sz-text)" }}>
                    <span style={{ color: "var(--sz-coral)" }}>{icon}</span>
                    {label}
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Wi-Fi */}
          {operational && (
            <SectionCard title="Wi-Fi" icon={<Wifi size={18} />}>
              <InfoRow label="Rede" value={operational.wifiNetwork} />
              <InfoRow label="Senha" value={operational.wifiPassword} mono />
            </SectionCard>
          )}

          {/* Contact */}
          {host && (
            <SectionCard title="Seu anfitrião" icon={<MapPin size={18} />}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-bold text-base" style={{ color: "var(--sz-navy)" }}>{host.name}</p>
                  <p className="text-sm" style={{ color: "var(--sz-muted)" }}>{host.phone}</p>
                </div>
                <a
                  href={`https://wa.me/${host.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-colors cursor-pointer"
                  style={{ backgroundColor: "var(--sz-coral)" }}
                >
                  <MessageCircle size={15} />
                  WhatsApp
                </a>
              </div>
              {address && (
                <div
                  className="flex items-start gap-2 pt-4"
                  style={{ borderTop: "1px solid var(--sz-border)" }}
                >
                  <MapPin size={15} className="mt-0.5 shrink-0" style={{ color: "var(--sz-coral)" }} />
                  <p className="text-sm leading-relaxed" style={{ color: "var(--sz-muted)" }}>
                    {address.street}, {address.number}
                    {address.complement ? ` — ${address.complement}` : ""},{" "}
                    {address.neighborhood}, {address.city} — {address.state}, {address.postalCode}
                  </p>
                </div>
              )}
            </SectionCard>
          )}
        </div>
      </main>

      <footer
        className="py-6 text-center text-xs"
        style={{ backgroundColor: "var(--sz-navy)", color: "rgba(255,255,255,0.4)" }}
      >
        © {new Date().getFullYear()} Seazone · {property.code}
      </footer>
    </div>
  )
}

function QuickCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div
      className="flex flex-col items-center text-center py-4 px-3 rounded-xl shadow-md"
      style={{ backgroundColor: "var(--sz-card)" }}
    >
      <div className="mb-1">{icon}</div>
      <span className="text-xs font-bold mb-0.5" style={{ color: "var(--sz-navy)" }}>{label}</span>
      <span className="text-xs" style={{ color: "var(--sz-muted)" }}>{value}</span>
    </div>
  )
}

function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
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

function InfoRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1">
      <span className="text-sm" style={{ color: "var(--sz-muted)" }}>{label}</span>
      <span
        className={`text-sm font-semibold ${mono ? "font-mono tracking-widest" : ""}`}
        style={{ color: "var(--sz-navy)" }}
      >
        {value}
      </span>
    </div>
  )
}

function StatItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-1.5" style={{ color: "var(--sz-muted)" }}>
      <span style={{ color: "var(--sz-coral)" }}>{icon}</span>
      {label}
    </span>
  )
}

function Divider() {
  return <span className="w-px h-4" style={{ backgroundColor: "var(--sz-border)" }} />
}

function RuleItem({ icon, label, allowed }: { icon: React.ReactNode; label: string; allowed: boolean }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {allowed
        ? <CheckCircle2 size={14} style={{ color: "#16A34A", flexShrink: 0 }} />
        : <XCircle size={14} style={{ color: "#DC2626", flexShrink: 0 }} />}
      <span className="flex items-center gap-1" style={{ color: "var(--sz-muted)" }}>
        {icon} {label}
      </span>
    </div>
  )
}

const AMENITY_LIST: { key: string; label: string; icon: React.ReactNode }[] = [
  { key: "wifi",            label: "Wi-Fi",          icon: <Wifi size={14} /> },
  { key: "tv",              label: "TV",              icon: <Tv size={14} /> },
  { key: "airConditioning", label: "Ar-condicionado", icon: <Wind size={14} /> },
  { key: "kitchen",         label: "Cozinha",         icon: <ChefHat size={14} /> },
  { key: "washingMachine",  label: "Lavadora",        icon: <WashingMachine size={14} /> },
  { key: "elevator",        label: "Elevador",        icon: <Building2 size={14} /> },
  { key: "balcony",         label: "Varanda",         icon: <Flower2 size={14} /> },
  { key: "bbqGrill",        label: "Churrasqueira",   icon: <Flame size={14} /> },
  { key: "dishwasher",      label: "Lava-louças",     icon: <ChefHat size={14} /> },
  { key: "pool",            label: "Piscina",         icon: <Waves size={14} /> },
]
