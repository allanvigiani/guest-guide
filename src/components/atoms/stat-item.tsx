export function StatItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-1.5" style={{ color: "var(--sz-muted)" }}>
      <span style={{ color: "var(--sz-coral)" }}>{icon}</span>
      {label}
    </span>
  )
}
