import type { EarthEnding } from '../types'

type EndSequenceProps = {
  ending: EarthEnding
  onContinue: () => void
}

export function EndSequence({ ending, onContinue }: EndSequenceProps) {
  return (
    <section className="draco-end-card" aria-live="polite">
      <p className="draco-kicker">All coins used!</p>
      <h3>{ending.title}</h3>
      <div className="draco-end-images" aria-hidden>
        <img src="/draco/draco-transforming.jpg" alt="" className="draco-transform-img" />
        {ending.earthImagePath ? (
          <img src={ending.earthImagePath} alt="" className="draco-earth-img" />
        ) : (
          <p className="draco-earth-emoji">{ending.earthEmoji}</p>
        )}
      </div>
      <p>{ending.dracoLine}</p>
      <p className="draco-lesson">{ending.lessonLine}</p>
      <button type="button" className="draco-primary-btn" onClick={onContinue}>
        See my action plan
      </button>
    </section>
  )
}
