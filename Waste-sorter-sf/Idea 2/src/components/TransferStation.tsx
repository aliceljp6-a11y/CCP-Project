import { useRef, useEffect, useCallback, useState } from 'react'
import Matter from 'matter-js'
import { StudentSilhouette, STUDENT_HEIGHT_PX } from './StudentSilhouette'
import { START_MINUTES } from './Clock'

import landfillTextureUrl from '../assets/images/landfill_example.png'
import compostTextureUrl from '../assets/images/compost_example.png'
import recyclableTextureUrl from '../assets/images/recyclable_example.png'
import appleNoBgUrl from '../assets/images/apple_no_bg.png'
import meatNoBgUrl from '../assets/images/meat_no_bg.png'
import trashbagNoBgUrl from '../assets/images/trashbag_no_bg.png'
import bottleNoBgUrl from '../assets/images/bottle_no_bg.png'
import flyNoBgUrl from '../assets/images/fly_no_bg.png'

const PIT_WIDTH = 720
const PIT_HEIGHT = 420
const GROUND_Y = PIT_HEIGHT - 20
/** Pit + student + gap; used to scale stage to fit viewport. */
const STAGE_WIDTH = PIT_WIDTH + 240

// Recalibrated scale reference:
// - Canvas "capacity": ~600 tons
// - Tons per hour: 62.5
// => hours to fill: 600 / 62.5 = 9.6

// Packing estimate: how tightly can similarly sized bodies fill a rectangle?
// (1.0 would be perfect tiling; realistic random pile is lower.)
const PACKING_EFFICIENCY = 0.72
// Spawn count is computed from canvas fit + fill timeline (no extra boost).

const DIRTY_OVERLAY = 'rgba(40, 30, 20, 0.35)'
const CANVAS_BG = '#1a1a1a'
const TRASH_FILTER = 'saturate(60%) brightness(75%)'
const HIGHLIGHT_FILTER_GOOD = 'brightness(130%) saturate(120%)'
const HIGHLIGHT_FILTER_BAD = 'brightness(35%) saturate(20%)'
const SIZE_SCALE_MIN = 0.6
const SIZE_SCALE_MAX = 1.3
const SQUISH_CHANCE = 0.3
const HIGHLIGHT_HOLD_MS = 8000
const TRASHBAG_SCALE = 1.15

const DEBRIS_COLORS = ['#3a2a1a', '#4a5a3a', '#5a5a5a'] as const
const DEBRIS_MIN = 3
const DEBRIS_MAX = 4
const DEBRIS_RADIUS_PX = 30
const DEBRIS_SIZE_MIN = 5
const DEBRIS_SIZE_MAX = 8
const SETTLED_SPEED = 0.12

const FLIES_MAX = 20
const FLIES_EMERGE_MS = 700

// Target fill pace:
// - 7:30 AM starts empty
// - ~3:30 PM (8 hours later) is "full"
const HOURS_TO_FILL_VISIBLE = 8

// For scale ~ Uniform(a,b), E[scale^2] = (b^3 - a^3) / (3(b-a))
const AVG_SIZE_SCALE_SQUARED =
  (Math.pow(SIZE_SCALE_MAX, 3) - Math.pow(SIZE_SCALE_MIN, 3)) / (3 * (SIZE_SCALE_MAX - SIZE_SCALE_MIN))

export type TrashType = 'recycling' | 'compost' | 'landfill'

type SpriteInfo = {
  img: HTMLImageElement
  ready: boolean
}

type TrashImageFilename =
  | 'recyclable_example.png'
  | 'bottle_no_bg.png'
  | 'compost_example.png'
  | 'apple_no_bg.png'
  | 'meat_no_bg.png'
  | 'landfill_example.png'
  | 'trashbag_no_bg.png'
  | 'fly_no_bg.png'

const TRASH_IMAGE_URLS: Record<TrashImageFilename, string> = {
  'recyclable_example.png': recyclableTextureUrl,
  'bottle_no_bg.png': bottleNoBgUrl,
  'compost_example.png': compostTextureUrl,
  'apple_no_bg.png': appleNoBgUrl,
  'meat_no_bg.png': meatNoBgUrl,
  'landfill_example.png': landfillTextureUrl,
  'trashbag_no_bg.png': trashbagNoBgUrl,
  'fly_no_bg.png': flyNoBgUrl,
}

const TRASH_IMAGE_OPTIONS: Record<TrashType, TrashImageFilename[]> = {
  recycling: ['recyclable_example.png', 'bottle_no_bg.png'],
  compost: ['compost_example.png', 'apple_no_bg.png', 'meat_no_bg.png'],
  landfill: ['landfill_example.png', 'trashbag_no_bg.png'],
}

type TransferStationProps = {
  running: boolean
  /** Current time as minutes from midnight (7:30 AM = 450 → 4:00 PM = 960). */
  currentMinutes: number
  onPileHeightChange: (heightPx: number) => void
  showMisplacedHighlight?: boolean
  showPauseBanner?: boolean
  onHighlightNext?: () => void
}

export function TransferStation({
  running,
  currentMinutes,
  onPileHeightChange,
  showMisplacedHighlight = false,
  showPauseBanner: _showPauseBanner = false,
  onHighlightNext,
}: TransferStationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<Matter.Engine | null>(null)
  const renderRef = useRef<Matter.Render | null>(null)
  const trashBodiesRef = useRef<Matter.Body[]>([])
  const lastSpawnedMinutesRef = useRef<number>(-1)
  const stageRef = useRef<HTMLDivElement>(null)
  const misplacedCountRef = useRef(0)
  const highlightStartMsRef = useRef<number | null>(null)
  const [scale, setScale] = useState(1)
  const [_misplacedCount, setMisplacedCount] = useState(0)
  const spritesRef = useRef<Map<TrashImageFilename, SpriteInfo> | null>(null)
  const pileHeightRef = useRef(0)
  const [canAdvance, setCanAdvance] = useState(false)

  type FlyState = 'hidden' | 'emerge' | 'free'
  type Fly = {
    seed: number
    state: FlyState
    x: number
    y: number
    vx: number
    vy: number
    opacity: number
    emergeStartMs: number
    startX: number
    startY: number
    targetX: number
    targetY: number
    nextChangeMs: number
  }
  const fliesRef = useRef<Fly[]>([])
  const fliesLastMsRef = useRef<number | null>(null)
  const dropCountRef = useRef(0)
  const pileTopYRef = useRef<number>(GROUND_Y)
  const pileMinXRef = useRef<number>(0)
  const pileMaxXRef = useRef<number>(PIT_WIDTH)


  const reset = useCallback(() => {
    const engine = engineRef.current
    if (!engine) return
    trashBodiesRef.current.forEach((body) => Matter.World.remove(engine.world, body))
    trashBodiesRef.current = []
    lastSpawnedMinutesRef.current = -1
    misplacedCountRef.current = 0
    fliesRef.current = []
    dropCountRef.current = 0
    fliesLastMsRef.current = null
    setMisplacedCount(0)
    onPileHeightChange(0)
  }, [onPileHeightChange])

  useEffect(() => {
    // Preload images once and reuse them for every body (no per-object loading).
    const sprites = new Map<TrashImageFilename, SpriteInfo>()
    ;(Object.keys(TRASH_IMAGE_URLS) as TrashImageFilename[]).forEach((filename) => {
      const img = new Image()
      const info: SpriteInfo = {
        img,
        ready: false,
      }
      img.onload = () => {
        info.ready = true
      }
      img.src = TRASH_IMAGE_URLS[filename]
      sprites.set(filename, info)
    })
    spritesRef.current = sprites

    return () => {
      // Let images be GC'd if this component unmounts.
      spritesRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!showMisplacedHighlight) {
      setCanAdvance(false)
      return
    }
    setCanAdvance(false)
    const t = setTimeout(() => setCanAdvance(true), HIGHLIGHT_HOLD_MS)
    return () => clearTimeout(t)
  }, [showMisplacedHighlight])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 1.5 },
    })
    // Helps settled piles stay stable and reduces endless micro-jitter.
    engine.enableSleeping = true
    // Slightly more solver work to reduce gaps in a dense pile.
    engine.positionIterations = 10
    engine.velocityIterations = 8
    engineRef.current = engine
    const matterRender = Matter.Render.create({
      canvas,
      engine,
      options: {
        width: PIT_WIDTH,
        height: PIT_HEIGHT,
        wireframes: false,
        background: 'transparent',
        pixelRatio: window.devicePixelRatio || 1,
      },
    })
    renderRef.current = matterRender

    // Static ground exactly at the bottom of the visible pit.
    const ground = Matter.Bodies.rectangle(PIT_WIDTH / 2, GROUND_Y + 20, PIT_WIDTH + 100, 40, {
      isStatic: true,
      render: { visible: false },
    })
    const leftWall = Matter.Bodies.rectangle(-20, PIT_HEIGHT / 2, 40, PIT_HEIGHT + 100, {
      isStatic: true,
      render: { visible: false },
    })
    const rightWall = Matter.Bodies.rectangle(
      PIT_WIDTH + 20,
      PIT_HEIGHT / 2,
      40,
      PIT_HEIGHT + 100,
      { isStatic: true, render: { visible: false } }
    )
    Matter.World.add(engine.world, [ground, leftWall, rightWall])

    const ctx = matterRender.context
    if (!ctx) return

    let rafId: number

    const drawOverlayEffects = () => {
      if (!showMisplacedHighlight) return
      const now = performance.now()
      if (highlightStartMsRef.current === null) highlightStartMsRef.current = now

      let nextMisplacedCount = 0
      trashBodiesRef.current.forEach((body) => {
        const typed = body as Matter.Body & { trashType?: TrashType }
        if (!typed.trashType) return
        if (typed.trashType === 'compost' || typed.trashType === 'recycling') nextMisplacedCount++
      })

      if (nextMisplacedCount !== misplacedCountRef.current) {
        misplacedCountRef.current = nextMisplacedCount
        setMisplacedCount(nextMisplacedCount)
      }
    }

    const drawTrash = () => {
      const sprites = spritesRef.current
      const dpr = window.devicePixelRatio || 1
      const highlight = showMisplacedHighlight

      // Matter.Render sets up a high-DPI canvas; ensure our manual drawing
      // uses world-units (px) and scales consistently with the pit size.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Clear + dark pit background each frame.
      ctx.clearRect(0, 0, PIT_WIDTH, PIT_HEIGHT)
      ctx.save()
      ctx.fillStyle = CANVAS_BG
      ctx.fillRect(0, 0, PIT_WIDTH, PIT_HEIGHT)
      ctx.restore()

      // Draw each body centered at its position, rotated with its physics angle.
      trashBodiesRef.current.forEach((body) => {
        const typed = body as Matter.Body & {
          trashType?: TrashType
          trashImage?: TrashImageFilename
          trashSquish?: boolean
          trashDebris?: Array<{ dx: number; dy: number; size: number; color: string; kind: 'rect' | 'arc' }>
        }
        const filename = typed.trashImage
        if (!filename) return
        const sprite = sprites?.get(filename)
        if (!sprite?.ready) return

        const bw = Math.max(1, body.bounds.max.x - body.bounds.min.x)
        const bh = Math.max(1, body.bounds.max.y - body.bounds.min.y)

        // Render size matches physics body scale.
        const size = Math.max(14, Math.min(52, Math.max(bw, bh)))
        const squish = typed.trashSquish === true
        const type = typed.trashType
        const isTrashbag = filename === 'trashbag_no_bg.png'

        ctx.save()
        ctx.translate(body.position.x, body.position.y)
        ctx.rotate(body.angle)

        // End highlight phase: brightness contrast (no neon/glow).
        // Normal phase stays grimy/desaturated.
        if (highlight) {
          if (type === 'compost' || type === 'recycling') {
            ctx.filter = HIGHLIGHT_FILTER_GOOD
          } else {
            ctx.filter = HIGHLIGHT_FILTER_BAD
          }
        } else {
          ctx.filter = TRASH_FILTER
        }
        // Occasional "squish" to simulate compression.
        if (squish) {
          ctx.scale(1, 0.75)
        }
        const drawSize = isTrashbag ? size * TRASHBAG_SCALE : size
        ctx.drawImage(sprite.img, -drawSize / 2, -drawSize / 2, drawSize, drawSize)
        ctx.filter = 'none'
        ctx.restore()

        // Filler debris (visual-only) around settled bodies; cached per-body (no flicker).
        const speed = Math.hypot(body.velocity.x, body.velocity.y)
        const isSettled = speed < SETTLED_SPEED && body.position.y > PIT_HEIGHT * 0.25
        if (isSettled && !typed.trashDebris) {
          const n = DEBRIS_MIN + Math.floor(Math.random() * (DEBRIS_MAX - DEBRIS_MIN + 1))
          typed.trashDebris = Array.from({ length: n }, () => {
            const a = Math.random() * Math.PI * 2
            const r = Math.random() * DEBRIS_RADIUS_PX
            const dx = Math.cos(a) * r
            const dy = Math.sin(a) * r
            const size = DEBRIS_SIZE_MIN + Math.random() * (DEBRIS_SIZE_MAX - DEBRIS_SIZE_MIN)
            const color = DEBRIS_COLORS[Math.floor(Math.random() * DEBRIS_COLORS.length)]
            const kind: 'rect' | 'arc' = Math.random() < 0.6 ? 'arc' : 'rect'
            return { dx, dy, size, color, kind }
          })
        }
        if (typed.trashDebris && typed.trashDebris.length > 0) {
          ctx.save()
          ctx.translate(body.position.x, body.position.y)
          typed.trashDebris.forEach((d) => {
            ctx.fillStyle = d.color
            if (d.kind === 'arc') {
              ctx.beginPath()
              ctx.arc(d.dx, d.dy, d.size / 2, 0, Math.PI * 2)
              ctx.fill()
            } else {
              ctx.fillRect(d.dx - d.size / 2, d.dy - d.size / 2, d.size, d.size)
            }
          })
          ctx.restore()
        }
      })

      // Dirty overlay on top to muddy everything.
      ctx.save()
      ctx.fillStyle = DIRTY_OVERLAY
      ctx.fillRect(0, 0, PIT_WIDTH, PIT_HEIGHT)
      ctx.restore()
    }

    const drawHighlightBanner = () => {
      if (!showMisplacedHighlight) return
      const dpr = window.devicePixelRatio || 1
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      ctx.save()
      const message = "50% of this trash could've been recycled or composted"
      ctx.font = '800 18px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'top'

      const paddingX = 20
      const paddingY = 10
      const topMargin = 14
      const radius = 12

      const metrics = ctx.measureText(message)
      const textW = metrics.width
      const textH = 18

      const pillW = textW + paddingX * 2
      const pillH = textH + paddingY * 2
      const pillX = (PIT_WIDTH - pillW) / 2
      const pillY = topMargin

      ctx.globalAlpha = 1
      ctx.filter = 'none'

      // Pill background.
      ctx.fillStyle = 'rgba(20, 60, 180, 0.90)'
      ctx.beginPath()
      if (typeof (ctx as any).roundRect === 'function') {
        ;(ctx as any).roundRect(pillX, pillY, pillW, pillH, radius)
      } else {
        const r = radius
        ctx.moveTo(pillX + r, pillY)
        ctx.arcTo(pillX + pillW, pillY, pillX + pillW, pillY + pillH, r)
        ctx.arcTo(pillX + pillW, pillY + pillH, pillX, pillY + pillH, r)
        ctx.arcTo(pillX, pillY + pillH, pillX, pillY, r)
        ctx.arcTo(pillX, pillY, pillX + pillW, pillY, r)
      }
      ctx.closePath()
      ctx.fill()

      // Text.
      ctx.fillStyle = '#ffffff'
      ctx.shadowColor = 'rgba(0,0,0,0.75)'
      ctx.shadowBlur = 8
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 2
      ctx.fillText(message, pillX + paddingX, pillY + paddingY)

      ctx.restore()
    }

    const drawFlies = () => {
      const sprites = spritesRef.current
      const flySprite = sprites?.get('fly_no_bg.png')
      if (!flySprite?.ready) return

      const dpr = window.devicePixelRatio || 1
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const flies = fliesRef.current
      if (!flies || flies.length === 0) return

      const now = performance.now()
      const last = fliesLastMsRef.current ?? now
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000))
      fliesLastMsRef.current = now

      // Flies can roam the full visible pit canvas, but never off-screen.
      const bounds = {
        minX: 8,
        maxX: PIT_WIDTH - 8,
        minY: 8,
        maxY: GROUND_Y - 8,
      }

      for (let i = 0; i < flies.length; i++) {
        const f = flies[i]

        if (f.state === 'emerge') {
          const t = Math.min(1, Math.max(0, (now - f.emergeStartMs) / FLIES_EMERGE_MS))
          const ease = t * (2 - t)
          f.x = f.startX + (f.targetX - f.startX) * ease
          f.y = f.startY + (f.targetY - f.startY) * ease
          f.opacity = ease
          if (t >= 1) {
            f.state = 'free'
            f.opacity = 1
            f.vx = (Math.random() - 0.5) * 1.2
            f.vy = (Math.random() - 0.5) * 1.2
            f.nextChangeMs = now + 250 + Math.random() * 900
          }
        } else if (f.state === 'free') {
          // Independent 2D wandering:
          // - each fly has its own (vx, vy) and change schedule
          // - small smooth random "steering" over time + rare tiny bursts
          if (now >= f.nextChangeMs) {
            const steer = 0.85
            f.vx += (Math.random() - 0.5) * steer
            f.vy += (Math.random() - 0.5) * steer

            // occasional quick direction shift (tiny burst)
            if (Math.random() < 0.12) {
              f.vx += (Math.random() - 0.5) * 2.2
              f.vy += (Math.random() - 0.5) * 2.2
            }

            const maxV = 2.4
            f.vx = Math.max(-maxV, Math.min(maxV, f.vx))
            f.vy = Math.max(-maxV, Math.min(maxV, f.vy))
            f.nextChangeMs = now + 220 + Math.random() * 1100
          }

          // gentle damping so it doesn't run away
          f.vx *= 0.986
          f.vy *= 0.986
          f.x += f.vx * 60 * dt
          f.y += f.vy * 60 * dt

          // Soft bounce off edges (avoids getting "stuck" at bounds).
          if (f.x < bounds.minX) {
            f.x = bounds.minX
            f.vx = Math.abs(f.vx) * 0.88 + 0.2
          } else if (f.x > bounds.maxX) {
            f.x = bounds.maxX
            f.vx = -Math.abs(f.vx) * 0.88 - 0.2
          }
          if (f.y < bounds.minY) {
            f.y = bounds.minY
            f.vy = Math.abs(f.vy) * 0.88 + 0.2
          } else if (f.y > bounds.maxY) {
            f.y = bounds.maxY
            f.vy = -Math.abs(f.vy) * 0.88 - 0.2
          }
        } else {
          f.opacity = 0
        }

        const size = 16
        const rot = (Math.sin((now / 1000) * 10 + f.seed) * 0.12 + (f.vx - f.vy) * 0.18) || 0

        ctx.save()
        ctx.translate(f.x, f.y)
        ctx.rotate(rot)
        ctx.globalAlpha = 0.9 * Math.max(0, Math.min(1, f.opacity))
        ctx.filter = 'none'
        ctx.drawImage(flySprite.img, -size / 2, -size / 2, size, size)
        ctx.restore()
      }

      // Light overlap prevention: nudge flies apart if too close.
      for (let i = 0; i < flies.length; i++) {
        for (let j = i + 1; j < flies.length; j++) {
          const a = flies[i]
          const b = flies[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist2 = dx * dx + dy * dy
          const minSep = 14
          if (dist2 > 0 && dist2 < minSep * minSep) {
            const dist = Math.sqrt(dist2)
            const push = ((minSep - dist) / minSep) * 0.9
            const ux = dx / dist
            const uy = dy / dist
            a.x = Math.min(bounds.maxX, Math.max(bounds.minX, a.x + ux * push))
            a.y = Math.min(bounds.maxY, Math.max(bounds.minY, a.y + uy * push))
            b.x = Math.min(bounds.maxX, Math.max(bounds.minX, b.x - ux * push))
            b.y = Math.min(bounds.maxY, Math.max(bounds.minY, b.y - uy * push))
          }
        }
      }
    }

    function tick() {
      Matter.Engine.update(engine)

      let minY = GROUND_Y
      let minX = PIT_WIDTH
      let maxX = 0
      trashBodiesRef.current.forEach((body) => {
        const verts = body.vertices
        if (verts.length) {
          const top = Math.min(...verts.map((v) => v.y))
          if (top < minY) minY = top
          if (body.bounds.min.x < minX) minX = body.bounds.min.x
          if (body.bounds.max.x > maxX) maxX = body.bounds.max.x
        }
      })

      const pileHeight = Math.max(0, GROUND_Y - minY)
      pileHeightRef.current = pileHeight
      pileTopYRef.current = Math.max(0, Math.min(GROUND_Y, minY))
      pileMinXRef.current = Math.max(0, Math.min(PIT_WIDTH, minX))
      pileMaxXRef.current = Math.max(0, Math.min(PIT_WIDTH, maxX))
      onPileHeightChange(pileHeight)
      drawTrash()
      drawOverlayEffects()
      // Flies render above trash (below banner).
      drawFlies()
      // Draw banner last so it sits above trash + outlines.
      drawHighlightBanner()
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      Matter.Render.stop(matterRender)
      Matter.Engine.clear(engine)
      renderRef.current = null
      engineRef.current = null
    }
  }, [onPileHeightChange, showMisplacedHighlight])

  useEffect(() => {
    if (!showMisplacedHighlight) {
      highlightStartMsRef.current = null
      return
    }
    if (highlightStartMsRef.current === null) highlightStartMsRef.current = performance.now()
  }, [showMisplacedHighlight])

  useEffect(() => {
    if (!running || currentMinutes < 0) return
    if (currentMinutes === lastSpawnedMinutesRef.current) return
    lastSpawnedMinutesRef.current = currentMinutes

    const engine = engineRef.current
    if (!engine) return

    // Recalibrate spawn count from canvas size + body size:
    // - totalBodiesThatFit ≈ (canvasArea / bodyArea) * packingEfficiency
    // - bodiesPerHour ≈ totalBodiesThatFit / hoursToFill
    const types: TrashType[] = ['recycling', 'compost', 'landfill']
    const canvasArea = PIT_WIDTH * PIT_HEIGHT

    // Small enough to pack densely. (We keep a small variance so the pile looks organic.)
    const baseSize = Math.max(18, Math.min(32, Math.round(PIT_WIDTH / 28))) // ~26px for 720px wide canvas
    const bodyAreaEstimate = baseSize * baseSize

    const avgBodyAreaEstimate = bodyAreaEstimate * AVG_SIZE_SCALE_SQUARED
    const totalBodiesThatFitWithVariance = Math.max(
      1,
      Math.floor((canvasArea * PACKING_EFFICIENCY) / Math.max(1, avgBodyAreaEstimate))
    )

    // Fill ~1/8th of the canvas per hour so it's full around 3:30 PM.
    const count = Math.max(1, Math.round(totalBodiesThatFitWithVariance / HOURS_TO_FILL_VISIBLE))

    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)]
      const options = TRASH_IMAGE_OPTIONS[type]
      const trashImage = options[Math.floor(Math.random() * options.length)]
      const isCircle = Math.random() > 0.5
      // Keep visuals + physics aligned: body dimensions are in the same px units
      // we use for drawImage(). Use a visible size range for 4th graders.
      // Varied sizes look like real trash (60%–130% of base).
      const sizeScale = SIZE_SCALE_MIN + Math.random() * (SIZE_SCALE_MAX - SIZE_SCALE_MIN)
      const size = Math.max(10, Math.round(baseSize * sizeScale))
      const half = size / 2

      // Random x across the full canvas width for an overwhelming, messy feel.
      const x = half + Math.random() * (PIT_WIDTH - size)
      const y = -half - Math.random() * 140
      const commonBodyOpts = {
        restitution: 0.02,
        friction: 0.7,
        frictionStatic: 0.9,
        frictionAir: 0.06,
        density: 0.003,
      } as const
      const body = isCircle
        ? Matter.Bodies.circle(x, y, half, {
            ...commonBodyOpts,
          })
        : Matter.Bodies.rectangle(
            x,
            y,
            size,
            size,
            {
              ...commonBodyOpts,
            }
          )
      ;(body as Matter.Body & { trashType: TrashType; trashImage: TrashImageFilename }).trashType = type
      ;(body as Matter.Body & { trashType: TrashType; trashImage: TrashImageFilename }).trashImage = trashImage
      ;(body as Matter.Body & { trashSquish: boolean }).trashSquish = Math.random() < SQUISH_CHANCE

      // Trash bags: 15% bigger in physics AND render.
      if (trashImage === 'trashbag_no_bg.png') {
        Matter.Body.scale(body, TRASHBAG_SCALE, TRASHBAG_SCALE)
      }

      // Messy and overwhelming: wide spread, full rotation range, and sideways energy.
      Matter.Body.setVelocity(body, { x: -2 + Math.random() * 4, y: 0 })
      Matter.Body.setAngle(body, Math.random() * Math.PI * 2)
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.12)

      Matter.World.add(engine.world, body)
      trashBodiesRef.current.push(body)
    }

    const flies = fliesRef.current
    // Fly progression:
    // - after the first 7:30 AM trash drop: 2 flies
    // - each subsequent trash drop: add +2–3 flies
    // - cap total at FLIES_MAX
    dropCountRef.current += 1
    const desiredAdd = flies.length === 0 ? 2 : 2 + (Math.random() < 0.5 ? 0 : 1)
    const toAdd = Math.max(0, Math.min(desiredAdd, FLIES_MAX - flies.length))

    // Spawn new flies near the current pile area, but movement can roam the full canvas.
    const left = Math.max(10, Math.min(PIT_WIDTH - 10, pileMinXRef.current))
    const right = Math.max(left + 80, Math.min(PIT_WIDTH - 10, pileMaxXRef.current))
    const pileTop = Math.max(0, Math.min(GROUND_Y, pileTopYRef.current))

    const now = performance.now()
    fliesLastMsRef.current = now

    // Important: do NOT reset existing flies on new drops.
    const totalAfter = Math.min(FLIES_MAX, Math.max(1, flies.length + toAdd))
    const step = (right - left) / totalAfter

    // New flies for this drop.
    for (let i = 0; i < toAdd; i++) {
      const idx = flies.length
      const seed = (idx + 1) * 7919
      const startX = left + step * (idx + 0.5) + (Math.random() - 0.5) * step * 0.4
      const startY = Math.max(12, Math.min(GROUND_Y - 12, pileTop + 10 + Math.random() * 30))
      flies.push({
        seed,
        state: 'emerge',
        x: startX,
        y: startY,
        vx: (Math.random() - 0.5) * 0.9,
        vy: (Math.random() - 0.5) * 0.9,
        opacity: 0,
        emergeStartMs: now,
        startX,
        startY,
        targetX: startX + (Math.random() - 0.5) * 18,
        targetY: Math.max(12, Math.min(GROUND_Y - 12, startY - (10 + Math.random() * 18))),
        nextChangeMs: now + 500 + Math.random() * 1200,
      })
    }

  }, [running, currentMinutes])

  useEffect(() => {
    // Keep the final pile visible after the day ends; only clear on true reset.
    if (!running && currentMinutes <= START_MINUTES) reset()
  }, [running, currentMinutes, reset])

  // Scale stage to fit viewport (width and height) so it never overflows on resize
  useEffect(() => {
    const parent = stageRef.current?.parentElement
    if (!parent) return
    const updateScale = () => {
      const w = parent.clientWidth
      const h = parent.clientHeight
      if (w <= 0 || h <= 0) return
      const scaleByWidth = w / STAGE_WIDTH
      const scaleByHeight = h / PIT_HEIGHT
      // Allow larger displays to upscale further so the scene does not feel tiny.
      const s = Math.min(scaleByWidth, scaleByHeight, 2.8)
      setScale(Math.max(0.2, s))
    }
    const ro = new ResizeObserver(updateScale)
    ro.observe(parent)
    updateScale()
    requestAnimationFrame(updateScale)
    return () => ro.disconnect()
  }, [])

  return (
    <div
      ref={stageRef}
      className="flex h-full min-h-0 w-full items-center justify-center overflow-hidden p-1"
    >
      <div
        className="relative flex shrink-0 items-end justify-center gap-2 sm:gap-4"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        <div className="flex flex-col items-center gap-3">
          {/* Gray pit — transfer station */}
          <div
            className="relative overflow-hidden rounded-2xl border-4 border-stone-500 bg-stone-500 shadow-2xl"
            style={{
              width: PIT_WIDTH,
              height: PIT_HEIGHT,
              background: 'linear-gradient(180deg, #78716c 0%, #57534e 25%, #44403c 60%, #292524 100%)',
              boxShadow: 'inset 0 6px 24px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.15)',
            }}
          >
            <canvas
              ref={canvasRef}
              width={PIT_WIDTH}
              height={PIT_HEIGHT}
              className="absolute inset-0 block"
              style={{ display: 'block' }}
            />
          </div>

        </div>
        {/* 4th grader beside pit for scale (same height as pit depth = 4.5 ft) */}
        <div className="flex flex-col items-center">
          <StudentSilhouette />
        </div>

        {showMisplacedHighlight && (
          <button
            type="button"
            onClick={() => {
              if (!canAdvance) return
              onHighlightNext?.()
            }}
            disabled={!canAdvance}
            className="absolute"
            style={{
              left: PIT_WIDTH + 24,
              top: 14,
              padding: '0.55rem 0.9rem',
              borderRadius: 12,
              background: '#059669',
              color: 'white',
              fontWeight: 900,
              boxShadow: '0 10px 22px rgba(0,0,0,0.35)',
              opacity: canAdvance ? 1 : 0.55,
              cursor: canAdvance ? 'pointer' : 'not-allowed',
              border: '2px solid rgba(255,255,255,0.25)',
            }}
          >
            Next →
          </button>
        )}
      </div>
    </div>
  )
}

export { PIT_HEIGHT, GROUND_Y, STUDENT_HEIGHT_PX }
