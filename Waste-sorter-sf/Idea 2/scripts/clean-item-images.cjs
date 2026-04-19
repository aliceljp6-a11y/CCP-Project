/* eslint-disable no-console */
/**
 * Generate transparent-background versions of item PNGs.
 *
 * Input:  public/assets/items/*.png  (not inside clean/)
 * Output: public/assets/items/clean/*.png
 *
 * Multi-pass:
 * - Detect light / dark / checkerboard-style backgrounds from border pixels
 * - Pass1: core transparency by color distance to background key colors
 * - Pass2: halo / fringe softening (reduce alpha near edges when still bg-like)
 * - Pass3 (optional): 1px alpha opening to drop tiny speckles
 * - Optional guarded trim of uniform transparent margins
 *
 * CLI:
 *   --threshold=26 RGB distance for light/neutral bg (0..~441)
 *   --darkThreshold=38    RGB distance for dark/near-black bg
 *   --halo=22             extra tolerance on edge pixels; alpha scaled by proximity
 *   --checkerMinRatio=0.16 *   --checkerDelta=28     min separation between two checker colors
 *   --speckle=0|1         alpha opening (default 1)
 *   --trim=0|1            guarded trim (default 1)
 *   --trimMaxPx=48        max border band removed or skip trim
 */

const fs = require('node:fs')
const path = require('node:path')
const sharp = require('sharp')

const ROOT = path.join(__dirname, '..')
const SRC_DIR = path.join(ROOT, 'public', 'assets', 'items')
const OUT_DIR = path.join(SRC_DIR, 'clean')

/** Merge into CLI opts per source filename when a light bg is hard to separate (e.g. sandwich on busy plate). */
const PER_FILE_OPTS = {
  'sandwich-item.png': { threshold: 36, halo: 28 },
}

function parseArgs(argv) {
  const out = {
    threshold: 26,
    darkThreshold: 38,
    halo: 22,
    checkerMinRatio: 0.16,
    checkerDelta: 28,
    speckle: 1,
    trim: 1,
    trimMaxPx: 48,
  }
  for (const a of argv) {
    if (a.startsWith('--threshold=')) out.threshold = Number(a.split('=')[1])
    if (a.startsWith('--darkThreshold=')) out.darkThreshold = Number(a.split('=')[1])
    if (a.startsWith('--halo=')) out.halo = Number(a.split('=')[1])
    if (a.startsWith('--checkerMinRatio=')) out.checkerMinRatio = Number(a.split('=')[1])
    if (a.startsWith('--checkerDelta=')) out.checkerDelta = Number(a.split('=')[1])
    if (a.startsWith('--speckle=')) out.speckle = Number(a.split('=')[1]) ? 1 : 0
    if (a.startsWith('--trim=')) out.trim = Number(a.split('=')[1]) ? 1 : 0
    if (a.startsWith('--trimMaxPx=')) out.trimMaxPx = Number(a.split('=')[1])
  }
  return out
}

function dist(a, b) {
  const dr = a[0] - b[0]
  const dg = a[1] - b[1]
  const db = a[2] - b[2]
  return Math.sqrt(dr * dr + dg * dg + db * db)
}

function luminance(rgb) {
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]
}

function saturation(rgb) {
  const r = rgb[0] / 255
  const g = rgb[1] / 255
  const b = rgb[2] / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  if (max === 0) return 0
  return (max - min) / max
}

function key(rgb) {
  return `${rgb[0]},${rgb[1]},${rgb[2]}`
}

function parseKey(k) {
  return k.split(',').map((v) => Number(v))
}

function clamp01(v) {
  return Math.max(0, Math.min(1, v))
}

/**
 * Border color analysis on downsampled image.
 */
async function analyzeBorder(img, opts) {
  const { data, info } = await img
    .ensureAlpha()
    .raw()
    .resize({ width: 220, height: 220, fit: 'inside' })
    .toBuffer({ resolveWithObject: true })

  const w = info.width
  const h = info.height
  const stride = w * 4
  const border = 3

  const counts = new Map()
  let borderSamples = 0

  function addPixel(x, y) {
    const idx = y * stride + x * 4
    const a = data[idx + 3]
    if (a < 200) return
    const rgb = [data[idx], data[idx + 1], data[idx + 2]]
    const k = key(rgb)
    counts.set(k, (counts.get(k) ?? 0) + 1)
    borderSamples++
  }

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const onBorder = x < border || x >= w - border || y < border || y >= h - border
      if (onBorder) addPixel(x, y)
    }
  }

  const total = borderSamples || 1
  const sorted = Array.from(counts.entries())
    .map(([k, c]) => ({ k, c, r: c / total, rgb: parseKey(k) }))
    .sort((a, b) => b.c - a.c)

  const top1 = sorted[0]
  const top2 = sorted[1]

  const L1 = top1 ? luminance(top1.rgb) : 255
  const L2 = top2 ? luminance(top2.rgb) : 255
  const sat1 = top1 ? saturation(top1.rgb) : 0
  const sat2 = top2 ? saturation(top2.rgb) : 0

  const d12 = top1 && top2 ? dist(top1.rgb, top2.rgb) : 0

  const isChecker =
    top1 &&
    top2 &&
    top1.r >= opts.checkerMinRatio &&
    top2.r >= opts.checkerMinRatio &&
    d12 >= opts.checkerDelta &&
    Math.abs(L1 - L2) < 55

  let mode = 'light'
  if (isChecker) {
    mode = 'checker'
  } else if (top1 && L1 < 62 && sat1 < 0.35) {
    mode = 'dark'
  } else if (top1 && L1 > 175 && sat1 < 0.45) {
    mode = 'light'
  } else if (top1 && L1 < 95) {
    mode = 'dark'
  }

  const bgColors = []
  if (mode === 'checker' && top1 && top2) {
    bgColors.push(top1.rgb, top2.rgb)
  } else if (top1) {
    bgColors.push(top1.rgb)
    if (top2 && top2.r > 0.08 && d12 < 55) bgColors.push(top2.rgb)
  }

  const dominance = top1?.r ?? 0

  return {
    mode,
    bgColors,
    dominance,
    top1Rgb: top1?.rgb ?? [255, 255, 255],
    isChecker,
  }
}

function minDistToBg(rgb, bgColors) {
  let m = Number.POSITIVE_INFINITY
  for (const b of bgColors) {
    m = Math.min(m, dist(rgb, b))
  }
  return m
}

function applyCoreTransparency(data, w, h, bgColors, threshold, darkThreshold, mode) {
  let removed = 0
  const t = mode === 'dark' ? darkThreshold : mode === 'checker' ? Math.max(threshold, 32) : threshold

  for (let i = 0; i < data.length; i += 4) {
    const rgb = [data[i], data[i + 1], data[i + 2]]
    const L = luminance(rgb)
    let d = minDistToBg(rgb, bgColors)

    if (mode === 'dark') {
      if (L < 72 && d <= t) {
        data[i + 3] = 0
        removed++
        continue
      }
    }

    if (d <= t) {
      data[i + 3] = 0
      removed++
    }
  }
  return removed
}

function applyHaloPass(data, w, h, bgColors, halo, mode, darkThreshold, lightThreshold) {
  let touched = 0
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]

  const idxAt = (x, y) => (y * w + x) * 4

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = idxAt(x, y)
      const a = data[i + 3]
      if (a === 0) continue

      let nearTransparent = false
      for (const [dx, dy] of dirs) {
        const nx = x + dx
        const ny = y + dy
        if (nx < 0 || nx >= w || ny < 0 || ny >= h) {
          nearTransparent = true
          break
        }
        if (data[idxAt(nx, ny) + 3] === 0) {
          nearTransparent = true
          break
        }
      }
      if (!nearTransparent) continue

      const rgb = [data[i], data[i + 1], data[i + 2]]
      const L = luminance(rgb)
      let d = minDistToBg(rgb, bgColors)

      let effectiveHalo = halo
      if (mode === 'checker') effectiveHalo = halo + 6
      if (mode === 'dark' && L < 90) effectiveHalo = halo + 10

      if (d <= effectiveHalo + (mode === 'dark' ? darkThreshold * 0.35 : lightThreshold * 0.25)) {
        const factor = clamp01(d / (effectiveHalo + 0.001))
        const newA = Math.round(a * factor)
        if (newA !== a) {
          data[i + 3] = newA
          touched++
        }
      }
    }
  }
  return touched
}

function alphaOpening(data, w, h) {
  const alphas = new Uint8Array(w * h)
  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    alphas[p] = data[i + 3]
  }

  const eroded = new Uint8Array(w * h)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let minA = 255
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx
          const ny = y + dy
          if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue
          minA = Math.min(minA, alphas[ny * w + nx])
        }
      }
      eroded[y * w + x] = minA
    }
  }

  const dilated = new Uint8Array(w * h)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let maxA = 0
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx
          const ny = y + dy
          if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue
          maxA = Math.max(maxA, eroded[ny * w + nx])
        }
      }
      dilated[y * w + x] = maxA
    }
  }

  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    data[i + 3] = dilated[p]
  }
}

async function removeBackground({ inputPath, outputPath, opts }) {
  const image = sharp(inputPath, { failOn: 'none' }).ensureAlpha()
  const meta = await image.metadata()

  const analysis = await analyzeBorder(image.clone(), opts)
  const { mode, dominance, isChecker } = analysis
  let bgColors = analysis.bgColors.length ? [...analysis.bgColors] : [[248, 248, 248]]

  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true })
  const w = info.width
  const h = info.height

  const removedCore = applyCoreTransparency(
    data,
    w,
    h,
    bgColors,
    opts.threshold,
    opts.darkThreshold,
    mode,
  )

  const haloTouched = applyHaloPass(data, w, h, bgColors, opts.halo, mode, opts.darkThreshold, opts.threshold)

  if (opts.speckle) {
    alphaOpening(data, w, h)
  }

  const removedRatio = removedCore / (w * h)
  const haloRatio = haloTouched / (w * h)

  const flags = []
  if (removedRatio < 0.06) flags.push('low_removed')
  if (removedRatio > 0.78) flags.push('high_removed')
  if (!isChecker && dominance < 0.18) flags.push('unclear_bg')
  if (haloRatio > 0.22) flags.push('halo_heavy')
  if (removedRatio > 0.55 && haloRatio > 0.12) flags.push('possible_subject_loss')

  await fs.promises.mkdir(path.dirname(outputPath), { recursive: true })

  const basePng = await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer()

  if (opts.trim) {
    const trimmed = await sharp(basePng).trim({ threshold: 12 }).toBuffer({ resolveWithObject: true })
    const tw = trimmed.info.width
    const th = trimmed.info.height
    const maxTrimBand = Math.max(w - tw, h - th)
    if (maxTrimBand <= opts.trimMaxPx && tw > 8 && th > 8) {
      await sharp(trimmed.data).png({ compressionLevel: 9, adaptiveFiltering: true }).toFile(outputPath)
    } else {
      flags.push('trim_skipped')
      await sharp(basePng).png({ compressionLevel: 9, adaptiveFiltering: true }).toFile(outputPath)
    }
  } else {
    await sharp(basePng).png({ compressionLevel: 9, adaptiveFiltering: true }).toFile(outputPath)
  }

  const confidence = clamp01(
    (dominance * 1.2 + (isChecker ? 0.12 : 0) + removedRatio * 0.3 - haloRatio * 0.15) / 1.15,
  )

  return {
    inputPath,
    outputPath,
    width: meta.width,
    height: meta.height,
    mode,
    isChecker,
    removedRatio,
    haloRatio,
    confidence,
    flags,
  }
}

async function main() {
  const opts = parseArgs(process.argv.slice(2))

  await fs.promises.mkdir(OUT_DIR, { recursive: true })

  const entries = await fs.promises.readdir(SRC_DIR, { withFileTypes: true })
  const pngs = entries
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.png'))
    .map((e) => e.name)
    .filter((n) => n.toLowerCase() !== 'clean')

  if (pngs.length === 0) {
    console.log(`No PNG files found in ${SRC_DIR}`)
    process.exit(0)
  }

  console.log(`Cleaning ${pngs.length} PNG(s)…`)
  console.log(`- Source: ${SRC_DIR}`)
  console.log(`- Output: ${OUT_DIR}`)
  console.log(
    `- opts threshold=${opts.threshold} darkThreshold=${opts.darkThreshold} halo=${opts.halo} speckle=${opts.speckle} trim=${opts.trim}`,
  )
  console.log('')

  const results = []
  for (const name of pngs) {
    const inputPath = path.join(SRC_DIR, name)
    const outputPath = path.join(OUT_DIR, name)
    const fileOpts = { ...opts, ...(PER_FILE_OPTS[name] || {}) }
    results.push(await removeBackground({ inputPath, outputPath, opts: fileOpts }))
  }

  const summary = results
    .map((r) => {
      const pct = Math.round(r.removedRatio * 1000) / 10
      const hpct = Math.round(r.haloRatio * 1000) / 10
      const conf = Math.round(r.confidence * 100)
      const flags = r.flags.length ? ` flags=${r.flags.join(',')}` : ''
      return `${path.basename(r.inputPath)} -> clean/${path.basename(r.outputPath)}  mode=${r.mode}  removed=${pct}%  halo=${hpct}%  conf=${conf}%${flags}`
    })
    .join('\n')

  console.log(summary)
  console.log('')
  console.log('Done. Review flags: unclear_bg, low_removed, high_removed, halo_heavy, possible_subject_loss, trim_skipped.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
