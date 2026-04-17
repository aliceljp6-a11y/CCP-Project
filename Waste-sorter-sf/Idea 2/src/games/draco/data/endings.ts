import type { EarthEnding, HealthTier } from '../types'

export const ENDINGS: Record<HealthTier, EarthEnding> = {
  thriving: {
    tier: 'thriving',
    title: 'Earth is Thriving',
    earthEmoji: '🌍✨',
    earthImagePath: '/draco/earth-healthy.jpg',
    dracoLine: 'You made lots of Earth-helping choices. I feel bright and strong!',
    lessonLine: 'You paid coins for fun, and your choices helped Earth stay healthy.',
  },
  mostlyHealthy: {
    tier: 'mostlyHealthy',
    title: 'Earth is Mostly Healthy',
    earthEmoji: '🌎🌿',
    earthImagePath: '/draco/earth-healthy.jpg',
    dracoLine: 'Great effort! My magic still feels strong.',
    lessonLine: 'Your coins bought joy, and many choices supported Earth too.',
  },
  tired: {
    tier: 'tired',
    title: 'Earth Feels Mixed',
    earthEmoji: '🌏🍃',
    earthImagePath: '/draco/earth-mixed.jpg',
    dracoLine: 'Some choices helped me, some made me tired.',
    lessonLine: 'You paid coins for the fun, but Earth feels what happens after.',
  },
  weak: {
    tier: 'weak',
    title: 'Earth is Struggling',
    earthEmoji: '🌍💧',
    earthImagePath: '/draco/earth-struggling.jpg',
    dracoLine: 'My magic got weak, but we can still turn things around.',
    lessonLine: 'Coins buy things for us, but Earth pays the hidden cost.',
  },
  critical: {
    tier: 'critical',
    title: 'Earth Needs Care',
    earthEmoji: '🌎🫧',
    earthImagePath: '/draco/earth-critical.jpg',
    dracoLine: 'I feel very weak, but your next choices can help me heal.',
    lessonLine: 'In real life, Earth feels it too. Your choices can bring hope.',
  },
}
