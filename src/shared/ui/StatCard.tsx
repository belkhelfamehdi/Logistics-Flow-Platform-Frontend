interface StatCardProps {
  label: string
  value: string
  hint?: string
}

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <article className="stat-card">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      {hint ? <div className="muted">{hint}</div> : null}
    </article>
  )
}
