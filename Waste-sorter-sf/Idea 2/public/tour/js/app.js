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
    if (zoneNum === 1) setupZone1TruckMystery();
    if (zoneNum === 2) setupZone2SortingMystery();
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

  function setupZone1TruckMystery() {
    const speechP = document.getElementById('riley-speech-1')?.querySelector('p')
    const guessStep = document.getElementById('truckGuessStep')
    const truckArrivalStep = document.getElementById('truckArrivalStep')
    const scaleRevealStep = document.getElementById('scaleRevealStep')
    const truckSprite = document.getElementById('truckSprite')
    const btnCheck = document.getElementById('btnCheckTruckGuess')
    const zone1Next = document.getElementById('zone1Next')

    const guessTiles = Array.from(document.querySelectorAll('#truckGuessGrid button[data-truck-guess]'))
    const scaleFact1 = document.getElementById('scaleFact1')
    const scaleFact2 = document.getElementById('scaleFact2')
    const truckScaleReading = document.getElementById('truckScaleReading')

    if (!speechP || !guessStep || !truckArrivalStep || !scaleRevealStep || !btnCheck || !zone1Next || guessTiles.length !== 4) return

    const openingLine =
      "A truck just pulled in — and it's carrying YOUR neighborhood's trash. Before we check the scale... can you guess how heavy it is? 🤔"

    const correctReaction = "Nailed it! 🎉 This truck weighs about 27 tons — heavier than 10 elephants!"
    const wrongReaction =
      "Whoa, surprise! 🤯 This truck weighs about 27 tons — that's heavier than 10 elephants!"
    const closingLine =
      'And this is just the receiving area. Wait until you see what happens to all this stuff next...'

    const resetScaleFacts = () => {
      if (scaleFact1) {
        scaleFact1.hidden = true
        scaleFact1.style.display = 'none'
      }
      if (scaleFact2) {
        scaleFact2.hidden = true
        scaleFact2.style.display = 'none'
      }
      if (truckScaleReading) truckScaleReading.textContent = '🧮 Scale reading will appear here…'
    }

    const setTileStyles = (selectedChoice) => {
      guessTiles.forEach((tile) => {
        const choice = tile.dataset.truckGuess
        const isSelected = choice === selectedChoice
        if (isSelected) {
          tile.style.background = '#16a34a'
          tile.style.border = '3px solid #34d399'
          tile.style.color = 'white'
          tile.style.boxShadow = '0 6px 18px rgba(16,185,129,0.35)'
          tile.style.transform = 'scale(1.03)'
          tile.style.fontWeight = '900'
        } else {
          tile.style.background = '#111827'
          tile.style.border = '2px solid rgba(0,0,0,0.12)'
          tile.style.color = '#E5E7EB'
          tile.style.boxShadow = 'none'
          tile.style.transform = 'scale(1)'
          tile.style.fontWeight = '800'
        }
        tile.setAttribute('aria-pressed', isSelected ? 'true' : 'false')
      })
    }

    // Wire up interactions once (uses onclick assignments to avoid duplicates).
    guessTiles.forEach((tile) => {
      tile.onclick = () => {
        if (AppState.truckDone) return
        const choice = tile.dataset.truckGuess
        AppState.truckGuess = choice
        setTileStyles(choice)
        btnCheck.style.display = 'inline-flex'
      }
    })

    btnCheck.onclick = () => {
      if (AppState.truckDone) return
      const selected = AppState.truckGuess
      if (!selected) return

      AppState.truckDone = true
      btnCheck.style.display = 'none'

      // Disable further guessing once submitted.
      guessTiles.forEach((tile) => {
        tile.disabled = true
        tile.style.cursor = 'default'
      })

      AppState.addPoints(AppState.POINTS_TRUCK)
      updateDashboard()

      if (selected === 'B') {
        speechP.textContent = correctReaction
      } else {
        speechP.textContent = wrongReaction
      }

      // Move to Step 2 visuals (truck arrives).
      guessStep.hidden = true
      truckArrivalStep.hidden = false
      scaleRevealStep.hidden = true

      // Animate truck sliding in (simple translateX slide-in).
      if (truckSprite) {
        truckSprite.style.opacity = '1'
        truckSprite.style.transform = 'translateX(0px)'
      }

      // After a short pause, reveal the scale + comparison facts.
      setTimeout(() => {
        if (AppState.scaleDone) return
        AppState.scaleDone = true
        AppState.addPoints(AppState.POINTS_SCALE)
        updateDashboard()

        // Move to Step 3 visuals (scale + facts).
        truckArrivalStep.hidden = true
        scaleRevealStep.hidden = false

        if (truckScaleReading) {
          truckScaleReading.textContent = '🧮 Scale reading: about 27 tons'
        }

        scaleFact1.hidden = false
        scaleFact1.style.display = 'block'
        scaleFact1.style.opacity = '0'
        scaleFact1.style.transform = 'scale(0.96)'
        requestAnimationFrame(() => {
          scaleFact1.style.opacity = '1'
          scaleFact1.style.transform = 'scale(1)'
        })

        setTimeout(() => {
          scaleFact2.hidden = false
          scaleFact2.style.display = 'block'
          scaleFact2.style.opacity = '0'
          scaleFact2.style.transform = 'scale(0.96)'
          requestAnimationFrame(() => {
            scaleFact2.style.opacity = '1'
            scaleFact2.style.transform = 'scale(1)'
          })

          // Step 4: enable next stop once both chips are visible.
          speechP.textContent = closingLine
          zone1Next.hidden = false
          zone1Next.disabled = false
        }, 600)
      }, 1500)
    }

    // Now render the correct step based on current AppState.
    if (!AppState.truckDone) {
      speechP.textContent = openingLine
      guessStep.hidden = false
      truckArrivalStep.hidden = true
      scaleRevealStep.hidden = true
      resetScaleFacts()
      zone1Next.hidden = true
      zone1Next.disabled = true

      if (AppState.truckGuess) {
        setTileStyles(AppState.truckGuess)
        btnCheck.style.display = 'inline-flex'
      } else {
        setTileStyles(null)
        btnCheck.style.display = 'none'
      }
      guessTiles.forEach((tile) => {
        tile.disabled = false
        tile.style.cursor = 'pointer'
      })
      if (truckSprite) {
        truckSprite.style.opacity = '0'
        truckSprite.style.transform = 'translateX(-260px)'
      }
      return
    }

    if (AppState.truckDone && !AppState.scaleDone) {
      guessStep.hidden = true
      truckArrivalStep.hidden = false
      scaleRevealStep.hidden = true
      resetScaleFacts()
      zone1Next.hidden = true
      zone1Next.disabled = true

      if (AppState.truckGuess === 'B') {
        speechP.textContent = correctReaction
      } else {
        speechP.textContent = wrongReaction
      }

      if (truckSprite) {
        truckSprite.style.opacity = '1'
        truckSprite.style.transform = 'translateX(0px)'
      }

      guessTiles.forEach((tile) => {
        tile.disabled = true
        tile.style.cursor = 'default'
      })
      return
    }

    // scaleDone
    guessStep.hidden = true
    truckArrivalStep.hidden = true
    scaleRevealStep.hidden = false
    zone1Next.hidden = false
    zone1Next.disabled = false

    speechP.textContent = closingLine
    resetScaleFacts()
    if (truckScaleReading) truckScaleReading.textContent = '🧮 Scale reading: about 27 tons'
    if (scaleFact1) {
      scaleFact1.hidden = false
      scaleFact1.style.display = 'block'
      scaleFact1.style.opacity = '1'
      scaleFact1.style.transform = 'scale(1)'
    }
    if (scaleFact2) {
      scaleFact2.hidden = false
      scaleFact2.style.display = 'block'
      scaleFact2.style.opacity = '1'
      scaleFact2.style.transform = 'scale(1)'
    }
  }

  function setupZone2SortingMystery() {
    const speechP = document.getElementById('riley-speech-2')?.querySelector('p')
    const questionWrap = document.getElementById('zone2QuestionWrap')
    const answerWrap = document.getElementById('zone2AnswerWrap')
    const factWrap = document.getElementById('zone2FactWrap')
    const nextBtn = document.getElementById('zone2Next')
    const beltItems = [0, 1, 2].map((i) => document.getElementById('beltItem' + i))

    if (!speechP || !questionWrap || !answerWrap || !factWrap || !nextBtn) return

    const items = [
      {
        icon: '🥤',
        name: 'Plastic bottle',
        question: 'This plastic bottle just came off the belt. Where do you think it belongs?',
        correctBin: 'recycle',
        explanation:
          'Right bin! Plastic bottles are made of PET plastic — machines here can melt them down and spin them into new bottles, or even fleece jackets!',
        fact:
          "♻️ One recycled bottle saves enough energy to power a lightbulb for 6 hours! SF recycles millions of these every year.",
      },
      {
        icon: '🍌',
        name: 'Banana peel',
        question: 'A banana peel — still wet, still smelly. Where should this go?',
        correctBin: 'compost',
        explanation:
          "Compost it! Food scraps like this break down into rich soil that farmers use to grow more food. It's like nature's recycling!",
        fact:
          "🌱 SF's compost goes to farms in the Central Valley — the food you eat might have been grown with last week's banana peels!",
      },
      {
        icon: '🥫',
        name: 'Chip bag',
        question: 'Uh oh. A chip bag. Looks recyclable... but is it? 🤔',
        correctBin: 'landfill',
        explanation:
          "Tricky one! Chip bags look like plastic but they're actually layers of plastic AND metal foil fused together — impossible to separate, so they go to landfill. 😬",
        fact:
          "🗑️ Chip bags take 80+ years to break down in landfill. Some companies are experimenting with compostable chip bags — but we're not there yet!",
      },
    ]

    const binLabels = {
      recycle: '♻️ Recycling',
      compost: '🌱 Compost',
      landfill: '🗑️ Landfill',
    }

    if (typeof AppState.zone2CurrentItem !== 'number') AppState.zone2CurrentItem = 0
    if (!Array.isArray(AppState.zone2FactUnlocked)) AppState.zone2FactUnlocked = [false, false, false]
    if (typeof AppState.zone2Done !== 'boolean') AppState.zone2Done = false

    speechP.textContent =
      "Okay, now we're going BEHIND THE SCENES! 🎬 This is the sorting line — where everything from those trucks gets separated. Workers and machines work together here at super high speed. Let me show you how it works..."

    const revealBeltState = (activeIndex) => {
      beltItems.forEach((el, idx) => {
        if (!el) return
        el.classList.remove('visible', 'active')
        if (idx <= activeIndex) {
          el.classList.add('visible')
        }
      })
      if (beltItems[activeIndex]) {
        beltItems[activeIndex].classList.add('active')
      }
    }

    const renderQuestion = () => {
      const idx = AppState.zone2CurrentItem
      const item = items[idx]
      if (!item) return

      revealBeltState(idx)
      questionWrap.hidden = false
      answerWrap.hidden = true
      factWrap.hidden = true
      questionWrap.innerHTML = `
        <p class="zone2-item-title">${item.icon} ${item.name}</p>
        <p class="zone2-item-question">${item.question}</p>
        <div class="zone2-bin-choices">
          <button type="button" class="zone2-bin-btn" data-choice="recycle">${binLabels.recycle}</button>
          <button type="button" class="zone2-bin-btn" data-choice="compost">${binLabels.compost}</button>
          <button type="button" class="zone2-bin-btn" data-choice="landfill">${binLabels.landfill}</button>
        </div>
      `

      questionWrap.querySelectorAll('.zone2-bin-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const choice = btn.dataset.choice
          questionWrap.querySelectorAll('.zone2-bin-btn').forEach((b) => b.classList.remove('selected'))
          btn.classList.add('selected')
          const isCorrect = choice === item.correctBin
          renderAnswer(idx, isCorrect)
        })
      })
    }

    const renderAnswer = (idx, isCorrect) => {
      const item = items[idx]
      if (!item) return
      questionWrap.hidden = true
      answerWrap.hidden = false
      factWrap.hidden = true

      const lead = isCorrect ? '' : '<p style="margin:0 0 0.35rem;font-weight:800;color:#b45309;">Not quite — here\'s why...</p>'
      answerWrap.innerHTML = `
        <div class="zone2-answer-card">
          ${lead}
          <p style="margin:0;color:#1f2937;">${item.explanation}</p>
          <div style="margin-top:0.8rem;">
            <button type="button" class="btn btn-primary" id="zone2UnlockFact">🔓 Unlock fun fact</button>
          </div>
        </div>
      `
      document.getElementById('zone2UnlockFact')?.addEventListener('click', () => renderFact(idx))
    }

    const renderFact = (idx) => {
      const item = items[idx]
      if (!item) return

      questionWrap.hidden = true
      answerWrap.hidden = true
      factWrap.hidden = false

      if (!AppState.zone2FactUnlocked[idx]) {
        AppState.zone2FactUnlocked[idx] = true
        AppState.addPoints(10)
        updateDashboard()
      }

      const last = idx === items.length - 1
      factWrap.innerHTML = `
        <div class="zone2-fact-card">
          <span class="zone2-fact-label">🔓 Fun Fact Unlocked!</span>
          <p style="margin:0;color:#1f2937;font-weight:700;">${item.fact}</p>
          <div style="margin-top:0.8rem;">
            <button type="button" class="btn btn-primary" id="zone2FactNextBtn">
              ${last ? 'Finish Zone 2 →' : 'Next item on belt →'}
            </button>
          </div>
        </div>
      `

      document.getElementById('zone2FactNextBtn')?.addEventListener('click', () => {
        if (last) {
          AppState.zone2Done = true
          nextBtn.disabled = false
          speechP.textContent =
            "And that's just 3 items — workers here sort thousands every hour. Ready to see where your recycling actually ends up?"
          return
        }
        AppState.zone2CurrentItem = Math.min(items.length - 1, AppState.zone2CurrentItem + 1)
        renderQuestion()
      })
    }

    if (AppState.zone2Done) {
      revealBeltState(2)
      questionWrap.hidden = true
      answerWrap.hidden = true
      factWrap.hidden = true
      nextBtn.disabled = false
      speechP.textContent =
        "And that's just 3 items — workers here sort thousands every hour. Ready to see where your recycling actually ends up?"
      return
    }

    nextBtn.disabled = true
    renderQuestion()
  }

  // Start tour
  document.getElementById('btnStartTour')?.addEventListener('click', () => {
    showZone(1);
  });

  document.getElementById('zone1Next')?.addEventListener('click', () => {
    AppState.completeZone(1);
    showZone(2);
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
