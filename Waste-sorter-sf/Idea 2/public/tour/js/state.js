/**
 * Recology Transfer Station — App state (points, badges, zone progress)
 */
const AppState = {
  points: 0,
  currentZone: 0,
  completedZones: [],
  badges: [],
  truckDone: false,
  scaleDone: false,
  truckGuess: null,
  zone2CurrentItem: 0,
  zone2FactUnlocked: [false, false, false],
  zone2Done: false,
  conveyorClicked: false,
  conveyorItemsRevealed: 0,
  challenge1Score: null,
  challenge2Score: null,
  challenge3Score: null,
  compostFactsRevealed: 0,
  fiftyFactRevealed: false,
  connectionsRevealed: 0,

  POINTS_TRUCK: 10,
  POINTS_SCALE: 10,
  POINTS_CONVEYOR_ITEM: 5,
  POINTS_CORRECT_SORT: 20,
  POINTS_COMPOST_FACTS: 15,
  POINTS_50_FACT: 10,
  POINTS_CONNECTION: 10,

  BADGES: [
    { id: 'first-step', name: 'First Step', icon: '🌟', minZone: 1 },
    { id: 'recycling-pro', name: 'Recycling Pro', icon: '♻️', challenge: 1, minCorrect: 5 },
    { id: 'compost-champion', name: 'Compost Champion', icon: '🍃', challenge: 2, minCorrect: 5 },
    { id: 'landfill-saver', name: 'Landfill Saver', icon: '🛡️', challenge: 3, minCorrect: 6 },
    { id: 'connection-maker', name: 'Connection Maker', icon: '🔗', minConnections: 4 },
    { id: 'pledge-maker', name: 'Pledge Maker', icon: '📋', pledge: true },
    { id: 'sorting-champion', name: 'Sorting Champion', icon: '🏆', fullTour: true }
  ],

  addPoints(amount) {
    this.points += amount;
    return this.points;
  },

  completeZone(zoneNum) {
    if (!this.completedZones.includes(zoneNum)) {
      this.completedZones.push(zoneNum);
      this.completedZones.sort((a, b) => a - b);
    }
    this.updateBadges();
  },

  updateBadges() {
    const earned = new Set(this.badges);
    for (const b of this.BADGES) {
      if (earned.has(b.id)) continue;
      if (b.minZone && this.completedZones.includes(b.minZone)) {
        earned.add(b.id);
        continue;
      }
      if (b.challenge === 1 && this.challenge1Score >= (b.minCorrect || 4)) earned.add(b.id);
      if (b.challenge === 2 && this.challenge2Score >= (b.minCorrect || 4)) earned.add(b.id);
      if (b.challenge === 3 && this.challenge3Score >= (b.minCorrect || 5)) earned.add(b.id);
      if (b.minConnections && this.connectionsRevealed >= b.minConnections) earned.add(b.id);
      if (b.fullTour && this.completedZones.length >= 6) earned.add(b.id);
    }
    this.badges = [...earned];
  },

  setPledgeDone() {
    if (!this.badges.includes('pledge-maker')) this.badges.push('pledge-maker');
  }
};
