# Recology San Francisco Transfer Station — Interactive Simulation Design Document

**Audience:** 4th-grade students (ages 9–10)  
**Delivery:** Interactive website (game-like, storytelling)  
**Learning focus:** Waste sorting, diversion, and behavior change  
**Estimated session:** 20–30 minutes  
**Standards alignment:** NGSS 4th grade — Earth’s systems, human impact on the environment

---

## 1. Persona Character Profile: Tour Guide

### Character: **Riley the Recology Ranger**

**Name:** Riley  
**Title:** Recology Ranger (virtual tour guide)  
**Pronouns:** They/them (inclusive, relatable)

#### Background Story
Riley is a friendly “Ranger” who works at the Recology San Francisco transfer station. They love showing people how waste gets sorted and where it goes. Riley used to be confused about recycling and composting too, until they learned the rules—now they want to help kids become “Sorting Champions” so less trash goes to the landfill.

#### Personality Traits
- **Curious and upbeat:** Asks questions, celebrates correct answers, never shames wrong ones.  
- **Patient:** Explains things simply and repeats key ideas.  
- **Encouraging:** Uses phrases like “Great thinking!” and “You’re getting it!”  
- **Slightly silly:** Uses light humor and fun facts (e.g., “Did you know…?”).  
- **Science-minded:** Uses accurate terms (compost, recyclable, landfill) in kid-friendly sentences.

#### Visual Appearance (for web illustration)
- **Species/style:** Stylized human or friendly mascot (e.g., person in a Recology-style vest or a ranger character).  
- **Outfit:** Green vest with “Recology Ranger” badge, comfortable pants, closed-toe shoes (safety). Optional: recycling/compost pins or patches.  
- **Colors:** Greens and earth tones; accent blue for recycling.  
- **Expression:** Usually smiling; eyes wide when excited; thoughtful when explaining.  
- **Accessories:** Clipboard or tablet to “check off” progress; optional safety helmet (flattened, cartoon style).

#### Speaking Style
- Short sentences (one idea per sentence).  
- Second person: “You can help by…” “When you put food in the green bin…”  
- Questions: “Where do you think this goes?” “What would you do at home?”  
- Positive framing: “When we sort correctly, we…” rather than “If you don’t sort…”  
- Occasional exclamations: “Wow!” “Nice!” “That’s the right idea!”

#### Character Animation States (for web)
| State       | Use case                    | Visual/audio spec                                                                 |
|------------|-----------------------------|------------------------------------------------------------------------------------|
| **Idle**   | Waiting for user input      | Gentle bounce or blink; optional soft ambient loop                                 |
| **Talking**| Delivering narration        | Mouth/speech bubble animation; optional short “talking” sound or none             |
| **Excited**| After correct answer        | Small jump or star burst; short “success” sound; confetti or sparkles (subtle)     |
| **Explaining**| Teaching a concept       | Pointing or gesturing toward bins/zones; calm tone                                 |
| **Celebrating**| End of zone or badge earned | Bigger animation (wave, thumbs up); badge unlock sound; optional short fanfare     |
| **Encouraging**| After incorrect answer   | Gentle nod, “Try again” expression; no negative sound; supportive line of dialogue |

#### Sample Dialogue Snippets
- **Intro:** “Hey! I’m Riley, your Recology Ranger. Today we’re going to explore where San Francisco’s trash goes—and you’ll get to make some sorting decisions. Ready?”  
- **After correct sort:** “Yes! That’s exactly where that goes. You’re helping keep stuff out of the landfill!”  
- **After mistake:** “Good try! This one actually goes in the blue bin because it’s [reason]. Want to try the next one?”  
- **Fact:** “Here’s a cool fact: more than half of what ends up in the landfill could have been recycled or composted. You can change that!”

---

## 2. Website Navigation Structure

### High-Level User Flow
```
Landing Page → Welcome / Intro (Riley) → Zone 1 → Zone 2 → … → Zone 6 → Pledge & Certificate → End
```

**Persistent UI:** Top bar with progress indicator; optional “Riley” button for help; mute/unmute; back to map (zone selector once unlocked).

### Zone Overview (6 Stations + Finale)

| # | Zone name              | Purpose                                      | Key interactions                          |
|---|------------------------|----------------------------------------------|-------------------------------------------|
| 1 | Welcome & Receiving    | Intro, trucks, scale, “what arrives”          | Click truck, weigh-in, start tour         |
| 2 | Sorting Lines          | How materials are separated                  | Conveyor demo, “what goes where”          |
| 3 | Recycling Bays         | Where recyclables go                         | Sort challenge 1, bin explorer             |
| 4 | Composting Section     | Organics and green bin                       | Sort challenge 2, compost facts           |
| 5 | Landfill-Bound Area    | What can’t be recycled/composted             | Sort challenge 3, “50% could be diverted” |
| 6 | Your Impact            | Real-world connections                       | Pause points, home/school comparison      |
| 7 | Pledge & Certificate   | Behavioral CTA                               | Choose pledges, print/share certificate   |

---

### Zone 1: Welcome & Receiving Area
- **Layout:** Full-bleed illustration of receiving area (trucks, scale, open doors). Riley in corner with speech bubble.  
- **Interactive elements:**  
  - “See a truck arrive” — click truck → short animation (truck pulls in, stops).  
  - “Weigh in” — click scale → number animation (e.g., “Today’s load: 2,400 tons”).  
  - “Start the tour” — primary CTA; advances to Zone 2.  
- **Navigation:** Next only (no back).  
- **Transitions:** Fade or slide to Zone 2; Riley says: “Let’s go to the sorting lines!”

---

### Zone 2: Sorting Lines
- **Layout:** Side-scroll or single view of conveyor and workers (stylized). Bins or chutes labeled Recycling / Compost / Landfill.  
- **Interactive elements:**  
  - “Watch the line” — click conveyor → items move and “drop” into correct chutes (pre-scripted).  
  - “What goes where?” — 3 clickable items on conveyor; each click shows label and destination.  
- **Navigation:** Back (to Zone 1), Next (to Zone 3).  
- **Transitions:** Conveyor continues briefly; cut to Recycling Bays.

---

### Zone 3: Recycling Bays
- **Layout:** Bays with material types (paper, plastic, metal, glass). Riley near blue recycling symbol.  
- **Interactive elements:**  
  - **Sorting Challenge 1** (see Section 4): Drag 5 items to correct bins.  
  - “Explore the bays” — click each bay for a 1-sentence fact.  
- **Navigation:** Back, Next. Replay challenge optional.  
- **Transitions:** Success animation; “You’ve unlocked the Composting Section!”

---

### Zone 4: Composting Section
- **Layout:** Green bins, piles of organic material (stylized), “Compost” signage.  
- **Interactive elements:**  
  - **Sorting Challenge 2:** Compost vs. not compost (e.g., food scraps, paper napkins, plastic fork).  
  - “Why compost?” — click for 2–3 short facts (soil, methane, plants).  
- **Navigation:** Back, Next.  
- **Transitions:** Green “success” glow; advance to Zone 5.

---

### Zone 5: Landfill-Bound Area
- **Layout:** Gray area, “Landfill” label, visual contrast with blue/green zones.  
- **Interactive elements:**  
  - **Sorting Challenge 3:** Mixed items; student sends each to recycle / compost / landfill.  
  - “The 50% fact” — click for stat: “Over 50% of what’s here could have been recycled or composted.”  
- **Navigation:** Back, Next.  
- **Transitions:** Riley summarizes; “Now let’s see how this connects to you.”

---

### Zone 6: Your Impact (Real-World Connections)
- **Layout:** Split or tabbed view: “At the transfer station” vs. “At home / at school.”  
- **Interactive elements:**  
  - **Pause points** (see Section 6): Hotspots or buttons for “At home” and “At school” comparisons.  
  - “What can you do?” — list of actions with checkmarks or clicks.  
- **Navigation:** Back, Next (to Pledge).  
- **Transitions:** “You’re ready to make a pledge!”

---

### Zone 7: Pledge & Certificate
- **Layout:** Pledge checklist (Section 8); “Print certificate” and “Share” buttons.  
- **Navigation:** Back to Zone 6; “Play again” or “Exit” (return to landing).

---

### Global Navigation Rules
- **Next:** Unlocked after zone content (and any required challenge) is completed.  
- **Back:** Always allowed except on landing and possibly Zone 1.  
- **Replay:** Available for each sorting challenge (no penalty).  
- **Progress:** Stored in session (or simple localStorage) so progress bar and badges update.

---

## 3. Interactive Game Elements (5+ Activities)

### Activity 1: Truck Arrival (Zone 1)
- **Type:** Click-to-reveal.  
- **Interface:** One large “truck” graphic; “Click to see a truck arrive” label.  
- **User input:** Single click.  
- **Feedback:** Truck drives in (CSS or JS animation); scale number increases; Riley: “Trucks bring San Francisco’s waste here every day.”  
- **Points/rewards:** +10 “Sorting Points” or “First step” badge.  
- **Progress:** Marks Zone 1 “visited” for dashboard.

---

### Activity 2: Conveyor “What Goes Where?” (Zone 2)
- **Type:** Click on items on conveyor.  
- **Interface:** 3–4 items on a conveyor (e.g., bottle, banana peel, chip bag). Each is clickable.  
- **User input:** Click item.  
- **Feedback:** Item highlights; tooltip or Riley speech: “[Item] goes to [Recycle/Compost/Landfill] because…”  
- **Points:** +5 per item clicked (exploration).  
- **Progress:** Zone 2 completion when all items clicked or “Next” pressed.

---

### Activity 3: Recycling Bays Sort (Zone 3) — see Section 4
- **Type:** Drag-and-drop to bins.  
- **Points:** +20 per correct drop; optional +10 “speed” bonus.  
- **Progress:** Unlocks Zone 4 when minimum correct (e.g., 4/5).

---

### Activity 4: Compost Explorer (Zone 4)
- **Type:** Click “Why compost?” and/or small multiple-choice.  
- **Interface:** 3 buttons: “Makes soil,” “Reduces methane,” “Feeds plants.” All correct; order doesn’t matter.  
- **User input:** Click each fact to reveal.  
- **Feedback:** Checkmark; short Riley line.  
- **Points:** +15 for opening all.  
- **Progress:** Counts toward zone completion.

---

### Activity 5: Landfill “50%” Reveal (Zone 5)
- **Type:** Click-to-reveal stat.  
- **Interface:** Gray “?” or “Tap to discover” on landfill area.  
- **User input:** Click.  
- **Feedback:** Modal or overlay: “Over 50% of what goes to the landfill could have been recycled or composted. You can help change that!”  
- **Points:** +10.  
- **Progress:** Logged for dashboard.

---

### Activity 6: Home vs. Station (Zone 6)
- **Type:** Hotspot or button comparison.  
- **Interface:** Two panels or tabs: “At the transfer station” and “At your home/school.” Matching actions (e.g., “Rinse bottles” → “Clean material at the plant”).  
- **User input:** Click each connection.  
- **Feedback:** Line or highlight connecting the two; Riley: “When you rinse at home, it helps the station sort better!”  
- **Points:** +10 per connection.  
- **Progress:** Zone 6 complete when all connections viewed.

---

### Activity 7: Pledge Selection (Zone 7)
- **Type:** Multi-select checklist.  
- **Interface:** 5–7 pledge options; student selects 1–3 (or more).  
- **User input:** Checkboxes or toggle buttons.  
- **Feedback:** “You’re a Sorting Champion!”; certificate updates with chosen pledges.  
- **Points:** Badge “Pledge Maker” or similar.  
- **Progress:** Final screen; certificate generated.

---

### Points and Badges (Summary)
- **Sorting Points:** Cumulative from activities (display in dashboard).  
- **Badges (examples):** First Step, Recycling Pro, Compost Champion, Landfill Saver, Connection Maker, Pledge Maker, Sorting Champion (full tour).  
- **Unlock logic:** Zones 2–6 unlock in order; Zone 7 after Zone 6.

---

## 4. Waste Sorting Assessment Points (3–4 Challenges)

### Visual Design of Sorting Bins
- **Three bins always visible:**  
  - **Blue — Recycling:** Icon (arrows/bottle); label “Recycling.”  
  - **Green — Compost:** Icon (leaf/food); label “Compost.”  
  - **Gray — Landfill:** Icon (trash); label “Landfill.”  
- **States:** Default; hover (slight scale + border); “accepting” when item is dragged over (highlight); “correct” (green check, short animation); “incorrect” (gentle shake, no harsh red).  
- **Layout:** Bottom or side of screen; same order (blue, green, gray) in every challenge for consistency.

### Drag-and-Drop Mechanics
- **Item:** Card or sprite with image and label (e.g., “Plastic bottle”).  
- **Interaction:** Drag from “incoming” area to one of the three bins.  
- **Drop:** On release over a bin, item snaps to bin; feedback plays; item disappears or bins “eat” it.  
- **Touch:** Same behavior; drag with finger; ensure hit targets are large (min 44px).  
- **Accessibility:** Alternative “click bin to assign” mode: click item, then click bin (or keyboard: select item, arrow to bin, Enter).

### Challenge 1: Recycling Bays (Zone 3)
- **Items (5):** Plastic water bottle, aluminum can, cardboard box, glass jar, plastic bag (landfill in SF).  
- **Correct answers:** Bottle→blue, can→blue, box→blue, jar→blue, bag→gray (teach: no plastic bags in blue in SF).  
- **Feedback:** Correct: bin glows, Riley celebrates, +20 points. Incorrect: Riley explains where it really goes; item can be re-dragged or auto-corrected with explanation.  
- **Success condition:** 4/5 or 5/5 to proceed; “Recycling Pro” badge at 5/5.

### Challenge 2: Composting Section (Zone 4)
- **Items (5):** Apple core, paper napkin, pizza box (greasy), plastic fork, banana peel.  
- **Correct:** Core→green, napkin→green, pizza box→green (if greasy/compostable program), fork→gray, peel→green.  
- **Feedback:** Same pattern; explain plastic and “why no plastic in compost.”  
- **Success:** 4/5 or 5/5; “Compost Champion” badge.

### Challenge 3: Landfill-Bound (Zone 5)
- **Items (6):** Mixed — e.g., newspaper, yogurt container (rinsed), orange peel, broken toy, milk carton, Styrofoam.  
- **Correct:** Newspaper→blue, yogurt→blue, peel→green, toy→gray, milk carton→blue (or per local rules), Styrofoam→gray.  
- **Feedback:** Emphasize “when in doubt, find out” and SF-specific rules.  
- **Success:** 5/6 or 6/6; “Landfill Saver” badge.

### Challenge 4 (Optional): Speed Round or “Mystery Item”
- **Interface:** One item at a time; three big buttons (Recycle / Compost / Landfill) instead of drag.  
- **Items:** 5 items; mix of easy and tricky (e.g., waxed carton, biodegradable plate).  
- **Feedback:** Immediate; bonus points for streak.  
- **Purpose:** Reinforce without repeating exact same UI.

### Success and Failure Animations
- **Success:** Bin does a small “pop” or pulse; checkmark overlay; optional particle burst; success sound (optional); Riley animation “celebrating.”  
- **Failure:** Bin shakes gently; no red “X” on child; Riley “encouraging” state + one-line explanation; item can be re-sorted.  
- **End of challenge:** Summary: “You got X of Y correct!” and badge if earned.

---

## 5. Learning Checkpoints with Branching Logic

### Checkpoint 1: “Where does it go?” (After Zone 2)
- **Scenario:** Riley holds up “plastic bottle with cap.”  
- **Options (clickable):**  
  - A) Recycling  
  - B) Compost  
  - C) Landfill  
- **Correct:** A. Feedback: “Right! In San Francisco, empty bottles go in the blue bin.”  
- **Wrong (B or C):** “This one goes in recycling. Food goes in compost; bottles go in blue!”  
- **Branching:** No path lock; same next zone. Optional: if wrong, one extra practice item before Zone 3.

### Checkpoint 2: “What helps most?” (Mid-tour, after Zone 4)
- **Question:** “What’s one thing that helps the transfer station the most?”  
- **Options:**  
  - A) Rinsing bottles and cans  
  - B) Putting everything in one bin  
  - C) Composting food scraps  
- **Acceptable:** A or C (both good). B is wrong.  
- **Feedback:** A or C: “Yes! Both of those help a lot.” B: “Putting everything in one bin makes sorting harder. Separate bins help!”  
- **Branching:** Optional “extra tip” screen if B was chosen (one more sentence about sorting).

### Checkpoint 3: “Why does the 50% matter?” (Zone 5)
- **Question:** “Why does it matter that so much landfill trash could have been recycled or composted?”  
- **Options:**  
  - A) It saves space and resources  
  - B) It doesn’t matter  
  - C) It helps the environment and our city  
- **Correct:** A or C. Wrong: B.  
- **Feedback:** Reinforce resources and environment; no punishment for B, just gentle correction.  
- **Branching:** All paths continue; no block.

### Checkpoint 4: “Your turn” (Zone 6)
- **Scenario:** “At lunch, you have a plastic bottle and an apple core. What do you do?”  
- **Options:**  
  - A) Put both in recycling  
  - B) Bottle in recycling, core in compost  
  - C) Throw both away  
- **Correct:** B.  
- **Feedback:** B: “Perfect! You’re thinking like a Ranger.” A/C: “The bottle goes in blue; the apple core goes in the green bin for compost.”  
- **Branching:** If B, Riley says “You’re ready to make a pledge.” If not, one more tip then same transition.

### General Branching Rules
- **No dead-ends:** Wrong answers never block progress; they add explanation or one extra practice.  
- **Adaptive hint:** If user gets 2 checkpoints wrong, next zone can add one extra Riley tip at the start.  
- **Story progression:** Always linear (Zone 1 → … → 7); branching only affects dialogue and optional extra content.

---

## 6. Real-World Connection Moments (“Pause Points”)

### Pause Point 1: Rinsing at Home ↔ Clean Material at the Station
- **Layout:** Split screen or two cards: “At home” (sink, bottle) and “At the transfer station” (sorting line).  
- **Hotspot/button:** “What happens when you rinse?”  
- **Reveal:** “When you rinse bottles and cans at home, they’re easier to sort and recycle here. Clean materials get turned into new products!”  
- **Riley:** “So a quick rinse in your kitchen helps the whole system.”

### Pause Point 2: Green Bin at School ↔ Compost at the Station
- **Layout:** “At school” (cafeteria green bin) and “At the station” (compost area).  
- **Hotspot:** “What happens to school food scraps?”  
- **Reveal:** “Food and napkins from your school’s green bin can come here to become compost. That compost helps gardens and farms!”  
- **Riley:** “Your school’s green bin is part of the same system.”

### Pause Point 3: “When in Doubt” — Look It Up
- **Layout:** Single panel: kid at home with a “?” item.  
- **Button:** “What if I’m not sure?”  
- **Reveal:** “San Francisco has a guide: sfrecycles.org. You can also ask your family or teacher. When we sort correctly, we help the station do its job.”  
- **Riley:** “No one knows everything—looking it up is smart!”

### Pause Point 4: Single-Use vs. Reusable
- **Layout:** Side-by-side: disposable bottle vs. reusable bottle.  
- **Hotspot:** “Why do Rangers care about reusable?”  
- **Reveal:** “Using a reusable bottle means less trash to sort and less that might end up in the landfill. Small choices add up!”  
- **Riley:** “Every time you choose reusable, you’re helping.”

### Implementation Notes
- Each pause point is a clear “info” or “?” button; click opens a small overlay or inline expand.  
- Optional: “Got it” to close and mark as seen for progress.  
- No quiz here; purely informational to connect station to daily life.

---

## 7. Progress Tracking Dashboard

### Placement and Layout
- **Position:** Top bar (desktop) or collapsible top bar (tablet/mobile).  
- **Contents:** Progress indicator + optional points + badges.

### Progress Indicator (Zone Map)
- **Visual:** Horizontal strip or “path” with 6–7 nodes (one per zone).  
- **States per node:** Locked (gray), Current (highlighted), Completed (checkmark or filled).  
- **Interaction:** Clicking a completed node could scroll to that zone or show a short “You did…” summary; locked nodes show “Complete [previous zone] to unlock.”

### Completion Percentage
- **Formula:** (Zones completed / 6) × 100; or (Activities completed / total activities) × 100.  
- **Display:** “Tour: 50%” or “3 of 6 zones” with a simple progress bar.  
- **Update:** After each zone “Next” or challenge completion.

### Points Display
- **Label:** “Sorting Points” or “Ranger Points.”  
- **Number:** Sum of all activity points.  
- **Optional:** Small “+10” float when points are earned.

### Badge System
- **Badges:** First Step, Recycling Pro, Compost Champion, Landfill Saver, Connection Maker, Pledge Maker, Sorting Champion.  
- **Display:** Row of icons below or next to progress; locked = gray outline; unlocked = full color with optional tooltip (name + short description).  
- **Storage:** Session or localStorage so refresh doesn’t lose progress within one “play-through.”

### Responsive Behavior
- **Desktop:** Full top bar with map + points + badges.  
- **Tablet:** Same or slightly compressed; badges may wrap.  
- **Mobile:** Progress bar + percentage; badges in a “Badges” drawer or second row.

---

## 8. Behavioral Call-to-Action Finale (Pledge & Certificate)

### Pledge Screen Layout
- **Title:** “Become a Sorting Champion” or “My Waste-Sorting Pledge.”  
- **Subtitle:** “Choose what you’ll try to do at home and school.”  
- **Riley:** “Pick at least one—or more!—to make your pledge.”

### Pledge Options (Clickable / Checkable)
1. “I will rinse bottles and cans before putting them in recycling.”  
2. “I will put food scraps and napkins in the green compost bin.”  
3. “I will keep recyclables (paper, plastic, metal, glass) in the blue bin.”  
4. “I will avoid single-use plastics when I can (e.g., use a reusable bottle).”  
5. “I will look up or ask when I’m not sure where something goes.”  
6. “I will remind my family to sort our waste at home.”  
7. “I will use the right bin at school (blue, green, gray).”

- **Interaction:** Checkboxes or toggle buttons; minimum 1 selected to “Complete pledge.”  
- **Feedback:** “You’re a Sorting Champion!” and certificate reflects chosen pledges.

### Certificate of Completion
- **Content:**  
  - Title: “Sorting Champion — Recology Transfer Station Virtual Tour.”  
  - Student name: Optional text input (“Enter your name”) or “A 4th Grade Ranger.”  
  - Date: Auto-filled (tour completion date).  
  - List of pledged actions (from checkboxes).  
  - Riley character and Recology/SF branding (tasteful).  
- **Actions:**  
  - “Print certificate” — opens print-friendly view (CSS `@media print`) or triggers `window.print()`.  
  - “Share” — optional: copy link to certificate page or “Share your achievement” text for teacher/parent.  
- **Design:** One page; clear typography; green/blue accent; suitable for printing in B&W.

### Final Screen After Pledge
- **Message:** “Thanks for touring with Riley! You’re helping San Francisco reduce waste. See you next time!”  
- **Buttons:** “Print certificate,” “Play again,” “Back to start.”

---

## 9. Technical Specifications for Cursor AI Development

### Button Types and States
- **Primary (CTA):** e.g. “Start tour,” “Next,” “Complete pledge.”  
  - Default: Solid green or blue; white text.  
  - Hover: Slightly darker; cursor pointer; optional scale 1.02.  
  - Active: Slightly smaller scale (0.98).  
  - Disabled: Gray; cursor not-allowed; no hover effect.  
- **Secondary:** “Back,” “Replay.”  
  - Outline or ghost style; same hover/active logic.  
- **Tertiary:** “Learn more,” “Why?”  
  - Text or icon-only; underline or icon on hover.  
- **Accessibility:** Focus visible (2px outline or ring); minimum touch target 44×44px; `aria-label` where needed.

### Color Scheme (Recycling Themes)
- **Recycling (blue):** Primary `#0072BC` or similar; use for blue bin, recycling zones, primary CTAs.  
- **Compost (green):** Primary `#2E7D32` or `#388E3C`; green bin, compost zone, success states.  
- **Landfill (gray):** `#616161` or `#757575`; landfill bin and zone; neutral.  
- **Backgrounds:** Light gray `#F5F5F5` or off-white `#FAFAFA`; white for cards.  
- **Text:** Dark gray `#212121` for body; black for headings.  
- **Accents:** Yellow/amber for badges and highlights if needed (`#F9A825`).  
- **Success:** Green tint; **avoid** red for errors—use neutral “try again” and Riley’s encouraging copy.

### Responsive Design
- **Breakpoints (example):**  
  - Mobile: 320–480px.  
  - Tablet: 481–768px.  
  - Desktop: 769px+.  
- **Classroom use:** Optimize for 1024×768 and 1280×720 (projector/smartboard).  
- **Tablets:** Large tap targets; no hover-only interactions; support both portrait and landscape.  
- **Layout:** Flexible grid; stack zones vertically on small screens; keep Riley and key buttons visible.

### Accessibility (Diverse Learners)
- **Semantic HTML:** `header`, `main`, `nav`, `section`, `article`, `button`, `label`.  
- **ARIA:**  
  - `aria-live` for dynamic feedback (e.g., “Correct!”).  
  - `aria-label` on icon-only buttons and bins.  
  - `role="status"` or `role="alert"` for result messages.  
- **Keyboard:** All actions (including drag-and-drop) available via keyboard (e.g., select item, choose bin, Enter).  
- **Focus order:** Logical (top to bottom, zone by zone).  
- **Color:** Don’t rely on color alone; use icons and text labels for bins.  
- **Motion:** Respect `prefers-reduced-motion` (disable or shorten animations).  
- **Text:** Readable font size (e.g., 16px base); sufficient contrast (WCAG AA).

### Performance and Tech Stack Suggestions
- **Assets:** Compress images; use SVG for Riley and icons where possible.  
- **Audio:** Short, optional; ensure mute toggle and no autoplay without user action.  
- **State:** Use sessionStorage or a simple JS state object for progress, points, badges, and pledge choices so refresh doesn’t lose progress.  
- **Framework-agnostic:** Design can be implemented with vanilla HTML/CSS/JS or React/Vue; keep structure and IDs clear for Cursor AI.

### File and Component Structure (Recommendation for Cursor)
- `index.html` — Landing and shell.  
- `css/` — `variables.css` (colors, spacing), `layout.css`, `components.css`, `animations.css`.  
- `js/` — `state.js` (progress, points, badges), `navigation.js`, `drag-drop.js`, `challenges.js`, `certificate.js`.  
- `assets/` — Riley sprites/states, bin graphics, zone illustrations, icons.  
- `pages/` or sections — One HTML section or template per zone if multi-page; or single-page with `data-zone` sections.  
- Optional: `audio/` — success, celebration, optional narration.

### Real Statistics to Integrate (San Francisco)
- **Diversion:** SF’s diversion rate is often cited in the 80% range (check current SF Environment or Recology data for exact %). The “over 50% of landfill-bound trash could be recycled or composted” is the key message for the simulation.
- **Composition:** Use current SF waste characterization if available (e.g., % organics, paper, plastic, in landfill stream) for “what’s in the waste” visuals or Riley facts.
- **Scale:** Recology SF transfer station handles a large share of the city’s waste; approximate daily tonnage can be used for “weigh in” (e.g., “2,400 tons per day” — verify with Recology).
- **Sources:** sfrecycles.org, SF Environment, Recology public reports. Update stats periodically for accuracy.

### NGSS Alignment (4th Grade)
- **ESS3.C:** Human impacts on Earth systems — connecting waste choices to environmental impact.  
- **Engineering design:** Systems (transfer station as a system; sorting as a process).  
- **Cause and effect:** Sorting decisions → less landfill, more recycling/compost.  
- **Data:** Use of real SF diversion/landfill stats (e.g., “over 50%”) as evidence.

---

## Summary Checklist for Development

- [ ] Riley character (art + 5 animation states)  
- [ ] 6 zones + landing + pledge/certificate (navigation and content)  
- [ ] 5+ activities with points and feedback  
- [ ] 3–4 sorting challenges (drag-and-drop + alternate click mode)  
- [ ] 4 learning checkpoints with branching (no blocking)  
- [ ] 4 real-world pause points (home/school connections)  
- [ ] Progress bar, points, badges (dashboard)  
- [ ] Pledge checklist and printable/shareable certificate  
- [ ] Buttons (primary/secondary/tertiary + states)  
- [ ] Color scheme (blue/green/gray), responsive, accessibility, reduced motion  

---

*Document version: 1.0 — For implementation in Cursor AI as an interactive educational website.*
