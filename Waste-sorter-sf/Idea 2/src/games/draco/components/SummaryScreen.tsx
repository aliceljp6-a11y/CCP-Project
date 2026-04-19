import { PROMISE_OPTIONS } from '../data/copy'
import type { EarthEnding } from '../types'

type SummaryScreenProps = {
  ending: EarthEnding
  selectedPromise: string | null
  onPickPromise: (promiseId: string) => void
  onPlayAgain: () => void
}

export function SummaryScreen({ ending, selectedPromise, onPickPromise, onPlayAgain }: SummaryScreenProps) {
  return (
    <section className="draco-summary-card">
      <h3>Your Earth Reflection</h3>
      {ending.earthImagePath ? (
        <img className="draco-earth-img" src={ending.earthImagePath} alt="" aria-hidden />
      ) : (
        <p className="draco-earth-emoji" aria-hidden>
          {ending.earthEmoji}
        </p>
      )}
      <p className="draco-lesson">{ending.lessonLine}</p>
      <p>You do not need magic to help me. You just need your choices.</p>

      <div className="draco-action-grid">
        <article>
          <h4>Sort your waste correctly</h4>
          <p>Putting things in the right bin helps materials recover.</p>
        </article>
        <article>
          <h4>Use things again</h4>
          <p>Reusable items protect nature magic and reduce waste.</p>
        </article>
        <article>
          <h4>Waste less food</h4>
          <p>Plan snacks and compost scraps when possible.</p>
        </article>
      </div>

      <div className="draco-promise-wrap">
        <p>Choose one promise:</p>
        <div className="draco-promise-grid">
          {PROMISE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`draco-promise-btn ${selectedPromise === opt.id ? 'is-active' : ''}`}
              onClick={() => onPickPromise(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {selectedPromise && <p className="draco-success-line">Promise saved. Draco says thank you.</p>}
      </div>

      <button type="button" className="draco-secondary-btn" onClick={onPlayAgain}>
        Play this game again
      </button>
    </section>
  )
}
