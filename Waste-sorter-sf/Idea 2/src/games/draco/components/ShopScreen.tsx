import { SHOP_COPY } from '../data/copy'
import type { DracoItem } from '../types'

type ShopScreenProps = {
  coins: number
  items: DracoItem[]
  onBuy: (item: DracoItem) => void
}

export function ShopScreen({ coins, items, onBuy }: ShopScreenProps) {
  return (
    <section className="draco-shop" aria-labelledby="shopTitle">
      <h3 id="shopTitle">Shop Time</h3>
      <p>{SHOP_COPY.choosePrompt}</p>
      <div className="draco-grid">
        {items.map((item) => {
          const cannotAfford = item.cost > coins
          return (
            <article className="draco-item-card" key={item.id}>
              <p className="draco-item-emoji" aria-hidden>
                {item.itemEmoji}
              </p>
              <h4>{item.name}</h4>
              <p className="draco-item-cost">{item.cost} coin{item.cost > 1 ? 's' : ''}</p>
              <p className="draco-item-hint">{item.shortHint}</p>
              <button type="button" className="draco-secondary-btn" onClick={() => onBuy(item)} disabled={cannotAfford}>
                {cannotAfford ? 'Need more coins' : 'Buy item'}
              </button>
            </article>
          )
        })}
      </div>
    </section>
  )
}
