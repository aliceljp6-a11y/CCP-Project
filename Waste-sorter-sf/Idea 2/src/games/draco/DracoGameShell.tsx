import { useEffect, useMemo, useState } from 'react'
import './draco-game.css'
import { CoinCounter } from './components/CoinCounter'
import { DracoPanel } from './components/DracoPanel'
import { EndSequence } from './components/EndSequence'
import { HealthBar } from './components/HealthBar'
import { IntroScreen } from './components/IntroScreen'
import { ShopScreen } from './components/ShopScreen'
import { SummaryScreen } from './components/SummaryScreen'
import { WasteSortingPanel } from './components/WasteSortingPanel'
import { ENDINGS } from './data/endings'
import { DRACO_ITEMS } from './data/items'
import { getHealthTier, HEALTH_TIERS, MAX_HEALTH, START_HEALTH } from './data/healthStates'
import type { DracoItem, DracoPhase } from './types'

const PROMISE_STORAGE_KEY = 'draco-promise-choice'

function clampHealth(value: number) {
  return Math.max(0, Math.min(MAX_HEALTH, value))
}

type DracoGameShellProps = {
  onBackToSimulation?: () => void
}

export default function DracoGameShell({ onBackToSimulation }: DracoGameShellProps) {
  const [phase, setPhase] = useState<DracoPhase>('intro')
  const [coins, setCoins] = useState(10)
  const [health, setHealth] = useState(START_HEALTH)
  const [availableItems, setAvailableItems] = useState<DracoItem[]>(DRACO_ITEMS)
  const [currentItem, setCurrentItem] = useState<DracoItem | null>(null)
  const [bubbleText, setBubbleText] = useState("I'm ready when you are!")
  const [consequenceStep, setConsequenceStep] = useState(0)
  const [effectApplied, setEffectApplied] = useState(false)
  const [selectedPromise, setSelectedPromise] = useState<string | null>(null)

  const tier = getHealthTier(health)
  const tierLabel = HEALTH_TIERS.find((entry) => entry.tier === tier)?.label ?? 'Critical'
  const tierDracoImage = HEALTH_TIERS.find((entry) => entry.tier === tier)?.dracoImagePath
  const ending = ENDINGS[tier]
  const noAffordableItems = availableItems.every((item) => item.cost > coins)

  useEffect(() => {
    const remembered = window.localStorage.getItem(PROMISE_STORAGE_KEY)
    if (remembered) setSelectedPromise(remembered)
  }, [])

  useEffect(() => {
    if (phase !== 'shop') return
    if (coins <= 0 || noAffordableItems) {
      setBubbleText('Our shopping trip is complete!')
      setPhase('endSequence')
    }
  }, [coins, noAffordableItems, phase])

  const header = useMemo(
    () => (
      <header className="draco-topbar">
        <CoinCounter coins={coins} />
        <HealthBar health={health} label={tierLabel} />
        {onBackToSimulation && (
          <button type="button" className="draco-back-btn" onClick={onBackToSimulation}>
            ← Back to simulation
          </button>
        )}
      </header>
    ),
    [coins, health, onBackToSimulation, tierLabel],
  )

  function resetGame() {
    setCoins(10)
    setHealth(START_HEALTH)
    setAvailableItems(DRACO_ITEMS)
    setCurrentItem(null)
    setBubbleText("I'm ready when you are!")
    setConsequenceStep(0)
    setEffectApplied(false)
    setPhase('intro')
  }

  function startShopping() {
    setBubbleText('Let us choose with care and joy!')
    setPhase('shop')
  }

  function buyItem(item: DracoItem) {
    if (item.cost > coins) return
    setCoins((prev) => prev - item.cost)
    setAvailableItems((prev) => prev.filter((entry) => entry.id !== item.id))
    setCurrentItem(item)
    setBubbleText(item.purchaseReaction)
    setConsequenceStep(0)
    setEffectApplied(false)
    setPhase('consequence')
  }

  useEffect(() => {
    if (phase !== 'consequence') return
    if (!currentItem) return

    const timeouts: number[] = []
    timeouts.push(window.setTimeout(() => setConsequenceStep(1), 650))
    timeouts.push(window.setTimeout(() => setConsequenceStep(2), 1350))
    timeouts.push(window.setTimeout(() => setConsequenceStep(3), 2050))
    timeouts.push(
      window.setTimeout(() => {
        if (effectApplied) return
        setHealth((prev) => clampHealth(prev + currentItem.dracoEffect))
        setBubbleText(currentItem.healthReaction)
        setEffectApplied(true)
      }, 2300),
    )

    return () => {
      timeouts.forEach((id) => window.clearTimeout(id))
    }
  }, [currentItem, effectApplied, phase])

  function continueAfterConsequence() {
    setCurrentItem(null)
    setConsequenceStep(0)
    setEffectApplied(false)
    setPhase('shop')
  }

  function handlePromise(promiseId: string) {
    setSelectedPromise(promiseId)
    window.localStorage.setItem(PROMISE_STORAGE_KEY, promiseId)
  }

  return (
    <div className="draco-shell">
      <div className="draco-bg-layer" aria-hidden />
      {header}

      <main className="draco-main">
        <DracoPanel tier={tier} bubbleText={bubbleText} />

        <section className="draco-content">
          {phase === 'intro' && <IntroScreen onStart={startShopping} />}

          {phase === 'shop' && <ShopScreen coins={coins} items={availableItems} onBuy={buyItem} />}

          {phase === 'consequence' && currentItem && (
            <WasteSortingPanel
              item={currentItem}
              step={consequenceStep}
              effectApplied={effectApplied}
              onContinue={continueAfterConsequence}
            />
          )}

          {phase === 'endSequence' && (
            <EndSequence
              ending={ending}
              dracoImagePath={tierDracoImage}
              onContinue={() => setPhase('summary')}
            />
          )}

          {phase === 'summary' && (
            <SummaryScreen
              ending={ending}
              selectedPromise={selectedPromise}
              onPickPromise={handlePromise}
              onPlayAgain={resetGame}
            />
          )}
        </section>
      </main>
    </div>
  )
}
