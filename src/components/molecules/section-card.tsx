export function SectionCard({ title, icon, children, index }: { title: string; icon: React.ReactNode; children: React.ReactNode; index?: number }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        backgroundColor: "var(--sz-card)",
        border: "1px solid var(--sz-border)",
        ...(index !== undefined ? {
          animation: "sz-fade-in 0.45s ease both",
          animationDelay: `calc(${index} * 0.45s)`,
        } : {}),
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span style={{ color: "var(--sz-coral)" }}>{icon}</span>
        <h2 className="text-base font-bold" style={{ color: "var(--sz-navy)" }}>{title}</h2>
      </div>
      {children}
    </div>
  )
}
