import { INTRO_COPY } from '../data/copy'

type IntroScreenProps = {
  onStart: () => void
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <section className="draco-intro" aria-labelledby="dracoIntroTitle">
      <div className="draco-intro-particles" aria-hidden />
      <div className="draco-card">
        <p className="draco-kicker">Magical Choices Adventure</p>
        <h2 id="dracoIntroTitle">{INTRO_COPY.title}</h2>
        <p className="draco-subtitle">{INTRO_COPY.subtitle}</p>
        <div className="draco-intro-layout">
          <div className="draco-intro-avatar" aria-hidden>
            <img src="/draco/draco-original.jpg" alt="" />
          </div>
          <div className="draco-script">
            {INTRO_COPY.scriptLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
        <button type="button" className="draco-primary-btn" onClick={onStart}>
          {INTRO_COPY.cta}
        </button>
      </div>
    </section>
  )
}
