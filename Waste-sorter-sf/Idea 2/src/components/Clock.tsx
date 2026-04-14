import React from 'react'

const REAL_SECONDS_PER_HOUR = 5

/** Minutes from midnight: 7:30 AM = 450, 4:00 PM = 960 */
export const START_MINUTES = 7 * 60 + 30
export const END_MINUTES = 16 * 60

export type ClockProps = {
  /** Current time as minutes from midnight (e.g. 450 = 7:30 AM). */
  minutesFromMidnight: number
  running: boolean
}

function formatTime(minutes: number): { hour12: number; minute: number; ampm: string; label: string } {
  const hour = Math.floor(minutes / 60)
  const minute = minutes % 60
  const ampm = hour < 12 ? 'AM' : 'PM'
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  const label = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening'
  return { hour12, minute, ampm, label }
}

export function Clock({ minutesFromMidnight, running }: ClockProps) {
  const { hour12, minute, ampm, label } = formatTime(minutesFromMidnight)

  return (
    <div
      className="flex flex-col items-end gap-1 rounded-xl px-3 py-2 shadow-sm backdrop-blur-sm"
      style={{
        backgroundColor: 'rgba(255,255,255,0.85)',
        border: '1px solid rgba(0,0,0,0.12)',
      }}
    >
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full animate-live-dot" style={{ backgroundColor: '#EF4444' }} />
        <span className="font-display text-[2rem] font-bold leading-none tabular-nums" style={{ color: '#1A1A1A' }}>
          {hour12}:{minute === 0 ? '00' : String(minute).padStart(2, '0')} {ampm}
        </span>
      </div>
      <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#555555' }}>
        {label} · 7:30 AM – 4:00 PM
      </span>
      {running && (
        <span className="text-[10px]" style={{ color: '#555555' }}>1 hour = {REAL_SECONDS_PER_HOUR}s</span>
      )}
    </div>
  )
}

export { REAL_SECONDS_PER_HOUR }
