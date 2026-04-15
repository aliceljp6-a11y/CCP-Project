import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const NEAR_WHITE_THRESHOLD = 200
const NEAR_BLACK_THRESHOLD = 40

const DEFAULT_IMAGES = [
  'src/assets/images/recyclable_example.png',
  'src/assets/images/compost_example.png',
  'src/assets/images/landfill_example.png',
]

function isNearWhite(r, g, b) {
  return r > NEAR_WHITE_THRESHOLD && g > NEAR_WHITE_THRESHOLD && b > NEAR_WHITE_THRESHOLD
}

function isNearBlack(r, g, b) {
  return r < NEAR_BLACK_THRESHOLD && g < NEAR_BLACK_THRESHOLD && b < NEAR_BLACK_THRESHOLD
}

async function processOne(relPath) {
  const absPath = path.resolve(process.cwd(), relPath)

  const { data, info } = await sharp(absPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  if (info.channels !== 4) {
    throw new Error(`Expected RGBA (4 channels) for ${relPath}, got ${info.channels}`)
  }

  // data is a Buffer of RGBA bytes.
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    // Remove either a white matte (common cutout exports)
    // or a black matte (common transparent-preview exports).
    if (isNearWhite(r, g, b) || isNearBlack(r, g, b)) {
      data[i + 3] = 0
    }
  }

  const outBuffer = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer()

  // Overwrite original file.
  await fs.writeFile(absPath, outBuffer)
  return { relPath, bytes: outBuffer.length }
}

async function main() {
  const argvImages = process.argv.slice(2).filter(Boolean)
  const images = argvImages.length > 0 ? argvImages : DEFAULT_IMAGES

  const results = []
  for (const rel of images) {
    results.push(await processOne(rel))
  }

  // eslint-disable-next-line no-console
  console.log(
    `Done. Updated ${results.length} images:\n` +
      results.map((r) => `- ${r.relPath} (${r.bytes} bytes)`).join('\n')
  )
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exitCode = 1
})

