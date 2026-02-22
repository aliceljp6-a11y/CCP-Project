/**
 * Recology Transfer Station — Navigation, dashboard, zone interactions
 */
(function () {
  const dashboard = document.getElementById('dashboard');
  const pointsDisplay = document.getElementById('pointsDisplay');
  const progressFill = document.getElementById('progressFill');
  const progressLabel = document.getElementById('progressLabel');
  const badgesContainer = document.getElementById('badges');

  function showZone(zoneNum) {
    document.querySelectorAll('.zone').forEach(z => z.classList.remove('active'));
    const id = zoneNum === 0 ? 'zone-landing' : 'zone-' + zoneNum;
    const zone = document.getElementById(id);
    if (zone) zone.classList.add('active');
    AppState.currentZone = zoneNum;
    if (zoneNum > 0) {
      dashboard.classList.add('visible');
      dashboard.removeAttribute('aria-hidden');
    } else {
      dashboard.classList.remove('visible');
      dashboard.setAttribute('aria-hidden', 'true');
    }
    updateDashboard();
    window.scrollTo(0, 0);
  }

  function updateDashboard() {
    const completed = AppState.completedZones.length;
    const pct = Math.round((completed / 6) * 100);
    progressFill.style.width = pct + '%';
    progressLabel.textContent = completed + ' of 6 zones';
    document.querySelector('.progress-bar')?.setAttribute('aria-valuenow', completed);
    pointsDisplay.textContent = AppState.points + ' pts';

    document.querySelectorAll('.zone-dot').forEach((dot, i) => {
      const n = i + 1;
      dot.classList.remove('current', 'completed', 'unlocked');
      if (n <= AppState.currentZone || AppState.completedZones.includes(n)) dot.classList.add('unlocked');
      if (n === AppState.currentZone) dot.classList.add('current');
      if (AppState.completedZones.includes(n)) dot.classList.add('completed');
    });

    badgesContainer.innerHTML = '';
    AppState.BADGES.forEach(b => {
      const span = document.createElement('span');
      span.className = 'badge' + (AppState.badges.includes(b.id) ? ' earned' : '');
      span.title = b.name;
      span.setAttribute('aria-label', b.name + (AppState.badges.includes(b.id) ? ' earned' : ''));
      span.textContent = b.icon;
      badgesContainer.appendChild(span);
    });
  }

  // Start tour
  document.getElementById('btnStartTour')?.addEventListener('click', () => {
    showZone(1);
  });

  // Zone 1: truck and scale
  document.getElementById('btnTruck')?.addEventListener('click', () => {
    if (AppState.truckDone) return;
    AppState.truckDone = true;
    AppState.addPoints(AppState.POINTS_TRUCK);
    document.getElementById('btnTruck').classList.add('done');
    document.getElementById('riley-speech-1').querySelector('p').textContent = "Trucks bring San Francisco's waste here every day. Nice! Now try the scale.";
    updateDashboard();
  });
  document.getElementById('btnScale')?.addEventListener('click', () => {
    if (AppState.scaleDone) return;
    AppState.scaleDone = true;
    AppState.addPoints(AppState.POINTS_SCALE);
    const el = document.getElementById('scaleValue');
    if (el) {
      el.textContent = '2,400+ tons/day';
      el.style.display = 'inline';
    }
    document.getElementById('btnScale').classList.add('done');
    document.getElementById('riley-speech-1').querySelector('p').textContent = "Wow! That's a lot of material. When we sort correctly, less of it goes to the landfill. Let's go to the sorting lines!";
    updateDashboard();
  });
  document.getElementById('zone1Next')?.addEventListener('click', () => {
    AppState.completeZone(1);
    showZone(2);
  });

  // Zone 2: conveyor and items
  document.getElementById('btnConveyor')?.addEventListener('click', () => {
    if (AppState.conveyorClicked) return;
    AppState.conveyorClicked = true;
    document.getElementById('btnConveyor').textContent = 'Line moving!';
    document.getElementById('riley-speech-2').querySelector('p').textContent = "Items move along the line and get sorted into the right chutes. Click each item to learn where it goes!";
  });
  document.querySelectorAll('.conveyor-item').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('revealed')) return;
      btn.classList.add('revealed');
      AppState.conveyorItemsRevealed++;
      AppState.addPoints(AppState.POINTS_CONVEYOR_ITEM);
      const msg = btn.dataset.msg || '';
      document.getElementById('riley-speech-2').querySelector('p').textContent = msg;
      updateDashboard();
    });
  });

  // Zone nav: Back / Next
  document.querySelectorAll('[data-back]').forEach(btn => {
    btn.addEventListener('click', () => showZone(parseInt(btn.dataset.back, 10)));
  });
  document.querySelectorAll('[data-next]').forEach(btn => {
    btn.addEventListener('click', () => {
      const next = parseInt(btn.dataset.next, 10);
      if (next >= 2 && next <= 6) AppState.completeZone(next - 1);
      if (next === 7) AppState.completeZone(6);
      showZone(next);
    });
  });

  // Zone 3 next enabled by challenge (handled in challenges.js)
  document.getElementById('zone3Next')?.addEventListener('click', () => {
    AppState.completeZone(3);
    showZone(4);
  });
  document.getElementById('zone4Next')?.addEventListener('click', () => {
    AppState.completeZone(4);
    showZone(5);
  });
  document.getElementById('zone5Next')?.addEventListener('click', () => {
    AppState.completeZone(5);
    showZone(6);
  });

  // Zone 4: Why compost facts
  document.querySelectorAll('.fact-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('revealed')) return;
      btn.classList.add('revealed');
      AppState.compostFactsRevealed++;
      if (AppState.compostFactsRevealed === 3) AppState.addPoints(AppState.POINTS_COMPOST_FACTS);
      updateDashboard();
    });
  });

  // Zone 5: 50% fact
  document.getElementById('btn50Fact')?.addEventListener('click', () => {
    if (AppState.fiftyFactRevealed) return;
    AppState.fiftyFactRevealed = true;
    AppState.addPoints(AppState.POINTS_50_FACT);
    document.getElementById('btn50Fact').classList.add('revealed');
    document.getElementById('btn50Fact').textContent = 'Over 50% of landfill trash could have been recycled or composted. You can help change that!';
    document.getElementById('modal50').hidden = false;
    updateDashboard();
  });
  document.getElementById('closeModal50')?.addEventListener('click', () => {
    document.getElementById('modal50').hidden = true;
  });

  // Zone 6: Connections
  document.querySelectorAll('.connection-card').forEach(card => {
    card.addEventListener('click', () => {
      if (card.classList.contains('revealed')) return;
      card.classList.add('revealed');
      AppState.connectionsRevealed++;
      AppState.addPoints(AppState.POINTS_CONNECTION);
      if (AppState.connectionsRevealed >= 4) AppState.updateBadges();
      const msg = card.querySelector('.connection-reveal')?.textContent || '';
      document.getElementById('connectionModalMsg').textContent = msg;
      document.getElementById('modalConnection').hidden = false;
      updateDashboard();
    });
  });
  document.getElementById('closeModalConnection')?.addEventListener('click', () => {
    document.getElementById('modalConnection').hidden = true;
  });

  // Zone dots: jump to zone
  document.querySelectorAll('.zone-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      const n = parseInt(dot.dataset.zone, 10);
      if (n === AppState.currentZone || AppState.completedZones.includes(n) || n <= AppState.currentZone) showZone(n);
    });
  });

  updateDashboard();

  // Initialize sorting challenges when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChallenges);
  } else {
    initChallenges();
  }
})();
