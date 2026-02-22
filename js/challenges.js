/**
 * Recology Transfer Station — Sorting challenge data and drag-and-drop logic
 */

const CHALLENGE_1_ITEMS = [
  { id: 'bottle', label: 'Plastic bottle', icon: '🥤', correct: 'recycle', wrongMsg: 'Plastic bottles go in the blue recycling bin in San Francisco!' },
  { id: 'can', label: 'Aluminum can', icon: '🥫', correct: 'recycle', wrongMsg: 'Aluminum cans go in the blue bin so they can be recycled into new metal.' },
  { id: 'cardboard', label: 'Cardboard box', icon: '📦', correct: 'recycle', wrongMsg: 'Cardboard goes in the blue recycling bin.' },
  { id: 'jar', label: 'Glass jar', icon: '🫙', correct: 'recycle', wrongMsg: 'Glass jars go in the blue bin for recycling.' },
  { id: 'plastic-bag', label: 'Plastic bag', icon: '🛍️', correct: 'landfill', wrongMsg: 'In San Francisco, plastic bags don\'t go in the blue bin—they go to landfill. Reuse bags when you can!' }
];

const CHALLENGE_2_ITEMS = [
  { id: 'apple', label: 'Apple core', icon: '🍎', correct: 'compost', wrongMsg: 'Food scraps like apple cores go in the green compost bin!' },
  { id: 'napkin', label: 'Paper napkin', icon: '🧻', correct: 'compost', wrongMsg: 'Paper napkins can go in the green compost bin.' },
  { id: 'pizza', label: 'Greasy pizza box', icon: '🍕', correct: 'compost', wrongMsg: 'Greasy pizza boxes go in the green compost bin in SF.' },
  { id: 'fork', label: 'Plastic fork', icon: '🍴', correct: 'landfill', wrongMsg: 'Plastic doesn\'t go in compost—it goes to landfill. Use reusable utensils when you can!' },
  { id: 'banana', label: 'Banana peel', icon: '🍌', correct: 'compost', wrongMsg: 'Banana peels go in the green compost bin.' }
];

const CHALLENGE_3_ITEMS = [
  { id: 'newspaper', label: 'Newspaper', icon: '📰', correct: 'recycle', wrongMsg: 'Newspaper goes in the blue recycling bin.' },
  { id: 'yogurt', label: 'Yogurt container (rinsed)', icon: '🥛', correct: 'recycle', wrongMsg: 'Rinsed plastic containers go in the blue bin.' },
  { id: 'orange', label: 'Orange peel', icon: '🍊', correct: 'compost', wrongMsg: 'Orange peels go in the green compost bin.' },
  { id: 'toy', label: 'Broken toy', icon: '🧸', correct: 'landfill', wrongMsg: 'Broken toys usually go to landfill. Donate working toys instead!' },
  { id: 'milk', label: 'Milk carton', icon: '🥛', correct: 'recycle', wrongMsg: 'Milk cartons go in the blue recycling bin.' },
  { id: 'styrofoam', label: 'Styrofoam', icon: '📦', correct: 'landfill', wrongMsg: 'Styrofoam goes to landfill in SF. Avoiding it helps!' }
];

function renderChallengeItems(containerId, items, challengeKey) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  items.forEach((item, index) => {
    const el = document.createElement('div');
    el.className = 'challenge-item';
    el.dataset.id = item.id;
    el.dataset.correct = item.correct;
    el.dataset.wrongMsg = item.wrongMsg || '';
    el.draggable = true;
    el.setAttribute('aria-label', `Sort ${item.label} into a bin`);
    el.innerHTML = `<span class="item-icon">${item.icon}</span> ${item.label}`;
    el.addEventListener('dragstart', handleDragStart);
    el.addEventListener('dragend', handleDragEnd);
    el.addEventListener('click', () => handleItemClick(el, challengeKey));
    container.appendChild(el);
  });
}

let draggedElement = null;

function handleDragStart(e) {
  draggedElement = e.target;
  e.target.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', e.target.dataset.id);
}

function handleDragEnd(e) {
  e.target.classList.remove('dragging');
  draggedElement = null;
  document.querySelectorAll('.bin.drag-over').forEach(b => b.classList.remove('drag-over'));
}

function handleItemClick(itemEl, challengeKey) {
  if (itemEl.classList.contains('sorted')) return;
  const bins = document.querySelector(`#${challengeKey}Wrap .bins`);
  if (!bins) return;
  const binEls = bins.querySelectorAll('.bin');
  const selectBin = (bin) => {
    if (!bin || !itemEl.dataset.correct) return;
    tryDrop(itemEl, bin, challengeKey);
    document.removeEventListener('click', outsideClick);
    binEls.forEach(b => b.classList.remove('selected'));
  };
  const outsideClick = (e) => {
    if (!itemEl.contains(e.target) && !binEls[0].contains(e.target) && !binEls[1]?.contains(e.target) && !binEls[2]?.contains(e.target)) {
      binEls.forEach(b => b.classList.remove('selected'));
      document.removeEventListener('click', outsideClick);
    }
  };
  binEls.forEach(b => b.classList.remove('selected'));
  binEls.forEach(b => {
    b.classList.add('selected');
    const once = () => { selectBin(b); };
    b.addEventListener('click', once, { once: true });
  });
  setTimeout(() => document.addEventListener('click', outsideClick), 0);
}

function setupBinListeners(challengeKey, totalItems) {
  const wrap = document.getElementById(challengeKey + 'Wrap');
  if (!wrap) return;
  const bins = wrap.querySelectorAll('.bin');
  const feedbackEl = document.getElementById(challengeKey + 'Feedback');
  const zoneNum = { challenge1: 3, challenge2: 4, challenge3: 5 }[challengeKey];
  const nextBtn = document.getElementById('zone' + zoneNum + 'Next') || wrap.closest('.zone')?.querySelector('.btn-next');

  bins.forEach(bin => {
    bin.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      bin.classList.add('drag-over');
    });
    bin.addEventListener('dragleave', () => bin.classList.remove('drag-over'));
    bin.addEventListener('drop', (e) => {
      e.preventDefault();
      bin.classList.remove('drag-over');
      if (draggedElement) tryDrop(draggedElement, bin, challengeKey);
    });
  });

  function tryDrop(itemEl, bin, key) {
    if (!itemEl || itemEl.classList.contains('sorted')) return;
    const correct = itemEl.dataset.correct;
    const wrongMsg = itemEl.dataset.wrongMsg || '';
    const binType = bin.dataset.bin;
    const isCorrect = correct === binType;

    if (isCorrect) {
      bin.classList.add('correct');
      feedbackEl.textContent = "Yes! That's exactly where that goes. You're helping keep stuff out of the landfill!";
      feedbackEl.className = 'challenge-feedback correct';
      AppState.addPoints(AppState.POINTS_CORRECT_SORT);
    } else {
      bin.classList.add('incorrect');
      feedbackEl.textContent = wrongMsg || 'Good try! Check the bins and try the next one.';
      feedbackEl.className = 'challenge-feedback incorrect';
    }
    setTimeout(() => {
      bin.classList.remove('correct', 'incorrect');
    }, 600);

    itemEl.classList.add('sorted');
    itemEl.style.display = 'none';

    const sorted = wrap.querySelectorAll('.challenge-item.sorted').length;
    if (key === 'challenge1') {
      AppState.challenge1Score = sorted;
      if (sorted >= 5) AppState.updateBadges();
    }
    if (key === 'challenge2') {
      AppState.challenge2Score = sorted;
      if (sorted >= 5) AppState.updateBadges();
    }
    if (key === 'challenge3') {
      AppState.challenge3Score = sorted;
      if (sorted >= 6) AppState.updateBadges();
    }

    if (sorted >= totalItems) {
      feedbackEl.textContent = `You got ${sorted} of ${totalItems} correct! ${sorted >= totalItems - 1 ? "Great job!" : "Keep practicing!"}`;
      feedbackEl.className = 'challenge-feedback correct';
      if (nextBtn) nextBtn.disabled = false;
    }
  }
}

function initChallenges() {
  renderChallengeItems('challenge1Items', CHALLENGE_1_ITEMS, 'challenge1');
  renderChallengeItems('challenge2Items', CHALLENGE_2_ITEMS, 'challenge2');
  renderChallengeItems('challenge3Items', CHALLENGE_3_ITEMS, 'challenge3');
  setupBinListeners('challenge1', 5);
  setupBinListeners('challenge2', 5);
  setupBinListeners('challenge3', 6);

  document.getElementById('replay1')?.addEventListener('click', () => {
    AppState.challenge1Score = null;
    document.getElementById('zone3Next').disabled = true;
    renderChallengeItems('challenge1Items', CHALLENGE_1_ITEMS, 'challenge1');
    document.getElementById('challenge1Feedback').textContent = '';
    setupBinListeners('challenge1', 5);
  });
  document.getElementById('replay2')?.addEventListener('click', () => {
    AppState.challenge2Score = null;
    document.getElementById('zone4Next').disabled = true;
    renderChallengeItems('challenge2Items', CHALLENGE_2_ITEMS, 'challenge2');
    document.getElementById('challenge2Feedback').textContent = '';
    setupBinListeners('challenge2', 5);
  });
  document.getElementById('replay3')?.addEventListener('click', () => {
    AppState.challenge3Score = null;
    document.getElementById('zone5Next').disabled = true;
    renderChallengeItems('challenge3Items', CHALLENGE_3_ITEMS, 'challenge3');
    document.getElementById('challenge3Feedback').textContent = '';
    setupBinListeners('challenge3', 6);
  });
}
