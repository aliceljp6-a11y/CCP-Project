import { BIN_LABELS, SHOP_COPY } from '../data/copy'
import type { DracoItem, OutcomeType } from '../types'
import { ItemImage } from './ItemImage'

type WasteSortingPanelProps = {
  item: DracoItem
  /** Current step of the automatic consequence sequence (0..3). */
  step: number
  /** Whether Draco's health effect has been applied. */
  effectApplied: boolean
  onContinue: () => void
}

export function WasteSortingPanel({
  item,
  onContinue,
  step,
  effectApplied,
}: WasteSortingPanelProps) {
  const highlighted: OutcomeType | null =
    item.binCategory === 'recycle' ||
    item.binCategory === 'compost' ||
    item.binCategory === 'landfill' ||
    item.binCategory === 'donate'
      ? item.binCategory
      : null

  return (
    <section className="draco-sort-card" aria-live="polite">
      <h3 className="draco-consequence-title">{item.name}</h3>
      <p className="draco-consequence-kicker">{SHOP_COPY.consequencePrompt}</p>

      <div className="draco-consequence-flow" aria-label="What happens after you buy this item">
        <div className={step >= 0 ? 'draco-step draco-step-on' : 'draco-step'}>
          <div className="draco-step-label">Item</div>
          <div className="draco-step-visual">
            <ItemImage src={item.itemImage} alt={item.name} className="draco-step-img" placeholderLabel={item.name} />
          </div>
          <div className="draco-step-text">You chose: {item.name}</div>
        </div>

        <div className="draco-step-arrow" aria-hidden>
          →
        </div>

        <div className={step >= 1 ? 'draco-step draco-step-on' : 'draco-step'} aria-live="polite">
          <div className="draco-step-label">Used</div>
          <div className="draco-step-visual">
            <ItemImage
              src={item.usedImage}
              alt="Used"
              className="draco-step-img"
              placeholderLabel="Used"
            />
          </div>
          <div className="draco-step-text">{item.consequenceText.usedLine}</div>
        </div>

        <div className="draco-step-arrow" aria-hidden>
          →
        </div>

        <div className={step >= 2 ? 'draco-step draco-step-on' : 'draco-step'} aria-live="polite">
          <div className="draco-step-label">{item.binCategory === 'donate' ? 'No waste' : 'Waste'}</div>
          <div className="draco-step-visual">
            <ItemImage
              src={item.wasteImage}
              alt={item.binCategory === 'donate' ? 'No disposable waste created' : 'Waste created'}
              className="draco-step-img"
              placeholderLabel={item.binCategory === 'donate' ? 'No disposable waste' : 'Waste created'}
            />
          </div>
          <div className="draco-step-text">{item.consequenceText.wasteLine}</div>
        </div>

        <div className="draco-step-arrow" aria-hidden>
          →
        </div>

        <div className={step >= 3 ? 'draco-step draco-step-on' : 'draco-step'} aria-live="polite">
          <div className="draco-step-label">{item.binCategory === 'donate' ? 'Outcome' : 'Bin'}</div>
          <div className="draco-step-visual">
            <div
              className={
                item.binCategory === 'donate'
                  ? 'draco-result-pill draco-result-donate'
                  : 'draco-result-pill'
              }
            >
              {item.binCategory === 'none' ? 'No bin' : BIN_LABELS[item.binCategory].label}
            </div>
          </div>
          <div className="draco-step-text">{item.consequenceText.binLine}</div>
        </div>
      </div>

      {step >= 2 && item.binCategory !== 'donate' && item.binCategory !== 'none' && (
        <p className="draco-waste-secondary">Waste created: {item.consequenceText.wasteLine.replace(/^…/, '').replace(/\.$/, '')}</p>
      )}

      <div className="draco-bin-strip" aria-label="Bin reference">
        {(Object.keys(BIN_LABELS) as OutcomeType[]).map((bin) => (
          <div
            key={bin}
            className={
              highlighted === bin && step >= 3
                ? `draco-bin-chip draco-bin-chip-${bin} draco-bin-chip-active`
                : `draco-bin-chip draco-bin-chip-${bin}`
            }
          >
            <span className="draco-bin-dot" aria-hidden />
            <span>{BIN_LABELS[bin].label}</span>
          </div>
        ))}
      </div>

      <p className="draco-feedback">{effectApplied ? item.healthReaction : ''}</p>

      {effectApplied && (
        <button type="button" className="draco-primary-btn" onClick={onContinue}>
          Continue shopping
        </button>
      )}
    </section>
  )
}
