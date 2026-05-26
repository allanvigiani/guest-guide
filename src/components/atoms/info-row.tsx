export function InfoRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
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
