type CoinCounterProps = {
  coins: number
}

export function CoinCounter({ coins }: CoinCounterProps) {
  return (
    <div className="draco-pill">
      <span aria-hidden>🪙</span>
      <span className="draco-pill-label">Coins</span>
      <strong>{coins}</strong>
    </div>
  )
}
