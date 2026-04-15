type HealthBarProps = {
  health: number
  label: string
}

export function HealthBar({ health, label }: HealthBarProps) {
  const bounded = Math.max(0, Math.min(100, health))
  return (
    <div className="draco-health-card" aria-live="polite">
      <div className="draco-health-header">
        <span>Draco Health</span>
        <strong>{bounded}%</strong>
      </div>
      <div className="draco-health-track" role="progressbar" aria-valuenow={bounded} aria-valuemin={0} aria-valuemax={100}>
        <div className="draco-health-fill" style={{ width: `${bounded}%` }} />
      </div>
      <p>{label}</p>
    </div>
  )
}
