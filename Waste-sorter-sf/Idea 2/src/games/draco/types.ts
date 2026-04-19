export type BinType = 'recycle' | 'compost' | 'landfill'

export type OutcomeType = BinType | 'donate'

export type HealthTier = 'thriving' | 'mostlyHealthy' | 'tired' | 'weak' | 'critical'

export type DracoPhase = 'intro' | 'shop' | 'consequence' | 'endSequence' | 'summary'

export type DracoItem = {
  id: string
  name: string
  cost: number
  category: 'food' | 'drink' | 'snack' | 'packaging' | 'reusable' | 'longUse'
  description: string
  /** Where the item's *resulting waste* belongs (or special case). */
  binCategory: OutcomeType | 'none'

  /** Optional image paths (recommended: under public/draco/items/...). */
  itemImage?: string
  usedImage?: string
  wasteImage?: string

  /** Draco health impact from this purchase (applied automatically). */
  dracoEffect: number

  /** Short lines used in Draco's bubble + consequence panel. */
  purchaseReaction: string
  healthReaction: string
  consequenceText: {
    usedLine: string
    wasteLine: string
    binLine: string
  }
}

export type EarthEnding = {
  tier: HealthTier
  /** Short tier label, e.g. how Earth is doing (shown under the main heading). */
  title: string
  earthEmoji: string
  earthImagePath?: string
  /** Main heading — Draco = Earth (set per ending or use default in UI). */
  mainHeading?: string
  dracoLine: string
  lessonLine: string
  /** One-line Draco voice (reveal). */
  dracoQuote?: string
}
