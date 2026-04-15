import type { HealthTier } from '../types'

export const HEALTH_TIER_LINES: Record<HealthTier, string> = {
  thriving: "I'm glowing with nature magic! Keep going!",
  mostlyHealthy: "I'm feeling good and hopeful!",
  tired: "I'm getting a little tired, but we can still help Earth.",
  weak: "It's getting harder for me. Please help me recover.",
  critical: "My magic is very low. Gentle choices can still help.",
}

export const POST_SORT_LINES = {
  correct: ['That goes in the right place!', 'Nice sorting!', 'You helped Earth with that choice.'],
  incorrect: ['Good try! Let me show the best bin for this one.', 'You are learning. Let us sort it together.'],
}
