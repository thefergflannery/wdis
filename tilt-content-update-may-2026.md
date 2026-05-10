# TILT — Content Update Prompt (May 2026)
## New categories, question audit, ticker refresh, party axis updates

> **Before running:** Reference your source files — `@js/data.js @js/app.js @CLAUDE.md`
> This prompt covers **content only** — no UI changes, no architecture changes.

---

## Context

This update adds 3 new question categories grounded in live Irish political events (May 2026), removes or rewrites questions that are outdated or redundant, refreshes the news ticker, and updates party axis scores to reflect current positions.

Do not change: file structure, compass algorithm, scoring logic, UI, or theming.

---

## Part 1 — Question audit: remove or rewrite these

Review each of the following. If a question is redundant with a new one below, remove it. If it references an event that has now resolved (e.g. a referendum that passed, a bill that is now law), rewrite it to reflect the current state.

### Remove if present — resolved/outdated
- Any question referencing the Abortion/Repeal referendum as a pending issue (it passed in 2018 — if a question on reproductive rights exists, reframe it around current access/provision debates, e.g. "Abortion services should be available in all public hospitals")
- Any question referencing water charges as a live issue (resolved — Irish Water now funded from general taxation)
- Any question referencing the 8th Amendment as a current debate (resolved)
- Any question referencing Brexit as a future event (it is a settled fact — reframe to "Ireland should prioritise rebuilding trade relationships with the UK post-Brexit" if Brexit context is needed)
- Any question about "should Ireland join the Euro" or "should Ireland remain in the EU" — these are not live debates for any significant Irish party

### Rewrite if present — stale framing
- Questions referencing "the housing crisis" generically → make specific: reference current policy (e.g. Help to Buy, Land Value Tax, zoning reform)
- Questions referencing "the Carbon Tax" without context → update to reference the April 2026 postponement as context: "The carbon tax increase, which was postponed during the 2026 fuel crisis, should be reinstated as planned"
- Any question about "Michael Healy-Rae" by name → remove or generalise (he resigned as Minister of State during the fuel crisis — referencing him specifically dates the content)

---

## Part 2 — Three new categories to add

Add the following three categories to `CATS[]` and their questions to `QS[]`. Add the new axes to the party objects in `PARTIES[]`. Integrate them into the quiz rotation alongside existing categories.

---

### Category A: Immigration & Asylum

**New axis name:** `immig` (range: -3 = open/rights-based to +3 = restrictive/enforcement-based)

**Category label:** `"Immigration & Asylum"`

**Questions — add to QS[]:**

```js
{
  id: 101,
  cat: "Immigration & Asylum",
  text: "Ireland should process asylum applications within a strict six-month time limit, even if this reduces the time available for appeals.",
  explain: "The <strong>International Protection Bill 2026</strong> introduced a six-month processing target. Supporters say faster decisions are fairer for applicants and reduce cost to the state. Critics say rushed decisions lead to poor outcomes and judicial reviews.",
  axis: "immig",
  dir: 1
},
{
  id: 102,
  cat: "Immigration & Asylum",
  text: "Refugees granted protection in Ireland should be allowed to bring immediate family members here within one year.",
  explain: "The 2026 Bill introduced a <strong>two-year wait</strong> before family reunification, plus a self-sufficiency test. Human rights groups argue this keeps families separated. The government says it manages pressure on public services.",
  axis: "immig",
  dir: -1
},
{
  id: 103,
  cat: "Immigration & Asylum",
  text: "Asylum seekers should have the right to work while their applications are being processed.",
  explain: "Ireland allows asylum seekers to work after <strong>six months</strong> — later than many EU states. Left-wing parties support immediate work rights. Others argue it creates incentives for unfounded claims.",
  axis: "immig",
  dir: -1
},
{
  id: 104,
  cat: "Immigration & Asylum",
  text: "Ireland should accept more asylum seekers than it currently does.",
  explain: "Ireland received around <strong>13,000 protection applications</strong> in 2025, down from 2024. Parties differ sharply: PBP and the Greens support a more open approach; Independent Ireland and Aontú favour strict limits; mainstream parties occupy the centre.",
  axis: "immig",
  dir: -1
},
{
  id: 105,
  cat: "Immigration & Asylum",
  text: "Communities should be formally consulted before asylum seeker accommodation centres are opened in their area.",
  explain: "Lack of community engagement has been cited as a driver of protests at proposed accommodation sites. Sinn Féin and Independent Ireland both proposed community consultation requirements; the government resisted making it mandatory.",
  axis: "immig",
  dir: 1
}
```

**Party axis scores for `immig` — add to each party in PARTIES[]:**

| Party | `immig` score | Rationale |
|---|---|---|
| FF | 1.0 | Backed 2026 Bill, family reunification restrictions, charter deportation flights |
| FG | 1.5 | 90-day removal targets, restricted movement for applicants, skills-based framing |
| SF | 0.5 | Toughened stance post-2024 locals, but human rights baseline retained |
| Lab | -1.0 | Opposed family reunification restrictions, backed right to work |
| SocD | -1.0 | Rights-based approach, opposed key 2026 Bill provisions |
| GP | -1.5 | Most open position among Dáil parties, opposed detention powers |
| PBP | -2.5 | Fully open borders position, opposed all enforcement measures |
| Sol | -2.5 | Same as PBP |
| Aon | 2.0 | Stronger border control, more deportations, community compensation |
| II | 2.5 | "Secure Ireland's borders", anti-IPAS, strongest restrictionist position |
| 100R | 2.5 | Far-right, anti-immigration as core platform |
| WP | -1.5 | Internationalist, rights-based |
| R2C | 2.0 | Anti-immigration framing |
| WUA | 1.5 | Restrictionist independent grouping |
| KIA | 1.5 | Anti-IPAS framing |
| Rab | 0.0 | No clear position |
| NP | 1.0 | Moderate restrictionist |
| DDI | 2.0 | Anti-immigration |
| PAW | -0.5 | No strong position |
| I4C | -2.0 | Open, rights-based |

---

### Category B: Technology, AI & Digital Rights

**New axis name:** `tech` (range: -3 = pro-regulation/sceptical of tech power to +3 = pro-industry/light-touch regulation)

**Category label:** `"Tech & Digital Rights"`

**Questions — add to QS[]:**

```js
{
  id: 111,
  cat: "Tech & Digital Rights",
  text: "Social media platforms should be banned for children under 16 in Ireland.",
  explain: "Ireland's Minister for Communications confirmed in May 2026 that Ireland will <strong>act unilaterally</strong> if no EU-level agreement is reached. Australia introduced such a ban in 2025. Critics argue enforcement is near-impossible and harms marginalised young people.",
  axis: "tech",
  dir: -1
},
{
  id: 112,
  cat: "Tech & Digital Rights",
  text: "Ireland is too economically dependent on US technology multinationals.",
  explain: "Tech companies account for a <strong>disproportionate share of Irish corporation tax</strong>. The €14bn Apple back-tax windfall highlighted this dependency. Fine Gael is broadly pro-tech; left-wing parties argue the relationship gives multinationals too much political leverage.",
  axis: "tech",
  dir: -1
},
{
  id: 113,
  cat: "Tech & Digital Rights",
  text: "New data centres should only be approved in Ireland if they generate at least 80% of their energy from renewables.",
  explain: "The <strong>Large Energy User Action Plan (LEAP)</strong>, approved January 2026, introduced exactly this requirement with a six-year glide path. Data centres now account for 22% of Ireland's electricity use. Labour, Soc Dems and PBP had long called for a moratorium.",
  axis: "tech",
  dir: -1
},
{
  id: 114,
  cat: "Tech & Digital Rights",
  text: "Ireland should go beyond EU minimum standards in regulating artificial intelligence.",
  explain: "The EU AI Act is now in force. Ireland's Joint Oireachtas Committee on AI recommended treating EU rules as a <strong>minimum baseline</strong>, not a ceiling. Ireland holds the EU Presidency in H2 2026, with an AI Summit planned for October.",
  axis: "tech",
  dir: -1
},
{
  id: 115,
  cat: "Tech & Digital Rights",
  text: "Technology companies based in Ireland pay a fair share of tax.",
  explain: "The <strong>15% global minimum corporate tax</strong> came into effect for large companies in 2024. The European Court of Justice ruled Ireland must collect €14bn in back taxes from Apple. Fine Gael and FF are broadly satisfied; left-wing parties argue the rate is still too low.",
  axis: "tech",
  dir: 1
}
```

**Party axis scores for `tech` — add to each party in PARTIES[]:**

| Party | `tech` score | Rationale |
|---|---|---|
| FF | 1.0 | Pro-FDI, backed LEAP, supportive of data centres with conditions |
| FG | 2.0 | Strongly pro-tech industry, opposes over-regulation, defended Apple tax position |
| SF | -0.5 | Supports windfall taxes on tech, sceptical of dependency |
| Lab | -1.5 | Called for data centre moratorium, supports stronger regulation |
| SocD | -1.0 | Critical of tech dependency, backs stronger AI regulation |
| GP | -1.5 | Environmental concerns about data centres, pro-regulation |
| PBP | -2.5 | Anti-multinational, supports full moratorium on data centres |
| Sol | -2.5 | Same as PBP |
| Aon | 0.5 | No strong tech position; generally anti-regulation framing |
| II | 1.0 | Pro-enterprise, anti-regulation |
| 100R | 0.5 | Anti-EU regulation framing |
| WP | -2.0 | Anti-multinational, socialist framing |
| R2C | -0.5 | Vague |
| WUA | 0.0 | No clear position |
| KIA | 0.0 | No clear position |
| Rab | 0.0 | No clear position |
| NP | 1.0 | Pro-enterprise |
| DDI | 0.5 | No strong position |
| PAW | -1.0 | Pro-regulation framing |
| I4C | -2.0 | Anti-multinational |

---

### Category C: Data Centres & Energy Sovereignty

> **Note:** This category overlaps with the existing Climate and Fuel categories. Do NOT duplicate questions. The focus here is on **energy sovereignty, grid policy, and the state's relationship with large energy users** — not climate targets (covered) or fuel prices (covered).

**Use existing axis:** `climate` with secondary weighting on `econ`

**Category label:** `"Energy & Sovereignty"`

**Questions — add to QS[]:**

```js
{
  id: 121,
  cat: "Energy & Sovereignty",
  text: "Ireland should pause new data centre approvals until the electricity grid can support them without risk to households.",
  explain: "Data centres used <strong>22% of Ireland's electricity</strong> in 2024 — forecast to reach 31% by 2034. A moratorium was in place 2021–2025. The LEAP plan lifted it with conditions. Labour, Soc Dems and PBP had all backed a pause.",
  axis: "climate",
  dir: -1
},
{
  id: 122,
  cat: "Energy & Sovereignty",
  text: "Ireland should invest heavily in offshore wind energy to reduce dependence on imported fossil fuels.",
  explain: "Ireland has among the <strong>best offshore wind resources in Europe</strong>. The April 2026 fuel crisis, triggered by Strait of Hormuz disruption, intensified the debate about energy security. All parties broadly support offshore wind — the divide is on pace and public vs private ownership.",
  axis: "climate",
  dir: -1
},
{
  id: 123,
  cat: "Energy & Sovereignty",
  text: "Strategic energy infrastructure like electricity generation should be majority state-owned.",
  explain: "Ireland's electricity system is a mix of state (ESB) and private operators. Left-wing parties argue for renationalisation. Mainstream parties and right-leaning parties favour a mixed model that attracts private investment.",
  axis: "econ",
  dir: -1
}
```

**No new axis needed for this category — uses existing `climate` and `econ` axes. Update party scores on `climate` if needed to reflect their position on data centre energy policy (see LEAP and moratorium positions above).**

---

## Part 3 — News ticker refresh

Replace ALL existing ticker items in `TICKS[]` with the following. These reflect the Irish political situation as of May 2026. Use the same format — `cls`, `tag`, `text`.

```js
const TICKS = [
  {
    cls: "tick-live",
    tag: "LIVE",
    text: "Bye-elections in Dublin Central and Galway West set for 22 May — first electoral test since the April fuel crisis"
  },
  {
    cls: "tick-pol",
    tag: "POLL",
    text: "Sinn Féin leads at 22% — Independent Ireland surges to 9% after fuel protests, up 3pts"
  },
  {
    cls: "tick-pol",
    tag: "POLL",
    text: "Fianna Fáil drops to 17% as Taoiseach Martin's approval rating falls six points post-fuel crisis"
  },
  {
    cls: "tick-eco",
    tag: "FUEL",
    text: "Government announces second fuel relief package — €755m in tax cuts and carbon levy postponement"
  },
  {
    cls: "tick-pol",
    tag: "ASYLUM",
    text: "International Protection Bill 2026 signed into law — most significant reform of Irish asylum system in State history"
  },
  {
    cls: "tick-pol",
    tag: "TECH",
    text: "Minister O'Donovan: Ireland will ban social media for under-16s unilaterally if no EU deal reached"
  },
  {
    cls: "tick-eco",
    tag: "ENERGY",
    text: "Data centres now account for 22% of Ireland's electricity — forecast to hit 31% by 2034"
  },
  {
    cls: "tick-pol",
    tag: "EU",
    text: "Ireland takes EU Presidency in H2 2026 — AI governance and children's online safety are flagship priorities"
  },
  {
    cls: "tick-pol",
    tag: "DÁIL",
    text: "Coalition survives Sinn Féin no-confidence motion 92 votes to 78 — government shaken but intact"
  },
  {
    cls: "tick-eco",
    tag: "HOUSING",
    text: "Help to Buy scheme extended — opposition parties split on whether it inflates prices or helps buyers"
  }
];
```

---

## Part 4 — Testing checklist

Before finishing, verify:

- [ ] All three new categories appear in the category list and tabs
- [ ] New questions are reachable in Full and Mid quiz modes (they should be automatically included)
- [ ] Quick mode — check that exactly 1 question per new category is selected (first question in each)
- [ ] New party axis fields (`immig`, `tech`) are present on all 20 party objects — no party should be missing these fields
- [ ] Removed/rewritten questions no longer appear — search for keywords like "water charges", "8th Amendment", "Brexit vote", "euro" to confirm
- [ ] Ticker shows new items — scroll through all 10 to confirm rotation
- [ ] Compass still renders correctly — new axes do not affect X/Y compass position (they are not mapped to compass axes unless you explicitly add them to `computePos()`)
- [ ] Results page renders correctly after completing a quiz that includes the new categories
- [ ] No console errors

---

## Part 5 — Notes on compass axis mapping (important)

The new `immig` and `tech` axes currently **do not feed into the compass X/Y position** — they only affect party match scoring. This is intentional for now. The compass X axis is derived from `econ`, `housing`, `health`. The Y axis is derived from `soc`, `nat`, `fuel`.

If you want to incorporate `immig` into the compass in future, it would logically sit on the Y (social/authoritarian) axis alongside `soc` and `nat`. That is a separate decision — **do not change `computePos()` in this update.**
