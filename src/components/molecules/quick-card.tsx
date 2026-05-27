export function QuickCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div
      className="flex flex-col items-center text-center py-4 px-3 rounded-xl shadow-md"
      style={{ backgroundColor: "var(--sz-card)" }}
    >
      <div className="mb-1">{icon}</div>
      <span className="text-xs font-bold mb-0.5" style={{ color: "var(--sz-navy)" }}>{label}</span>
      <span className="text-xs w-full break-all text-center" style={{ color: "var(--sz-muted)" }}>{value}</span>
    </div>
  )
}
