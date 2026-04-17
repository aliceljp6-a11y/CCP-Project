import type { HealthTier } from '../types'

export const MAX_HEALTH = 100
export const START_HEALTH = 62

export const HEALTH_TIERS: Array<{
  tier: HealthTier
  min: number
  max: number
  label: string
  dracoEmoji: string
  dracoImagePath?: string
}> = [
  { tier: 'thriving', min: 80, max: 100, label: 'Thriving', dracoEmoji: '🧚‍♂️✨', dracoImagePath: '/draco/draco-health-100.jpg' },
  {
    tier: 'mostlyHealthy',
    min: 60,
    max: 79,
    label: 'Mostly Healthy',
    dracoEmoji: '🧚‍♂️🌿',
    dracoImagePath: '/draco/draco-health-75.jpg',
  },
  { tier: 'tired', min: 40, max: 59, label: 'A Little Tired', dracoEmoji: '🧚‍♂️🍃', dracoImagePath: '/draco/draco-health-50.jpg' },
  { tier: 'weak', min: 20, max: 39, label: 'Weak', dracoEmoji: '🧚‍♂️💨', dracoImagePath: '/draco/draco-health-25.jpg' },
  { tier: 'critical', min: 0, max: 19, label: 'Critical', dracoEmoji: '🧚‍♂️🫧', dracoImagePath: '/draco/draco-health-05.jpg' },
]

export function getHealthTier(health: number): HealthTier {
  const normalized = Math.max(0, Math.min(MAX_HEALTH, health))
  const found = HEALTH_TIERS.find((entry) => normalized >= entry.min && normalized <= entry.max)
  return found?.tier ?? 'critical'
}
