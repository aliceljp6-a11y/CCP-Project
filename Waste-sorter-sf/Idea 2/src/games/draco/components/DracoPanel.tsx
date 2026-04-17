import { HEALTH_TIER_LINES } from '../data/dracoDialogue'
import { HEALTH_TIERS } from '../data/healthStates'
import type { HealthTier } from '../types'

type DracoPanelProps = {
  tier: HealthTier
  bubbleText: string
}

export function DracoPanel({ tier, bubbleText }: DracoPanelProps) {
  const tierMeta = HEALTH_TIERS.find((state) => state.tier === tier) ?? HEALTH_TIERS[HEALTH_TIERS.length - 1]
  return (
    <aside className={`draco-panel draco-tier-${tier}`}>
      <div className="draco-avatar-wrap" aria-hidden>
        <div className="draco-aura" />
        {tierMeta.dracoImagePath ? (
          <img className="draco-avatar-image" src={tierMeta.dracoImagePath} alt="" />
        ) : (
          <div className="draco-avatar">{tierMeta.dracoEmoji}</div>
        )}
      </div>
      <div className="draco-bubble">
        <p className="draco-tier-label">{tierMeta.label}</p>
        <p>{bubbleText || HEALTH_TIER_LINES[tier]}</p>
      </div>
    </aside>
  )
}
