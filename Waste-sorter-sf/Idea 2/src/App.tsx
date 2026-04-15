import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Clock, START_MINUTES, END_MINUTES, REAL_SECONDS_PER_HOUR } from './components/Clock'
import { TransferStation } from './components/TransferStation'
import { EndCard } from './components/EndCard'
import { STUDENT_HEIGHT_PX } from './components/StudentSilhouette'

const KNEE_HEIGHT = Math.round(STUDENT_HEIGHT_PX * 0.45)
const WAIST_HEIGHT = Math.round(STUDENT_HEIGHT_PX * 0.55)
const HEAD_HEIGHT = Math.round(STUDENT_HEIGHT_PX * 0.95)
const MINUTES_PER_TICK = 60

type SimulationAppProps = {
  onStartTour?: () => void
}

type PredictionChoice = 'A' | 'B' | 'C' | 'D' | null

type IntroUserType = 'guide' | 'student' | null

export default function SimulationApp({ onStartTour }: SimulationAppProps) {
  const [running, setRunning] = useState(false)
  const [currentMinutes, setCurrentMinutes] = useState(START_MINUTES)
  const [shake, setShake] = useState(false)
  const [showEndCard, setShowEndCard] = useState(false)
  const [showEndPause, setShowEndPause] = useState(false)
  const [showIntroModal, setShowIntroModal] = useState(true)
  const [userType, setUserType] = useState<IntroUserType>(null)
  const [predictionChoice, setPredictionChoice] = useState<PredictionChoice>(null)
  const shakeTriggeredRef = useRef({ knees: false, waist: false, head: false })
  const prevRunningRef = useRef(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const onPileHeightChange = useCallback((heightPx: number) => {
    if (heightPx >= HEAD_HEIGHT && !shakeTriggeredRef.current.head) {
      shakeTriggeredRef.current.head = true
      setShake(true)
      setTimeout(() => setShake(false), 400)
    } else if (heightPx >= WAIST_HEIGHT && !shakeTriggeredRef.current.waist) {
      shakeTriggeredRef.current.waist = true
      setShake(true)
      setTimeout(() => setShake(false), 400)
    } else if (heightPx >= KNEE_HEIGHT && !shakeTriggeredRef.current.knees) {
      shakeTriggeredRef.current.knees = true
      setShake(true)
      setTimeout(() => setShake(false), 400)
    }
  }, [])

  const startSimulation = useCallback(() => {
    shakeTriggeredRef.current = { knees: false, waist: false, head: false }
    setShake(false)
    setCurrentMinutes(START_MINUTES)
    setRunning(true)
  }, [])

  const resetSimulation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setRunning(false)
    setCurrentMinutes(START_MINUTES)
    setShake(false)
    setShowEndCard(false)
    setShowEndPause(false)
    shakeTriggeredRef.current = { knees: false, waist: false, head: false }
  }, [])

  useEffect(() => {
    if (prevRunningRef.current && !running && currentMinutes === END_MINUTES) {
      // Enter the end-of-day highlight phase. Do not auto-advance.
      setShowEndPause(true)
    }
    prevRunningRef.current = running
  }, [running, currentMinutes])

  React.useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setCurrentMinutes((m) => {
        const next = m + MINUTES_PER_TICK
        if (next >= END_MINUTES) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
          setRunning(false)
          return END_MINUTES
        }
        return next
      })
    }, REAL_SECONDS_PER_HOUR * 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running])

  return (
    <div
      className={`flex h-screen min-h-0 flex-col overflow-hidden bg-gradient-to-br from-amber-50 via-stone-100 to-amber-100 font-sans ${shake ? 'animate-shake' : ''}`}
    >
      <header className="flex-shrink-0 border-b border-stone-200 bg-white/80 shadow-sm backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:py-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-stone-800 sm:text-3xl">
              Trash Simulation!
            </h1>
            <p className="mt-0.5 text-sm text-stone-600">
              How much waste does San Francisco create in 24 hours?
            </p>
            <p className="mt-0.5 text-xs font-semibold text-stone-500">
              SF transfer station: ~1,500 tons per day
            </p>
          </div>
          <Clock minutesFromMidnight={currentMinutes} running={running} />
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col overflow-hidden px-2 py-2 sm:px-4 sm:py-3">
        <div className="mb-2 flex-shrink-0 rounded-xl border-2 border-amber-200 bg-amber-50/80 p-2 shadow-sm sm:rounded-2xl sm:p-3">
          <div className="mb-3 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={startSimulation}
              disabled={running}
              className="rounded-xl bg-emerald-600 px-5 py-2.5 font-display font-semibold text-white shadow-md transition hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600"
            >
              Start Simulation
            </button>
            <button
              type="button"
              onClick={resetSimulation}
              className="rounded-xl border-2 border-stone-300 bg-white px-5 py-2.5 font-display font-semibold text-stone-700 shadow transition hover:bg-stone-50"
            >
              Reset
            </button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-stone-600">
            <span className="flex items-center gap-1.5">
              <span className="h-4 w-4 rounded-full bg-blue-500" aria-hidden /> Recycling
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-4 w-4 rounded-full bg-green-600" aria-hidden /> Compost
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-4 w-4 rounded-full bg-stone-800" aria-hidden /> Landfill
            </span>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden">
          <TransferStation
            running={running}
            currentMinutes={currentMinutes}
            onPileHeightChange={onPileHeightChange}
            showMisplacedHighlight={showEndPause}
            showPauseBanner={showEndPause}
            onHighlightNext={() => {
              setShowEndPause(false)
              setShowEndCard(true)
            }}
          />
        </div>
      </main>

      {showIntroModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-black/55 p-4 py-6">
          <div className="box-border my-auto w-full max-w-2xl min-h-0 max-h-[90vh] overflow-y-auto overscroll-contain animate-intro-card rounded-3xl border-4 border-amber-300 bg-gradient-to-br from-amber-50 to-emerald-50 p-4 shadow-2xl sm:p-6">
            {userType === null ? (
              <>
                <h2 className="font-display text-2xl font-bold text-stone-800 sm:text-3xl">
                  Before we start — who are you?
                </h2>
                <div className="mt-6 grid min-h-0 grid-cols-1 gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setUserType('guide')}
                    className="flex min-h-[8rem] flex-col items-center justify-center gap-2 rounded-2xl border-4 border-stone-700 bg-stone-800 p-6 text-center font-display text-lg font-bold text-white shadow-lg transition hover:scale-[1.02] hover:bg-stone-700 sm:min-h-[10rem] sm:text-xl"
                  >
                    <span className="text-4xl" aria-hidden>
                      🏫
                    </span>
                    <span>I&apos;m a guide at the tour</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('student')}
                    className="flex min-h-[8rem] flex-col items-center justify-center gap-2 rounded-2xl border-4 border-emerald-600 bg-emerald-600 p-6 text-center font-display text-lg font-bold text-white shadow-lg transition hover:scale-[1.02] hover:bg-emerald-700 sm:min-h-[10rem] sm:text-xl"
                  >
                    <span className="text-4xl" aria-hidden>
                      🏠
                    </span>
                    <span>I&apos;m a student at home</span>
                  </button>
                </div>
              </>
            ) : userType === 'guide' ? (
              <>
                <h2 className="font-display text-3xl font-bold text-stone-800 sm:text-4xl">
                  Welcome to the SF Waste Transfer Station!
                </h2>
                <p className="mt-3 text-base text-stone-700 sm:text-lg">
                  Watch 24 hours of San Francisco&apos;s trash fall in real time and see how quickly it
                  piles up. You&apos;ll spot recycling, compost, and landfill materials all mixed together.
                </p>
                <p className="mt-2 text-base text-stone-700 sm:text-lg">
                  When the day ends, you&apos;ll discover how much could have been recycled or composted.
                </p>
                {/* TODO: Replace this div with a <video> or <iframe> embed when the video is ready */}
                <div className="mt-5 flex min-h-[3.5rem] max-h-[min(11rem,28vh)] w-full min-w-0 shrink items-center justify-center rounded-2xl border-2 border-dashed border-stone-400 bg-stone-200/70 py-3 text-center sm:max-h-[min(11rem,32vh)]">
                  <p className="min-w-0 px-3 font-display text-xl font-bold text-stone-700">
                    🎬 Intro video coming soon
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowIntroModal(false)
                      startSimulation()
                    }}
                    className="rounded-xl bg-emerald-600 px-5 py-3 font-display font-bold text-white shadow-md transition hover:bg-emerald-700"
                  >
                    Start Simulation
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="font-display text-3xl font-bold text-stone-800 sm:text-4xl">
                  Welcome to the SF Waste Transfer Station!
                </h2>
                <p className="mt-3 text-base text-stone-700 sm:text-lg">
                  Watch 24 hours of San Francisco&apos;s trash fall in real time and see how quickly it
                  piles up. You&apos;ll spot recycling, compost, and landfill materials all mixed together.
                </p>
                <p className="mt-2 text-base text-stone-700 sm:text-lg">
                  When the day ends, you&apos;ll discover how much could have been recycled or composted.
                </p>
                {/* TODO: Replace this div with a <video> or <iframe> embed when the video is ready */}
                <div className="mt-5 flex min-h-[3.5rem] max-h-[min(11rem,28vh)] w-full min-w-0 shrink items-center justify-center rounded-2xl border-2 border-dashed border-stone-400 bg-stone-200/70 py-3 text-center sm:max-h-[min(11rem,32vh)]">
                  <p className="min-w-0 px-3 font-display text-xl font-bold text-stone-700">
                    🎬 Intro video coming soon
                  </p>
                </div>
                <div className="mt-5 min-h-0 min-w-0">
                  <p className="font-display text-lg font-bold text-stone-800">🤔 Make your prediction!</p>
                  <p className="mt-1 text-sm text-stone-700 sm:text-base">
                    Before we start — can you guess how much of SF&apos;s daily trash could have been
                    recycled or composted instead of going to landfill?
                  </p>
                  <div className="mt-3 grid min-h-0 min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
                    {[
                      { id: 'A', label: 'A) About 10%' },
                      { id: 'B', label: 'B) Around 25%' },
                      { id: 'C', label: 'C) Nearly 50%' },
                      { id: 'D', label: 'D) More than 75%' },
                    ].map((choice) => {
                      const selected = predictionChoice === choice.id
                      return (
                        <button
                          key={choice.id}
                          type="button"
                          onClick={() => setPredictionChoice(choice.id as Exclude<PredictionChoice, null>)}
                          className={`rounded-2xl border-2 px-4 py-4 text-left font-display text-base transition ${
                            selected
                              ? 'scale-[1.02] border-emerald-400 bg-emerald-500 font-bold text-white shadow-lg'
                              : 'border-stone-600/40 bg-stone-800 text-stone-100 hover:bg-stone-700'
                          }`}
                        >
                          {choice.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowIntroModal(false)
                      startSimulation()
                    }}
                    className="rounded-xl bg-emerald-600 px-5 py-3 font-display font-bold text-white shadow-md transition hover:bg-emerald-700"
                  >
                    Let&apos;s go! Start the simulation →
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowIntroModal(false)}
                    className="rounded-xl border-2 border-stone-300 bg-white px-5 py-3 font-display font-semibold text-stone-700 transition hover:bg-stone-50"
                  >
                    Skip intro
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {showEndCard && (
        <EndCard
          onRunAgain={() => {
            resetSimulation()
            startSimulation()
          }}
          onClose={() => setShowEndCard(false)}
          onStartTour={onStartTour}
          predictionChoice={predictionChoice}
          userType={userType === 'guide' ? 'guide' : 'student'}
        />
      )}
    </div>
  )
}
