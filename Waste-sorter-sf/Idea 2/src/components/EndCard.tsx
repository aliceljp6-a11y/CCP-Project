import React from 'react'

import fartCloudUrl from '../assets/images/fart_cloud.png'

const RECOLOGY_SF_URL = 'https://www.recology.com/recology-san-francisco/'

export type EndCardUserType = 'guide' | 'student'

type EndCardProps = {
  onRunAgain: () => void
  onClose: () => void
  onStartTour?: () => void
  predictionChoice?: 'A' | 'B' | 'C' | 'D' | null
  userType: EndCardUserType
}

const PREDICTION_LABELS: Record<'A' | 'B' | 'C' | 'D', string> = {
  A: 'About 10%',
  B: 'Around 25%',
  C: 'Nearly 50%',
  D: 'More than 75%',
}

function getPredictionMessage(predictionChoice: EndCardProps['predictionChoice']) {
  if (predictionChoice === 'C') {
    return 'You were right! 🎉 Nearly 50% of what ends up in landfill could have been recycled or composted.'
  }
  if (predictionChoice === 'A' || predictionChoice === 'B' || predictionChoice === 'D') {
    return 'Surprise! 🤯 Nearly 50% of what ends up in landfill could have been recycled or composted — way more than most people think!'
  }
  return 'Did you know? Nearly 50% of landfill waste could have been recycled or composted.'
}

function getPickedSummary(predictionChoice: EndCardProps['predictionChoice']) {
  if (predictionChoice === null || predictionChoice === undefined) {
    return 'You skipped the prediction question.'
  }
  const letter = predictionChoice
  const label = PREDICTION_LABELS[letter]
  return `You picked ${letter}) ${label}.`
}

const TALK_PROMPT =
  'How do you think the amount of trash changes on different days of the week?'

const THINK_PROMPT = 'What surprised you most about how much trash piles up in one day?'

export function EndCard({
  onRunAgain,
  onClose,
  onStartTour,
  predictionChoice,
  userType,
}: EndCardProps) {
  const predictionMessage = getPredictionMessage(predictionChoice)
  const pickedSummary = getPickedSummary(predictionChoice)
  const isGuide = userType === 'guide'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 py-6"
      role="dialog"
      aria-labelledby="end-card-title"
      aria-modal="true"
    >
      <div className="my-auto flex max-h-[90vh] w-full max-w-4xl min-h-0 flex-col overflow-hidden rounded-2xl border-2 border-amber-200 bg-stone-50 shadow-2xl">
        <div className="flex-shrink-0 border-b border-amber-100 bg-white px-5 py-4 sm:px-6">
          <h2 id="end-card-title" className="font-display text-2xl font-bold text-stone-800 sm:text-3xl">
            That’s a lot of trash!
          </h2>
          <p className="mt-2 text-sm text-stone-600 sm:text-base">
            Every day, San Francisco&apos;s transfer station receives around 1,100 tons of waste. The
            materials come from the grey bins. At Recology, these materials are not sorted, they go
            straight to the landfill. Materials in the blue and green bin are sorted, so make sure to
            put the right items in the correct bins.
          </p>
          <p className="mt-2 text-sm font-semibold text-amber-800 sm:text-base">
            Want to learn what goes in each bin and how to reduce waste?
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            <div className="flex flex-col gap-4">
              {isGuide ? (
                <>
                  <section
                    className="rounded-2xl border-2 border-amber-200/90 bg-white p-4 shadow-sm sm:p-5"
                    aria-labelledby="end-card-talk-heading"
                  >
                    <h3
                      id="end-card-talk-heading"
                      className="font-display text-lg font-bold text-amber-900 sm:text-xl"
                    >
                      💬 Talk About It
                    </h3>
                    <p className="mt-2 text-sm font-medium text-stone-700 sm:text-base">{TALK_PROMPT}</p>
                  </section>
                  <section
                    className="rounded-2xl border-2 border-stone-300 bg-white p-4 shadow-sm sm:p-5"
                    aria-labelledby="end-card-think-heading"
                  >
                    <h3
                      id="end-card-think-heading"
                      className="font-display text-lg font-bold text-stone-800 sm:text-xl"
                    >
                      🤔 Think About It
                    </h3>
                    <p className="mt-2 text-sm font-medium text-stone-700 sm:text-base">{THINK_PROMPT}</p>
                  </section>
                </>
              ) : (
                <>
                  <section
                    className="rounded-2xl border-2 border-emerald-200/80 bg-white p-4 shadow-sm sm:p-5"
                    aria-labelledby="end-card-prediction-heading"
                  >
                    <h3
                      id="end-card-prediction-heading"
                      className="font-display text-lg font-bold text-emerald-900 sm:text-xl"
                    >
                      🔮 Your Prediction
                    </h3>
                    <p className="mt-2 text-sm font-semibold text-stone-800 sm:text-base">{pickedSummary}</p>
                    <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold leading-snug text-emerald-900">
                      {predictionMessage}
                    </p>
                  </section>
                  <section
                    className="rounded-2xl border-2 border-amber-200/90 bg-white p-4 shadow-sm sm:p-5"
                    aria-labelledby="end-card-student-talk-heading"
                  >
                    <h3
                      id="end-card-student-talk-heading"
                      className="font-display text-lg font-bold text-amber-900 sm:text-xl"
                    >
                      💬 Talk About It
                    </h3>
                    <p className="mt-2 text-sm font-medium text-stone-700 sm:text-base">{TALK_PROMPT}</p>
                  </section>
                </>
              )}
            </div>

            <section
              className="flex h-full min-h-0 flex-col rounded-2xl border-2 border-stone-300 bg-gradient-to-br from-amber-50 to-white p-5 shadow-md sm:p-6"
              aria-labelledby="end-card-funfact-heading"
            >
              <h3 id="end-card-funfact-heading" className="sr-only">
                Fun fact
              </h3>
              <p className="font-display text-lg font-extrabold leading-snug text-stone-900 sm:text-xl">
                <span className="font-display font-extrabold">Fun fact</span>
                <span className="font-display mt-2 block font-normal">
                  Each day, the smell from a transfer station is like 1,500 rotten tomatoes.
                  <img
                    src={fartCloudUrl}
                    alt=""
                    aria-hidden="true"
                    className="inline-block"
                    style={{ height: '1em', width: 'auto', verticalAlign: '-0.15em' }}
                  />
                </span>
              </p>
              {!isGuide && onStartTour && (
                <button
                  type="button"
                  onClick={onStartTour}
                  className="animate-tour-cta mt-auto w-full rounded-xl bg-emerald-600 px-4 py-3 text-center font-display text-lg font-bold text-white shadow-md transition hover:bg-emerald-700 sm:mt-6"
                >
                  Go behind the scenes →
                </button>
              )}
            </section>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-stone-200 bg-amber-50/50 p-4 sm:flex-row sm:flex-wrap sm:justify-end">
          <a
            href={RECOLOGY_SF_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-emerald-600 px-4 py-3 text-center font-display font-semibold text-white shadow-md transition hover:bg-emerald-700 sm:min-w-[10rem]"
          >
            Learn more at Recology
          </a>
          <button
            type="button"
            onClick={onRunAgain}
            className="rounded-xl border-2 border-stone-300 bg-white px-4 py-3 font-display font-semibold text-stone-700 transition hover:bg-stone-50 sm:min-w-[10rem]"
          >
            Run simulation again
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-3 py-2 text-sm text-stone-500 underline underline-offset-2 hover:text-stone-700 sm:border-0 sm:py-3"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
