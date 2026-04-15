export type BinType = 'recycle' | 'compost' | 'landfill'

export type HealthTier = 'thriving' | 'mostlyHealthy' | 'tired' | 'weak' | 'critical'

export type DracoPhase = 'intro' | 'shop' | 'sorting' | 'endSequence' | 'summary'

export type DracoItem = {
  id: string
  name: string
  cost: number
  itemEmoji: string
  wasteEmoji: string
  wasteName: string
  correctBin: BinType | 'none'
  healthDelta: number
  buyLine: string
  wasteLine: string
  rightSortLine: string
  wrongSortLine: string
  shortHint: string
}

export type EarthEnding = {
  tier: HealthTier
  title: string
  earthEmoji: string
  earthImagePath?: string
  dracoLine: string
  lessonLine: string
}
