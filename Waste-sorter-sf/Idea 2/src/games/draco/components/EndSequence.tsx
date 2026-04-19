import { END_SEQUENCE_MAIN_HEADING } from '../data/endings'
import type { EarthEnding } from '../types'

type EndSequenceProps = {
  ending: EarthEnding
  /** Tier-matched Draco portrait (same “health” as the bar). */
  dracoImagePath?: string
  onContinue: () => void
}

export function EndSequence({ ending, dracoImagePath, onContinue }: EndSequenceProps) {
  const heading = ending.mainHeading ?? END_SEQUENCE_MAIN_HEADING
  const quote = ending.dracoQuote ?? 'I was Earth all along.'
  const earthSrc = ending.earthImagePath
  const dracoSrc = dracoImagePath ?? '/draco/draco-health-50.jpg'

  return (
    <section className="draco-end-card" aria-live="polite">
      <p className="draco-kicker">All coins used!</p>
      <h2 className="draco-end-main-heading">{heading}</h2>
      <p className="draco-end-subtitle">{ending.title}</p>

      <div
        className="draco-end-reveal"
        aria-label="Draco and Earth as one: Draco fades into the planet"
      >
        <div className="draco-end-reveal__glow" aria-hidden />
        {earthSrc ? (
          <img src={earthSrc} alt="" className="draco-end-reveal__earth" />
        ) : (
          <p className="draco-end-reveal__emoji" aria-hidden>
            {ending.earthEmoji}
          </p>
        )}
        <img src={dracoSrc} alt="" className="draco-end-reveal__draco" />
      </div>

      <blockquote className="draco-end-quote">&ldquo;{quote}&rdquo;</blockquote>

      <p className="draco-end-draco-line">{ending.dracoLine}</p>
      <p className="draco-lesson draco-end-lesson">{ending.lessonLine}</p>

      <button type="button" className="draco-primary-btn" onClick={onContinue}>
        See my action plan
      </button>
    </section>
  )
}
