import type { OutcomeType } from '../types'

export const OUTCOME_EFFECTS: Record<OutcomeType, number> = {
  compost: 5,
  recycle: 2,
  donate: 2,
  landfill: -10,
}

export function effectForOutcome(outcome: OutcomeType) {
  return OUTCOME_EFFECTS[outcome]
}

