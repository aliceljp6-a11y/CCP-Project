import { BIN_LABELS, SHOP_COPY } from '../data/copy'
import type { BinType, DracoItem } from '../types'

type WasteSortingPanelProps = {
  item: DracoItem
  feedback: string
  onSelectBin: (bin: BinType) => void
  onContinue: () => void
  isResolved: boolean
}

export function WasteSortingPanel({ item, feedback, onSelectBin, onContinue, isResolved }: WasteSortingPanelProps) {
  return (
    <section className="draco-sort-card" aria-live="polite">
      <h3>{SHOP_COPY.sortPrompt}</h3>
      <div className="draco-waste-preview">
        <span className="draco-item-emoji" aria-hidden>
          {item.wasteEmoji}
        </span>
        <div>
          <p className="draco-waste-name">{item.wasteName}</p>
          <p>{item.shortHint}</p>
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
