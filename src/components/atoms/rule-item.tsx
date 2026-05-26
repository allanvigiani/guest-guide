import { CheckCircle2, XCircle } from "lucide-react"

export function RuleItem({ icon, label, allowed }: { icon: React.ReactNode; label: string; allowed: boolean }) {
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
