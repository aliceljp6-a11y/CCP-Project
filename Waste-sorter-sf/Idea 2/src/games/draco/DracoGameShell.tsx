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
import { POST_SORT_LINES } from './data/dracoDialogue'
import { ENDINGS } from './data/endings'
import { DRACO_ITEMS } from './data/items'
import { getHealthTier, HEALTH_TIERS, MAX_HEALTH, START_HEALTH } from './data/healthStates'
import type { BinType, DracoItem, DracoPhase } from './types'

const PROMISE_STORAGE_KEY = 'draco-promise-choice'

function clampHealth(value: number) {
  return Math.max(0, Math.min(MAX_HEALTH, value))
}

export default function DracoGameShell() {
  const [phase, setPhase] = useState<DracoPhase>('intro')
  const [coins, setCoins] = useState(10)
  const [health, setHealth] = useState(START_HEALTH)
  const [availableItems, setAvailableItems] = useState<DracoItem[]>(DRACO_ITEMS)
  const [currentItem, setCurrentItem] = useState<DracoItem | null>(null)
  const [bubbleText, setBubbleText] = useState("I'm ready when you are!")
  const [sortResolved, setSortResolved] = useState(false)
  const [sortFeedback, setSortFeedback] = useState('')
  const [selectedPromise, setSelectedPromise] = useState<string | null>(null)

  const tier = getHealthTier(health)
  const tierLabel = HEALTH_TIERS.find((entry) => entry.tier === tier)?.label ?? 'Critical'
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
      </header>
    ),
    [coins, health, tierLabel],
  )

  function resetGame() {
    setCoins(10)
    setHealth(START_HEALTH)
    setAvailableItems(DRACO_ITEMS)
    setCurrentItem(null)
    setBubbleText("I'm ready when you are!")
    setSortResolved(false)
    setSortFeedback('')
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
    setBubbleText(item.buyLine)
    if (item.correctBin === 'none') {
      setSortFeedback(`${item.wasteLine} ${item.rightSortLine}`)
      setSortResolved(true)
      setHealth((prev) => clampHealth(prev + item.healthDelta))
    } else {
      setSortFeedback(item.wasteLine)
      setSortResolved(false)
    }
    setPhase('sorting')
  }

  function applySort(bin: BinType) {
    if (!currentItem || sortResolved) return
    const isCorrect = bin === currentItem.correctBin
    const rightBinName = currentItem.correctBin === 'none' ? 'No bin needed' : currentItem.correctBin
    const delta = isCorrect ? currentItem.healthDelta : Math.round(currentItem.healthDelta / 2) - 2
    const nextHealth = clampHealth(health + delta)
    setHealth(nextHealth)
    setBubbleText(isCorrect ? currentItem.rightSortLine : currentItem.wrongSortLine)
    setSortFeedback(
      `${isCorrect ? POST_SORT_LINES.correct[0] : POST_SORT_LINES.incorrect[0]} ${
        isCorrect ? '' : `Best answer: ${rightBinName}.`
      }`,
    )
    setSortResolved(true)
  }

  function continueAfterSort() {
    setCurrentItem(null)
    setSortFeedback('')
    setSortResolved(false)
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

          {phase === 'sorting' && currentItem && (
            <WasteSortingPanel
              item={currentItem}
              health={health}
              feedback={sortFeedback}
              isResolved={sortResolved}
              onSelectBin={applySort}
              onContinue={continueAfterSort}
            />
          )}

          {phase === 'endSequence' && <EndSequence ending={ending} onContinue={() => setPhase('summary')} />}

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
