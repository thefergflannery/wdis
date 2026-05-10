# Claude Code Prompt — Add Mid Quiz Mode (36 Questions)

> **Before running:** Add your file references at the top of the prompt, e.g.
> `@index.html @js/app.js @js/data.js` — adjust to match your actual file structure.

---

Read CLAUDE.md and the current source files in full before making any changes.

## Task: Add a "Mid Quiz" mode (36 questions) alongside the existing Quick (18Q) and Full (72Q) modes.

---

### Context

The app currently has two quiz modes:
- **Quick** — 1 question per category (18 total)
- **Full** — all questions per category (72 total)

We need a third mode:
- **Mid** — 2 questions per category (36 total)

---

### Implementation

#### 1. Add the mode constant

In the quiz mode constants (wherever QUICK_COUNT or similar is defined), add:

```js
const QUIZ_MODES = {
  quick: { label: "Quick", count: 1,    desc: "18 questions · ~5 min" },
  mid:   { label: "Mid",   count: 2,    desc: "36 questions · ~10 min" },
  full:  { label: "Full",  count: null, desc: "72 questions · ~20 min" }
};
```

If the current code uses a different pattern (e.g. a flag or inline filter), match that pattern — don't introduce new architecture.

#### 2. Question selection for Mid mode

When building the question set for Mid mode:
- Select exactly 2 questions per category
- Prioritise variety across axes — if a category has questions on multiple axes, pick one from each different axis where possible
- Fall back to the first 2 questions in the category if axis variety isn't available
- The selection must be deterministic (same 2 questions every time, not random)

#### 3. Update the mode selector UI

On the intro screen, the mode selector (currently showing Quick / Full) should show three options: **Quick / Mid / Full**.

- Match the existing visual style exactly — same button/tab/card component pattern as Quick and Full
- Mid should sit between Quick and Full in the UI
- If the selector uses a highlighted "recommended" state, apply it to Mid (it's the sweet spot)
- Update any descriptive copy ("18 questions" / "72 questions") to include Mid's "36 questions · ~10 min"

#### 4. State

Add `"mid"` as a valid value for the mode field in state (wherever `S.mode` or equivalent is stored). Default can remain whatever it currently is.

#### 5. Progress tracking

Mid mode should use the same progress pill/bar logic as the other modes — ensure the total question count used for progress calculation reflects 36, not 18 or 72.

#### 6. Results page

No changes needed to the results page — it works from computed axes regardless of question count.

#### 7. PostHog analytics

If `quiz_start` or `quiz_complete` events are being tracked with a `mode` property, ensure `"mid"` is passed correctly.

#### 8. Testing checklist (do not skip)

Before finishing:
- [ ] Mid mode appears correctly between Quick and Full in the UI
- [ ] Exactly 36 questions are presented (2 per category × 18 categories)
- [ ] No category is skipped or has only 1 question unless the category itself has fewer than 2 questions
- [ ] Progress bar reaches 100% at question 36
- [ ] Next button activates correctly when all questions in a category are answered (including Neutral/0 value — see bug fix below)
- [ ] Results render correctly after completing Mid mode
- [ ] Quick and Full modes are unaffected
- [ ] Dark/light theme toggle works throughout Mid mode
- [ ] Mobile layout is not broken

---

### Bug fix — include while you're in here (PRD 2.1)

The `catDone` check uses truthiness, which means a Neutral answer (value `0`) is treated as unanswered. Fix this alongside the Mid mode work:

```js
// WRONG — treats 0 as falsy (unanswered)
const catDone = catQuestions.every(q => S.answers[q.id]);

// CORRECT — checks for explicit value, including 0 (neutral)
const catDone = catQuestions.every(q => S.answers[q.id] !== undefined);
```

Apply this fix wherever `catDone` or equivalent is computed. This affects all three quiz modes.

---

### Do not change

- The existing file structure (single-file or js/ split — leave as-is)
- The compass algorithm, party data, or axis weights
- The Quick or Full mode behaviour
- The visual design system or CSS custom properties
