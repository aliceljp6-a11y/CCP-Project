# Recology Transfer Station — Virtual Tour

Interactive web simulation for 4th-grade students. Explore the Recology San Francisco transfer station with Riley the Recology Ranger.

## Run in your browser

### Option 1: Open the file directly
Double-click **`index.html`** in File Explorer to open it in your default browser.  
*(Some features may work better with a local server.)*

### Option 2: Use a local server (recommended)
In a terminal, from this folder run:

```bash
# Python 3
python -m http.server 3000

# or Node.js (npx serve)
npx serve -l 3000
```

Then open: **http://localhost:3000**

## What’s included
- **Landing** — Riley intro and “Start the tour”
- **Zone 1** — Receiving (truck, scale)
- **Zone 2** — Sorting lines (conveyor, click items)
- **Zone 3** — Recycling bays + drag-and-drop sorting challenge (5 items)
- **Zone 4** — Composting + sorting challenge (5 items) + “Why compost?” facts
- **Zone 5** — Landfill area + “50%” fact + mixed sorting challenge (6 items)
- **Zone 6** — Your impact (home/school connections)
- **Zone 7** — Pledge checklist + printable certificate

Progress bar, points, and badges are saved during the session.
