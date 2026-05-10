# TILT — Product Requirements Document

**Product:** TILT (Where Do I Stand?)
**URL:** [wdisf-ferg-flannerys-projects.vercel.app](https://wdisf-ferg-flannerys-projects.vercel.app/)
**Version:** v1.3 → next
**Last updated:** 8 May 2026

---

## 1. Product overview

TILT is a free, non-partisan Irish political compass quiz. Users answer questions across policy categories and receive a compass position and ranked match against 20 Irish political parties. No signup, no backend, no data collected beyond anonymous PostHog analytics.

### Stack
- Vanilla HTML/CSS/JS — no framework, no build step
- Multi-file: `index.html` shell + `js/` for data, scoring, compass, rendering, and app logic
- Deployed to Vercel as a static site
- PostHog for anonymous analytics

### Current state (v1.3)
| Feature | Status |
|---|---|
| 72 questions across 18 categories | ✅ Live |
| 20 parties mapped across 19 policy axes | ✅ Live |
| Full quiz mode (all 72 questions) | ✅ Live |
| Quick quiz mode (18 key questions) | ✅ Live |
| Category shuffle (randomised question order) | ✅ Live |
| Live political compass with party dots | ✅ Live |
| 5-button answer UI (Strongly Disagree → Strongly Agree) | ✅ Live |
| Party match algorithm — ranked by axis distance | ✅ Live |
| Results: lean label, compass, top 5 cards, all 20 ranked | ✅ Live |
| Answers review section on results page | ✅ Live |
| Share results (copy/native share) | ✅ Live |
| Show/hide minor parties toggle | ✅ Live |
| Desktop 2-column quiz layout (sidebar + questions) | ✅ Live |
| Mobile layout with FAB + bottom sheet for compass | ✅ Live |
| Dark/light theme | ✅ Live |
| Live news ticker (real Irish political headlines via API) | ✅ Live |
| Persistent nav with progress pill | ✅ Live |
| PostHog analytics | ✅ Live |
| Changelog / What's New page | ✅ Live |

---

## 2. Proposed updates

### P0 — Critical / bug fixes

#### 2.1 Neutral answer — "Next" button unlock
**Problem:** When a user selects Neutral on all questions in a category, the Next button sometimes does not activate.
**Root cause:** `catDone` check uses truthiness — needs to verify it correctly handles `0` (neutral value) vs `undefined` (unanswered).
**Fix:** Audit `catDone` logic in `app.js`. Ensure any explicit button press (including Neutral) is recorded and activates the Next button regardless of value.

---

### P1 — Core UX improvements

#### 2.2 URL-encoded results sharing
**Problem:** The current share feature copies a text summary. There is no permalink — users can't send someone a link to their exact result.
**Requirement:**
- Encode answers as a compressed query param on the results URL (e.g. `?r=<base64>`)
- On page load, if `?r=` param is present, decode and reconstruct the result view directly (skip quiz)
- Share button should copy/share the full URL with the param
- Show a "Viewing shared result" banner when viewing a decoded result
**Non-requirement:** No server-side storage — encode/decode client-side only.

#### 2.3 Persistent nav bar
**Problem:** There is no way to navigate back to the intro/homepage from inside the quiz or results without refreshing.
**Requirement:**
- Persistent nav visible across all three phases (intro, quiz, results)
- "TILT" wordmark/logo links back to intro
- On quiz phase, nav shows the current progress pill
- On mobile, nav remains compact and does not obscure question content

#### 2.4 Party manifest links
**Problem:** Users cannot easily learn more about a matched party.
**Requirement:**
- Each party in `PARTIES[]` already has a `url` field — use it
- In results top-5 cards: party name/abbr links to their website (opens new tab)
- In results all-20-ranked list: same linking behaviour
- In intro party legend: same linking behaviour
- Parties with empty `url` (e.g. 100R, R2C, WUA, KIA, NP, DDI) render as non-linked text

---

### P2 — Feature additions

#### 2.5 Issue weighting
**Problem:** Every policy category is weighted equally. A user who cares deeply about housing and not at all about EU policy gets the same match as one who cares the opposite.
**Requirement:**
- After the quiz completes (before results are shown), show a brief weighting step
- User rates each category: "Not important to me", "Important", "Very important"
- Default: all equal weight
- Party match algorithm applies multipliers by weight
- Compass position also adjusts based on weighted axes
- Weighting step can be skipped ("Skip — weight all equally")

#### 2.6 "How parties voted" per question
**Problem:** Users answer questions but have no context for how each party has actually voted or positioned on the issue.
**Requirement:**
- On the results page, in the Answers Review section, add a "How parties stood on this" expandable row per question
- Show top 3 most aligned and top 3 most opposed parties for each question
- No per-question sourcing required at launch — derive from existing axis/dir data
- Optional future iteration: add a source URL field per question

#### 2.7 Constituency filter
**Problem:** Minor parties and independents only run in certain constituencies. A user in Dublin 4 doesn't need to know about Kerry Independent Alliance.
**Requirement:**
- Optional filter on results page: "Show only parties running in my area"
- User selects their constituency from a dropdown (42 Dáil constituencies)
- Results list filters to parties that ran candidates in the 2024 election in that constituency
- Compass still shows all party dots but non-local ones are dimmed
- Constituency data stored as a lookup in `data.js`
- Default: show all (filter off)

#### 2.8 Irish language (Gaeilge) toggle
**Requirement:**
- Toggle in nav: "Gaeilge / English"
- All UI strings translated — category names, question text, button labels, results labels, lean labels
- Party names remain in original form (not translated)
- Translations stored as a second lookup object in `data.js` alongside English strings
- Default: English

---

### P3 — Content additions

#### 2.9 New question categories
The following categories are planned additions. Each requires: 3–5 new questions, axis mapping, and party position data updates across all 20 parties.

| Category | Notes |
|---|---|
| Housing Market | Distinct from Housing policy — renting, ownership, landlord regulation |
| Animals & Welfare | Factory farming, pet legislation, hunting, animal cruelty |
| Banking & Finance | Credit unions, mortgage regulation, financial services |
| Drugs & Alcohol | Decriminalisation, nightlife, minimum unit pricing |
| Data & Privacy | GDPR enforcement, surveillance, tech regulation |
| Freedom of Speech | Hate speech law, media regulation, online speech |
| Mental Health | Funding, beds, parity with physical health |
| Transport | Public transport investment, road vs rail, cycling |
| Education | Free fees, secondary curriculum, special needs |

**Note:** Categories should be added incrementally — not all at once. Target: 3 new categories per update cycle.

#### 2.10 Update ticker content
**Requirement:**
- Replace/supplement fuel crisis context with more recent Irish political events as they occur
- Ticker items should feel current — stale headlines reduce credibility
- Consider a fallback set of "evergreen" political facts if the news API is unavailable

---

### P4 — Infrastructure / quality

#### 2.11 Accessibility audit
**Requirement:**
- ARIA labels on all interactive elements (buttons, compass canvas, tabs)
- Keyboard navigation through quiz questions (Tab / Enter / arrow keys on answer buttons)
- Focus management on category change (focus moves to first answer button)
- Colour contrast check on all text/background combinations in both themes
- Screen reader testing for results page

#### 2.12 OG / social sharing image
**Problem:** Current OG image is a static JPG. It doesn't reflect a user's actual result.
**Requirement (optional):** Generate a dynamic OG image from result state using canvas-to-dataURL, surfaced as a downloadable PNG from the share menu.

---

## 3. Out of scope (this cycle)

- Backend / database (all state stays client-side)
- User accounts or saved history
- Comparison mode (compare two users' results)
- Paid tier / monetisation
- Extract to React/Next.js

---

## 4. Questions for next session

Before implementation begins, agree on:

1. **Weighting (2.5):** Do we want this in a separate step or inline at the end of the quiz?
2. **URL sharing (2.2):** Should shared results show a re-take prompt, or be view-only?
3. **Category order (2.9):** Which 3 new categories should land first?
4. **Gaeilge (2.8):** Is this a priority or nice-to-have for the next cycle?
