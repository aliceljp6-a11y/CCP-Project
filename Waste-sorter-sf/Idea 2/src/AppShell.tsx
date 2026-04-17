import { useCallback, useRef, useState } from 'react'
import SimulationApp from './App'
import DracoGameShell from './games/draco/DracoGameShell'

type CurtainPhase = 'idle' | 'closing' | 'opening'

export default function AppShell() {
  const [activeApp, setActiveApp] = useState<'simulation' | 'game'>('simulation')
  const [curtainPhase, setCurtainPhase] = useState<CurtainPhase>('idle')
  const transitionLockRef = useRef(false)

  const handleLeftCurtainAnimationEnd = useCallback((e: React.AnimationEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return
    const { animationName } = e
    if (animationName !== 'theaterCurtainLeftClose' && animationName !== 'theaterCurtainLeftOpen') {
      return
    }
    if (animationName === 'theaterCurtainLeftClose') {
      setActiveApp('game')
      setCurtainPhase('opening')
      return
    }
    if (animationName === 'theaterCurtainLeftOpen') {
      setCurtainPhase('idle')
      transitionLockRef.current = false
    }
  }, [])

  const handleStartTour = useCallback(() => {
    if (transitionLockRef.current) return
    transitionLockRef.current = true
    setCurtainPhase('closing')
  }, [])

  const handleBackToSimulation = useCallback(() => {
    transitionLockRef.current = false
    setCurtainPhase('idle')
    setActiveApp('simulation')
  }, [])

  const showCurtains = curtainPhase === 'closing' || curtainPhase === 'opening'

  return (
    <div className="relative h-full min-h-0 w-full">
      {activeApp === 'simulation' ? (
        <SimulationApp onStartTour={handleStartTour} />
      ) : (
        <DracoGameShell onBackToSimulation={handleBackToSimulation} />
      )}

      {showCurtains && (
        <div className="theater-curtain-overlay" aria-hidden="true">
          <div
            className={`theater-curtain-panel theater-curtain-panel--left ${
              curtainPhase === 'closing' ? 'theater-curtain--closing' : 'theater-curtain--opening'
            }`}
            onAnimationEnd={handleLeftCurtainAnimationEnd}
          />
          <div
            className={`theater-curtain-panel theater-curtain-panel--right ${
              curtainPhase === 'closing' ? 'theater-curtain--closing' : 'theater-curtain--opening'
            }`}
          />
        </div>
      )}
    </div>
  )
}
