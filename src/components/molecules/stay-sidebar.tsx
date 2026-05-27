import { MessageCircle } from "lucide-react"

type Props = {
  checkInTime?: string | null
  checkOutTime?: string | null
  wifiNetwork?: string | null
  wifiPassword?: string | null
  accessType?: string | null
  accessCode?: string | null
  hostPhone?: string | null
}

export function StaySidebar({
  checkInTime,
  checkOutTime,
  wifiNetwork,
  wifiPassword,
  accessType,
  accessCode,
  hostPhone,
}: Props) {
  const accessLabel =
    accessType === "smart_lock" ? "Fechadura eletrônica"
    : accessType === "keybox" ? "Cofre de chaves"
    : accessType ?? "—"

  return (
    <div
      className="rounded-2xl p-5"
      style={{ backgroundColor: "var(--sz-card)", border: "1px solid var(--sz-border)" }}
    >
      <h2 className="text-sm font-bold mb-4" style={{ color: "var(--sz-navy)" }}>
        Sua estadia
      </h2>

      <div className="flex flex-col gap-3 text-sm">
        {checkInTime && (
          <div className="flex justify-between">
            <span style={{ color: "var(--sz-muted)" }}>Check-in</span>
            <span className="font-semibold" style={{ color: "var(--sz-text)" }}>A partir das {checkInTime}</span>
          </div>
        )}
        {checkOutTime && (
          <div className="flex justify-between">
            <span style={{ color: "var(--sz-muted)" }}>Check-out</span>
            <span className="font-semibold" style={{ color: "var(--sz-text)" }}>Até as {checkOutTime}</span>
          </div>
        )}

        {(wifiNetwork || wifiPassword) && (
          <>
            <hr style={{ borderColor: "var(--sz-border)" }} />
            {wifiNetwork && (
              <div className="flex justify-between gap-2">
                <span className="shrink-0" style={{ color: "var(--sz-muted)" }}>Wi-Fi</span>
                <span className="font-semibold text-right break-all" style={{ color: "var(--sz-text)" }}>{wifiNetwork}</span>
              </div>
            )}
            {wifiPassword && (
              <div className="flex justify-between gap-2">
                <span className="shrink-0" style={{ color: "var(--sz-muted)" }}>Senha</span>
                <span className="font-mono font-semibold text-right break-all" style={{ color: "var(--sz-text)" }}>{wifiPassword}</span>
              </div>
            )}
          </>
        )}

        {accessCode && (
          <>
            <hr style={{ borderColor: "var(--sz-border)" }} />
            <div className="flex justify-between">
              <span style={{ color: "var(--sz-muted)" }}>Acesso</span>
              <span className="font-semibold" style={{ color: "var(--sz-text)" }}>{accessLabel}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--sz-muted)" }}>Código</span>
              <span className="font-mono font-bold" style={{ color: "var(--sz-navy)" }}>{accessCode}</span>
            </div>
          </>
        )}
      </div>

      {hostPhone && (
        <a
          href={`https://wa.me/${hostPhone.replace(/\D/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full mt-5 py-3 rounded-xl text-sm font-semibold text-white cursor-pointer"
          style={{ backgroundColor: "var(--sz-coral)" }}
        >
          <MessageCircle size={15} />
          Falar com o Anfitrião
        </a>
      )}
    </div>
  )
}
