import { Suspense } from "react"
import Link from "next/link"
import VirtualAssistant from "@/components/organisms/virtual-assistant"
import Image from "next/image"
import {
  Wifi, DoorOpen, CheckCircle2, Clock,
  Users, BedDouble, Bath, PawPrint, Cigarette,
  PartyPopper, Baby, Tv, Wind, ChefHat, WashingMachine,
  Building2, Flower2, Flame, Waves, Car, ArrowLeft, MessageCircle, MapPin,
} from "lucide-react"
import { findPropertyByCode } from "@/domain/property/property.repository"
import { getPropertyByCode } from "@/domain/property/property.service"
import type { PropertyAmenities } from "@/domain/property/property.types"
import { ExperiencesSection, ExperiencesSkeleton } from "@/components/organisms/experiences-section"
import { InfoRow } from "@/components/atoms/info-row"
import { RuleItem } from "@/components/atoms/rule-item"
import { QuickCard } from "@/components/molecules/quick-card"
import { SectionCard } from "@/components/molecules/section-card"
import { StaySidebar } from "@/components/molecules/stay-sidebar"

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
              Contate o Anfitrião
            </a>
          )}
        </div>
      </header>

      {/* Hero — foto limpa, sem texto sobreposto */}
      <div className="w-full h-64 lg:h-[420px] relative" style={{ backgroundColor: "var(--sz-navy)" }}>
        {property.images[0] && (
          <Image
            src={property.images[0]}
            alt={property.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        )}
      </div>

      {/* Título + stats + quick-info — fundo branco, conectado ao hero */}
      <div style={{ backgroundColor: "var(--sz-card)" }}>
        <div className="max-w-5xl mx-auto px-4 lg:px-8">

          {/* Título */}
          <div className="pt-5 pb-4">
            <span
              className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3"
              style={{ backgroundColor: "var(--sz-coral)", color: "#fff" }}
            >
              {property.code}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight mb-1" style={{ color: "var(--sz-navy)" }}>
              {property.name}
            </h1>
            {address && (
              <p className="flex items-center gap-1 text-sm" style={{ color: "var(--sz-muted)" }}>
                <MapPin size={13} />
                {address.neighborhood}, {address.city} — {address.state}
              </p>
            )}
          </div>

          {/* Stats bar */}
          <div className="flex items-center gap-4 pb-5 text-sm" style={{ color: "var(--sz-muted)" }}>
            <span className="flex items-center gap-1.5">
              <BedDouble size={14} style={{ color: "var(--sz-coral)" }} />
              <span>{property.bedroomQty} quarto{property.bedroomQty > 1 ? "s" : ""}</span>
            </span>
            <span style={{ color: "var(--sz-border)" }}>·</span>
            <span className="flex items-center gap-1.5">
              <Bath size={14} style={{ color: "var(--sz-coral)" }} />
              <span>{property.bathroomQty} banheiro{property.bathroomQty > 1 ? "s" : ""}</span>
            </span>
            <span style={{ color: "var(--sz-border)" }}>·</span>
            <span className="flex items-center gap-1.5">
              <Users size={14} style={{ color: "var(--sz-coral)" }} />
              <span>Até {property.guestCapacity} hóspedes</span>
            </span>
          </div>

          {/* Quick-info cards — mobile only */}
          {rules && (
            <div className="lg:hidden grid grid-cols-3 gap-3 pb-5">
              <QuickCard
                icon={<CheckCircle2 size={20} style={{ color: "#3B82F6" }} />}
                label="Check-in"
                value={`A partir das ${rules.checkInTime}`}
              />
              <QuickCard
                icon={<Clock size={20} style={{ color: "var(--sz-coral)" }} />}
                label="Check-out"
                value={`Até as ${rules.checkOutTime}`}
              />
              <QuickCard
                icon={<Wifi size={20} style={{ color: "#8B5CF6" }} />}
                label="Wi-Fi"
                value={operational?.wifiNetwork ?? "—"}
              />
            </div>
          )}

        </div>
      </div>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 lg:px-8 pt-8 pb-16">
        <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-12 lg:items-start">

          {/* Left column — seções */}
          <div>

            {/* Acesso */}
            {operational && (
              <section>
                <h2 className="flex items-center gap-2 text-base font-bold mb-4" style={{ color: "var(--sz-navy)" }}>
                  <span style={{ color: "var(--sz-coral)" }}><DoorOpen size={18} /></span>
                  Acesso ao imóvel
                </h2>
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
                <hr className="my-6" style={{ borderColor: "var(--sz-border)" }} />
              </section>
            )}

            {/* Regras */}
            {rules && (
              <section>
                <h2 className="flex items-center gap-2 text-base font-bold mb-4" style={{ color: "var(--sz-navy)" }}>
                  <span style={{ color: "var(--sz-coral)" }}><CheckCircle2 size={18} /></span>
                  Regras da casa
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  <RuleItem icon={<PawPrint size={13} />} label="Pets permitidos" allowed={rules.allowPet} />
                  <RuleItem icon={<Cigarette size={13} />} label="Fumar" allowed={rules.smokingPermitted} />
                  <RuleItem icon={<Users size={13} />} label="Crianças" allowed={rules.suitableForChildren} />
                  <RuleItem icon={<Baby size={13} />} label="Bebês" allowed={rules.suitableForBabies} />
                  <RuleItem icon={<PartyPopper size={13} />} label="Eventos" allowed={rules.eventsPermitted} />
                </div>
                <hr className="my-6" style={{ borderColor: "var(--sz-border)" }} />
              </section>
            )}

            {/* Experiências */}
            <section>
              <Suspense fallback={<ExperiencesSkeleton />}>
                <ExperiencesSection property={property} />
              </Suspense>
              <hr className="my-6" style={{ borderColor: "var(--sz-border)" }} />
            </section>

            {/* Comodidades */}
            {amenities && (
              <section>
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
                <hr className="my-6" style={{ borderColor: "var(--sz-border)" }} />
              </section>
            )}

            {/* Wi-Fi */}
            {operational && (
              <section>
                <h2 className="flex items-center gap-2 text-base font-bold mb-4" style={{ color: "var(--sz-navy)" }}>
                  <span style={{ color: "var(--sz-coral)" }}><Wifi size={18} /></span>
                  Wi-Fi
                </h2>
                <InfoRow label="Rede" value={operational.wifiNetwork} />
                <InfoRow label="Senha" value={operational.wifiPassword} mono />
                <hr className="my-6" style={{ borderColor: "var(--sz-border)" }} />
              </section>
            )}

            {/* Anfitrião */}
            {host && (
              <section>
                <h2 className="flex items-center gap-2 text-base font-bold mb-4" style={{ color: "var(--sz-navy)" }}>
                  <span style={{ color: "var(--sz-coral)" }}><MapPin size={18} /></span>
                  Seu anfitrião
                </h2>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-bold text-base" style={{ color: "var(--sz-navy)" }}>{host.name}</p>
                    <p className="text-sm" style={{ color: "var(--sz-muted)" }}>{host.phone}</p>
                  </div>
                  <a
                    href={`https://wa.me/${host.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white cursor-pointer"
                    style={{ backgroundColor: "var(--sz-coral)" }}
                  >
                    <MessageCircle size={15} />
                    WhatsApp
                  </a>
                </div>
                {address && (
                  <div className="flex items-start gap-2 pt-4" style={{ borderTop: "1px solid var(--sz-border)" }}>
                    <MapPin size={15} className="mt-0.5 shrink-0" style={{ color: "var(--sz-coral)" }} />
                    <p className="text-sm leading-relaxed" style={{ color: "var(--sz-muted)" }}>
                      {address.street}, {address.number}
                      {address.complement ? ` — ${address.complement}` : ""},{" "}
                      {address.neighborhood}, {address.city} — {address.state}, {address.postalCode}
                    </p>
                  </div>
                )}
              </section>
            )}

          </div>

          {/* Right column — sidebar sticky, desktop only */}
          <div className="hidden lg:block sticky top-20">
            <StaySidebar
              checkInTime={rules?.checkInTime}
              checkOutTime={rules?.checkOutTime}
              wifiNetwork={operational?.wifiNetwork}
              wifiPassword={operational?.wifiPassword}
              accessType={operational?.propertyAccessType}
              accessCode={operational?.propertyPassword}
              hostPhone={host?.phone}
            />
          </div>

        </div>
      </main>

      <footer
        className="py-6 text-center text-xs"
        style={{ backgroundColor: "var(--sz-navy)", color: "rgba(255,255,255,0.4)" }}
      >
        © {new Date().getFullYear()} Seazone · {property.code}
      </footer>

      <VirtualAssistant propertyCode={property.code} propertyName={property.name} />
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
