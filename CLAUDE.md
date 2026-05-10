# WDISF — Where Do I Stand? Irish Political Compass

## Project overview

A single-file vanilla HTML/CSS/JS political compass quiz for the Republic of Ireland. No framework, no build step, no dependencies. The entire app lives in `index.html`.

**Live target:** Vercel project `wdisf` — team `ferg-flannerys-projects`  
**Project ID:** `prj_7rU2d243P7j9YfQ4lrdUW6uMiON1`  
**Team ID:** `team_XKafHT4L95zIlk3zGcJYOrpA`  
**Deploy command:** `vercel deploy --prod` from project root

---

## File structure

```
wdisf/
├── index.html        # Entire app — HTML + CSS + JS all inline
├── vercel.json       # Static site config for Vercel
└── .vercel/
    └── project.json  # Links to Vercel project (projectId + orgId)
```

**vercel.json:**
```json
{
  "version": 2,
  "builds": [{ "src": "index.html", "use": "@vercel/static" }],
  "routes": [{ "src": "/(.*)", "dest": "/index.html" }]
}
```

---

## Architecture

### State
Single global object `S`:
```js
let S = {
  phase: "intro",   // "intro" | "quiz" | "results"
  cat: 0,           // current category index (0–7)
  answers: {},      // { [questionId]: -2|-1|0|1|2 }
  dark: false       // theme toggle
}
```

### Render pattern
Fully re-renders on navigation. Three render functions:
- `renderIntro()` — landing page + party legend
- `renderQuiz()` — quiz view with live compass sidebar
- `renderResults()` — results with lean, compass, top matches, all 20 parties ranked

All write to `document.getElementById("root").innerHTML`.

Partial live updates (no full re-render) happen in `setAns()`:
- Updates the answer label in-place
- Redraws the canvas compass
- Updates the top-3 match sidebar
- Updates the progress bar

### Compass
Canvas-based (`<canvas id="compass-canvas">`). Drawn by `drawCompass(canvasId, axes, width, height)`.
- X axis = economic left/right (computed from `econ`, `housing`, `health` axes)
- Y axis = social/traditional (computed from `soc`, `nat`, `fuel` axes)
- Party dots plotted from hardcoded positions
- User dot moves in real time as questions are answered

### Scoring
Each question maps to an `axis` and a `dir` (+1 or -1):
- User answer × dir = directional score
- Axes: `econ`, `soc`, `nat`, `climate`, `housing`, `health`, `fuel`
- Party match = average absolute difference across all answered axes, normalised 0–100%

---

## Data

### Questions — 22 total across 8 categories
Each question:
```js
{
  id: Number,
  cat: String,      // one of CATS[]
  text: String,     // the question
  explain: String,  // plain-English explainer (HTML allowed, use <strong>)
  axis: String,     // which policy axis this scores
  dir: 1 | -1      // agree = left(-1) or right(+1) on this axis
}
```

**Categories (CATS array):**
1. Economy
2. Fuel & Cost of Living
3. Housing
4. Social
5. United Ireland
6. Climate
7. Healthcare
8. Governance

### Parties — 20 total
Each party:
```js
{
  name: String,
  abbr: String,
  col: String,      // hex colour for dots/bars
  size: "major" | "mid" | "minor",
  desc: String,     // one-line description for legend + result cards
  econ: Number,     // position on each axis, range approx -3 to +3
  soc: Number,
  nat: Number,
  climate: Number,
  housing: Number,
  health: Number,
  fuel: Number
}
```

**Full party list:**
FF, FG, SF, Lab, SocD, GP, PBP, Sol, Aon, II, 100R, WP, R2C, WUA, KIA, Rab, NP, DDI, PAW, I4C

### News ticker — 7 items
Rotating headlines about the April 2026 Irish fuel crisis. Array `TICKS[]`, each:
```js
{ cls: String, tag: String, text: String }
// cls: "tick-live" | "tick-pol" | "tick-eco"
```

---

## Theming

CSS custom properties on `:root` (light) and `[data-theme=dark]` (dark):
```
--bg, --bg2, --bg3           backgrounds
--text, --text2, --text3     text hierarchy
--border, --border2          border opacities
--accent, --accent-fg        primary action colour
--info-bg/text/border        blue info states
--success-bg/text/border     green success states
--warn-bg/text/border        amber warning states
--danger-bg/text/border      red danger states
```

Toggle: `themeToggle()` flips `S.dark`, sets `data-theme` on `<html>`, redraws compass.

---

## Key functions

| Function | Purpose |
|---|---|
| `render()` | Routes to the correct render function based on `S.phase` |
| `renderIntro()` | Intro screen with begin button and full party legend |
| `renderQuiz()` | Quiz screen: category tabs, question cards, live compass sidebar |
| `renderResults()` | Results: lean label, compass, axis breakdown, top 5, all 20 ranked |
| `setAns(id, v)` | Records answer, does live partial updates without full re-render |
| `computeAxes(answers)` | Returns `{ axis: averageScore }` for all answered axes |
| `computePos(axes)` | Returns `{ x, y }` for compass plot position |
| `matchParties(axes)` | Returns all 20 parties sorted by % match |
| `getLean(x, y)` | Returns `[leanLabel, subLabel]` string pair |
| `drawCompass(id, axes, w, h)` | Draws canvas compass with party dots + user dot |
| `startTicker()` | Starts rotating news ticker, clears previous interval |
| `applyTheme()` | Sets `data-theme` attr + updates toggle button text |
| `legendHTML()` | Returns HTML string for the party legend grid |

---

## Development notes

- **No build step.** Edit `index.html` directly. Open in browser to test.
- **To add a question:** Add to `QS[]` array with correct `cat`, `axis`, `dir`. Update party scores if needed.
- **To update party positions:** Edit the axis values in `PARTIES[]`. Range is roughly -3 (hard left) to +3 (hard right).
- **To add a news ticker item:** Add to `TICKS[]` with appropriate `cls`.
- **Canvas compass** redraws from scratch on every call — stateless.
- **Re-render vs partial update:** Full re-render happens on navigation. `setAns()` does targeted DOM updates to avoid losing slider focus mid-answer.
- **Ticker** uses `setInterval` stored in `tickTimer`. `startTicker()` clears any existing interval before starting — call it once after every `innerHTML` replacement.

---

## Potential improvements / next features

- Share results via URL (encode answers as query params)
- Embed OG meta tags for social sharing
- Add a "how parties voted" breakdown per question
- Weightings — let users mark which issues matter most to them
- Constituency-level data (which parties run near me)
- Irish language (Gaeilge) toggle
- Accessibility: ARIA labels on sliders, keyboard navigation
- Analytics (privacy-respecting, e.g. Fathom or Plausible)
- Extract to proper React/Next.js app if scope grows significantly

---

## Context: April 2026 fuel crisis

The "Fuel & Cost of Living" category and news ticker reference a real event:
- Protests began April 7, 2026 led by farmers and hauliers over rising fuel prices
- Triggered by Iran war / Strait of Hormuz closure → diesel +28%, petrol +25%
- Whitegate oil refinery, Cork, was blockaded; ~600 of 1,500 stations ran dry
- Government announced €755m relief package (10% fuel tax cut + carbon tax postponement)
- Sinn Féin tabled a no-confidence motion — coalition survived 92 votes to 78
- Michael Healy-Rae resigned as Minister of State during the crisis

This context should be preserved when updating questions or ticker copy.
