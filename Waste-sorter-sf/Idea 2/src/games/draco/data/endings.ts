import type { EarthEnding, HealthTier } from '../types'

/** Shared heading across all end tiers — Draco and Earth are one. */
export const END_SEQUENCE_MAIN_HEADING = 'Draco is the Earth'

/** Shared reveal line from Draco. */
export const END_SEQUENCE_DRACO_QUOTE = 'I was Earth all along.'

export const ENDINGS: Record<HealthTier, EarthEnding> = {
  thriving: {
    tier: 'thriving',
    title: 'Earth is thriving',
    earthEmoji: '🌍✨',
    earthImagePath: '/draco/earth-healthy.jpg',
    mainHeading: END_SEQUENCE_MAIN_HEADING,
    dracoQuote: END_SEQUENCE_DRACO_QUOTE,
    dracoLine:
      'When I feel bright and strong, the planet feels it too. You made lots of Earth-helping choices!',
    lessonLine:
      'Draco and Earth are the same. When Draco’s magic is strong, Earth is thriving. You paid coins for the items—and your choices helped both of us.',
  },
  mostlyHealthy: {
    tier: 'mostlyHealthy',
    title: 'Earth is mostly healthy',
    earthEmoji: '🌎🌿',
    earthImagePath: '/draco/earth-healthy.jpg',
    mainHeading: END_SEQUENCE_MAIN_HEADING,
    dracoQuote: END_SEQUENCE_DRACO_QUOTE,
    dracoLine: 'My magic still feels strong—and Earth feels it with me.',
    lessonLine:
      'Draco and Earth are the same. When Draco stays healthy, Earth stays healthier too. You paid coins for the items, and many choices still helped Earth.',
  },
  tired: {
    tier: 'tired',
    title: 'Earth feels mixed',
    earthEmoji: '🌏🍃',
    earthImagePath: '/draco/earth-mixed.jpg',
    mainHeading: END_SEQUENCE_MAIN_HEADING,
    dracoQuote: END_SEQUENCE_DRACO_QUOTE,
    dracoLine: 'Some choices lifted me up, and some wore me down—Earth feels that mix too.',
    lessonLine:
      'Draco and Earth are the same. When Draco loses a little magic, Earth feels it too. You paid coins for the items, but Earth can pay a hidden cost.',
  },
  weak: {
    tier: 'weak',
    title: 'Earth is struggling',
    earthEmoji: '🌍💧',
    earthImagePath: '/draco/earth-struggling.jpg',
    mainHeading: END_SEQUENCE_MAIN_HEADING,
    dracoQuote: END_SEQUENCE_DRACO_QUOTE,
    dracoLine: 'I feel weaker—and Earth is struggling alongside me. We can still turn things around.',
    lessonLine:
      'Draco and Earth are the same. When Draco gets weaker, Earth is struggling too. You paid coins for the items, but Earth paid part of the hidden cost.',
  },
  critical: {
    tier: 'critical',
    title: 'Earth needs care',
    earthEmoji: '🌎🫧',
    earthImagePath: '/draco/earth-critical.jpg',
    mainHeading: END_SEQUENCE_MAIN_HEADING,
    dracoQuote: END_SEQUENCE_DRACO_QUOTE,
    dracoLine: 'I feel very faint—but hope is still here. Your next choices can help Earth heal.',
    lessonLine:
      'Draco and Earth are the same. When Draco gets weak, Earth needs care too. You paid coins for the items, and Earth felt the hidden cost—small steps can still bring hope.',
  },
}
