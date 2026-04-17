import { BIN_LABELS, SHOP_COPY } from '../data/copy'
import type { BinType, DracoItem } from '../types'

/** Tips (short hints) only show when Draco needs extra help — health below this percent. */
const TIP_HEALTH_THRESHOLD = 25

type WasteSortingPanelProps = {
  item: DracoItem
  health: number
  feedback: string
  onSelectBin: (bin: BinType) => void
  onContinue: () => void
  isResolved: boolean
}

export function WasteSortingPanel({
  item,
  health,
  feedback,
  onSelectBin,
  onContinue,
  isResolved,
}: WasteSortingPanelProps) {
  const showTip = health < TIP_HEALTH_THRESHOLD

  return (
    <section className="draco-sort-card" aria-live="polite">
      <h3>{SHOP_COPY.sortPrompt}</h3>
      <div className="draco-waste-preview">
        <span className="draco-item-emoji" aria-hidden>
          {item.wasteEmoji}
        </span>
        <div>
          <p className="draco-waste-name">{item.wasteName}</p>
          {showTip && <p className="draco-sort-tip">{item.shortHint}</p>}
        </div>
      </div>
      <div className="draco-bin-row">
        {(Object.keys(BIN_LABELS) as BinType[]).map((bin) => (
          <button key={bin} type="button" className="draco-bin-btn" onClick={() => onSelectBin(bin)} disabled={isResolved}>
            <span aria-hidden>{BIN_LABELS[bin].icon}</span>
            <span>{BIN_LABELS[bin].label}</span>
          </button>
        ))}
      </div>
      <p className="draco-feedback">{feedback}</p>
      {isResolved && (
        <button type="button" className="draco-primary-btn" onClick={onContinue}>
          Continue shopping
        </button>
      )}
    </section>
  )
}
