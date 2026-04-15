import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const NEAR_WHITE_THRESHOLD = 200

function isNearWhite(r, g, b) {
  return r > NEAR_WHITE_THRESHOLD && g > NEAR_WHITE_THRESHOLD && b > NEAR_WHITE_THRESHOLD
}

async function processOne(relPath) {
  const absPath = path.resolve(process.cwd(), relPath)

  const { data, info } = await sharp(absPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  if (info.channels !== 4) {
    throw new Error(`Expected RGBA (4 channels) for ${relPath}, got ${info.channels}`)
  }

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    if (isNearWhite(r, g, b)) data[i + 3] = 0
  }

  const outBuffer = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer()

  await fs.writeFile(absPath, outBuffer)
  return { relPath, bytes: outBuffer.length }
}

async function main() {
  const images = process.argv.slice(2).filter(Boolean)
  if (images.length === 0) {
    throw new Error('Usage: node scripts/remove-bg-white.js <relative/path/to/image.png> [...]')
  }

  const results = []
  for (const rel of images) results.push(await processOne(rel))

  // eslint-disable-next-line no-console
  console.log(`Done. Updated ${results.length} images:\n` + results.map((r) => `- ${r.relPath} (${r.bytes} bytes)`).join('\n'))
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exitCode = 1
})

