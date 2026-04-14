import React, { useRef, useEffect, useCallback, useState } from 'react'
import Matter from 'matter-js'
import { StudentSilhouette, STUDENT_HEIGHT_PX } from './StudentSilhouette'
import { START_MINUTES } from './Clock'

const PIT_WIDTH = 720
const PIT_HEIGHT = 420
const GROUND_Y = PIT_HEIGHT - 20
/** Pit + student + gap; used to scale stage to fit viewport. */
const STAGE_WIDTH = PIT_WIDTH + 240

export type TrashType = 'recycling' | 'compost' | 'landfill'
const TRASH_COLORS: Record<TrashType, string> = {
  recycling: '#2563eb',
  compost: '#16a34a',
  landfill: '#1f2937',
}

type TransferStationProps = {
  running: boolean
  /** Current time as minutes from midnight (7:30 AM = 450 → 4:00 PM = 960). */
  currentMinutes: number
  onPileHeightChange: (heightPx: number) => void
  showMisplacedHighlight?: boolean
  showPauseBanner?: boolean
}

export function TransferStation({
  running,
  currentMinutes,
  onPileHeightChange,
  showMisplacedHighlight = false,
  showPauseBanner = false,
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
  const [misplacedCount, setMisplacedCount] = useState(0)

  const reset = useCallback(() => {
    const engine = engineRef.current
    if (!engine) return
    trashBodiesRef.current.forEach((body) => Matter.World.remove(engine.world, body))
    trashBodiesRef.current = []
    lastSpawnedMinutesRef.current = -1
    misplacedCountRef.current = 0
    setMisplacedCount(0)
    onPileHeightChange(0)
  }, [onPileHeightChange])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 0.8 },
    })
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

    const ground = Matter.Bodies.rectangle(
      PIT_WIDTH / 2,
      PIT_HEIGHT + 20,
      PIT_WIDTH + 100,
      60,
      { isStatic: true, render: { visible: false } }
    )
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
    const lerp = (start: number, end: number, t: number) => start + (end - start) * t

    const drawOverlayEffects = () => {
      if (!showMisplacedHighlight) return
      const now = performance.now()
      if (highlightStartMsRef.current === null) highlightStartMsRef.current = now
      const elapsedMs = now - highlightStartMsRef.current
      const transitionDurationMs = 1500
      const transitionProgress = Math.min(1, Math.max(0, elapsedMs / transitionDurationMs))

      // Fade in effect over first 1.5s, then begin a slow 2.5s breathing pulse.
      const pulseProgress =
        transitionProgress >= 1 ? (Math.sin((now / 2500) * 2 * Math.PI) + 1) / 2 : 0
      const glowWidthTarget = 1.5 + pulseProgress * 2.5
      const glowBlurTarget = 2 + pulseProgress * 4
      const glowWidth = lerp(0, glowWidthTarget, transitionProgress)
      const glowBlur = lerp(0, glowBlurTarget, transitionProgress)
      const landfillDimAlpha = lerp(0, 0.5, transitionProgress)
      const glowAlpha = lerp(0, 1, transitionProgress)

      let nextMisplacedCount = 0
      trashBodiesRef.current.forEach((body) => {
        const typed = body as Matter.Body & { trashType?: TrashType }
        const verts = body.vertices
        if (!typed.trashType || !verts.length) return

        if (typed.trashType === 'landfill') {
          // Dim landfill bodies to ~60% visual strength while keeping shape detail visible.
          ctx.save()
          ctx.beginPath()
          ctx.moveTo(verts[0].x, verts[0].y)
          for (let i = 1; i < verts.length; i++) ctx.lineTo(verts[i].x, verts[i].y)
          ctx.closePath()
          ctx.fillStyle = `rgba(22, 28, 45, ${landfillDimAlpha})`
          ctx.fill()
          ctx.restore()
          return
        }

        nextMisplacedCount++
        ctx.save()
        ctx.beginPath()
        ctx.moveTo(verts[0].x, verts[0].y)
        for (let i = 1; i < verts.length; i++) ctx.lineTo(verts[i].x, verts[i].y)
        ctx.closePath()
        ctx.lineWidth = glowWidth
        ctx.strokeStyle = `rgba(255, 165, 0, ${glowAlpha})`
        ctx.shadowColor = `rgba(255, 215, 0, ${glowAlpha})`
        ctx.shadowBlur = glowBlur
        ctx.stroke()
        ctx.restore()
      })

      if (nextMisplacedCount !== misplacedCountRef.current) {
        misplacedCountRef.current = nextMisplacedCount
        setMisplacedCount(nextMisplacedCount)
      }
    }

    Matter.Events.on(matterRender, 'afterRender', drawOverlayEffects)

    function tick() {
      Matter.Engine.update(engine)
      let minY = GROUND_Y
      trashBodiesRef.current.forEach((body) => {
        const verts = body.vertices
        if (verts.length) {
          const top = Math.min(...verts.map((v) => v.y))
          if (top < minY) minY = top
        }
      })

      const pileHeight = Math.max(0, GROUND_Y - minY)
      onPileHeightChange(pileHeight)
      Matter.Render.world(renderRef.current as Matter.Render)
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      Matter.Events.off(matterRender, 'afterRender', drawOverlayEffects)
      Matter.Render.stop(matterRender)
      Matter.Engine.clear(engine)
      renderRef.current = null
      engineRef.current = null
    }
  }, [onPileHeightChange, showMisplacedHighlight])

  useEffect(() => {
    if (!showMisplacedHighlight) {
      highlightStartMsRef.current = null
    }
  }, [showMisplacedHighlight])

  useEffect(() => {
    if (!running || currentMinutes < 0) return
    if (currentMinutes === lastSpawnedMinutesRef.current) return
    lastSpawnedMinutesRef.current = currentMinutes

    const engine = engineRef.current
    if (!engine) return

    // ~1,500 tons/day at this station — spawn enough to fill the pit visibly
    const types: TrashType[] = ['recycling', 'compost', 'landfill']
    const count = 140 + Math.floor(Math.random() * 50)
    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)]
      const isCircle = Math.random() > 0.5
      const x = 60 + Math.random() * (PIT_WIDTH - 120)
      const y = -30 - Math.random() * 80
      const body = isCircle
        ? Matter.Bodies.circle(x, y, 5 + Math.random() * 8, {
            restitution: 0.15,
            friction: 0.5,
            density: 0.003,
            render: {
              fillStyle: TRASH_COLORS[type],
              strokeStyle: 'rgba(0,0,0,0.2)',
              lineWidth: 1,
            },
          })
        : Matter.Bodies.rectangle(
            x,
            y,
            10 + Math.random() * 14,
            8 + Math.random() * 12,
            {
              restitution: 0.15,
              friction: 0.5,
              density: 0.003,
              render: {
                fillStyle: TRASH_COLORS[type],
                strokeStyle: 'rgba(0,0,0,0.2)',
                lineWidth: 1,
              },
            }
          )
      ;(body as Matter.Body & { trashType: TrashType }).trashType = type
      Matter.World.add(engine.world, body)
      trashBodiesRef.current.push(body)
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
      const s = Math.min(scaleByWidth, scaleByHeight, 2)
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
        className="flex shrink-0 items-end justify-center gap-2 sm:gap-4"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
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
          {showPauseBanner && (
            <div className="pointer-events-none absolute left-0 right-0 top-0 px-4 pt-3">
              <div className="animate-recycle-banner rounded-xl border border-emerald-200/70 bg-emerald-500/90 px-4 py-3 text-center shadow-lg">
                <p className="font-display text-xl font-bold text-white">
                  ♻️ See how many items could have been recycled or composted!
                </p>
              </div>
            </div>
          )}
          {showMisplacedHighlight && (
            <div className="pointer-events-none absolute left-1/2 top-14 -translate-x-1/2 rounded-full border border-white/25 bg-black/60 px-5 py-2 shadow-lg">
              <p className="font-display text-[1.1rem] font-bold text-white">
                ♻️ {misplacedCount} items could have been recycled or composted!
              </p>
            </div>
          )}
        </div>
        {/* 4th grader beside pit for scale (same height as pit depth = 4.5 ft) */}
        <div className="flex flex-col items-center">
          <StudentSilhouette />
        </div>
      </div>
    </div>
  )
}

export { PIT_HEIGHT, GROUND_Y, STUDENT_HEIGHT_PX }
