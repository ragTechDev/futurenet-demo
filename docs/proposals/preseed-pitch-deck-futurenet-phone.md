# Pre-seed pitch deck (markdown): FutureNet Phone — school-compliant smartphone for Singapore

> Format: copy/paste each slide into Google Slides / Keynote.

---

## Slide 1 — Title

**FutureNet Phone**

A school-compliant smartphone that keeps kids reachable without the internet distraction surface.

- Singapore-first wedge
- Bundled Android hardware + managed experience
- Parent-owned, SIM-unlocked

---

## Slide 2 — The problem

Smartphones are now a default for teens, but:

- Schools need **distraction-free classrooms**
- Parents need **reachability + safety**
- Current “parental controls” are often:
  - bypassable
  - high-effort to manage
  - misaligned with school policy

What we heard directly from parents:

- “Kids phone is not entertainment.” (P05)
- “I don’t know how she ends up figuring out DuckDuckGo and discover all these streamers.” (P04)
- “If there were a better, safer way to communicate, would definitely go for it.” (P01)

Result: conflict at home, enforcement burden at school, and risky early exposure to the open internet.

---

## Slide 3 — Research personas (who is pulling demand)

These are real parent archetypes from our Singapore discovery work:

- **The practical coordinator (P01, SG; kids 10, 17)**
  - already uses Apple Family / Parents Gateway
  - wants safer comms than WhatsApp for school + family logistics
- **The bypass-anxious enforcer (P04, SG; child 9)**
  - worried about loopholes and “lying”
  - wants bypass-resistant safety that holds even when not watching
- **The ads/UGC skeptic (P07, SG; kids 6, 9)**
  - deep distrust of ads, UGC, algorithms
  - wants graduated exposure and clear incident playbooks
- **The staged-controls parent (P06, SG; kids 6, 9)**
  - uses smartwatch + school iPads
  - worried about AI/cyberbullying; wants staged, age-appropriate controls

---

## Slide 3 — Why now (Singapore wedge)

Singapore has introduced **restrictions on smartphone use in secondary schools**.

This changes the market dynamics:

- Parents still need a phone for commuting logistics + safety.
- Schools want an **allowable, enforceable** solution.
- A “school-compliant phone” becomes a clear category.

---

## Slide 4 — Our solution

**FutureNet Phone** is a bundled Android smartphone that is:

- **SIM-unlocked** (parents choose any telco plan)
- **No browser** (v1)
- **No WhatsApp** (v1)
- **Tool-first launcher** (WisePhone-like experience)
- **School Mode** (scheduled, emergency-first)
- **Verifiable compliance** for schools

Value prop (parents):

- “My child is reachable and safe, without the internet distractions.”

Value prop (parents, in their words):

- “Kids phone is not entertainment.” (P05)

Value prop (schools):

- “Students can have a phone that is verifiably compliant with school rules.”

---

## Slide 5 — Product: what’s allowed (v1)

**Allowed apps (minimal, policy-driven)**

- Dialer + contacts
- (Optional) SMS restricted to guardian allowlist
- SOS experience
- Essential Singapore services (optional allowlist)
- Essential school apps (optional allowlist)

**Not allowed (v1)**

- Browsers
- Social media
- Games
- App store installs

---

## Slide 6 — School Mode (how it works)

Default behavior:

- **Scheduled School Mode** during school hours
- During School Mode, only:
  - emergency numbers (999/995)
  - guardians
  - SOS
  - (optional) SMS to guardians

Optional educator override (low ops):

- Teacher can issue a **time-limited unlock token** (5–10 minutes)
- Student enters token to temporarily relax restrictions for a class activity
- Automatically returns to School Mode when timer ends

---

## Slide 7 — Why we can enforce this (technical approach)

We use **Android Enterprise Device Owner** management + automated enrollment:

- **Device Owner** → stronger controls than a normal “parental control app”
- **Zero-touch enrollment** → factory reset does not escape management
- **Managed app allowlist** → prevents “install a browser / VPN / workaround”

This is software-led: no custom OS fork required.

---

## Slide 8 — Proof that this model works (Samsung Knox precedent)

Samsung’s Knox platform explicitly enables:

- turning commercial smartphones into **kids-friendly devices quickly and at scale**
- remote configuration of UX and preloaded apps
- preventing deletion of safety apps even after factory reset

**Case study (Samsung Knox): LG U+ + Kiwi Plus (South Korea)**

- Used **Knox Configure** to transform standard Samsung phones into a kids phone
- Initial version **sold out within 3 months**
- Lowered barriers to launch by eliminating manual device configuration at scale

Takeaway: The “managed phone” approach is a proven go-to-market pattern.

---

## Slide 9 — Market: wedge and expansion

Wedge market:

- Singapore secondary school families needing a compliant phone

Expansion:

- Upper primary transition segment (10–12)
- Additional geographies with similar school restrictions
- Additional product tiers (graduated access, approved app catalog, optional safe messaging)

---

## Slide 10 — Business model

We sell bundled hardware + subscription software.

- **One-time device sale**: S$299–S$399 (model-dependent)
- **Subscription**: S$8–S$15 / month
- **Annual plan**: S$80–S$150 / year

Why subscription:

- covers MDM licensing
- funds support + warranty operations
- supports ongoing policy hardening against bypass tactics

Note: device is **SIM-unlocked**, so we do not depend on telco revenue share.

---

## Slide 11 — Unit economics (cost structure)

Primary cost drivers:

- Hardware COGS (phone + case + screen protector + packaging)
- MDM licensing (per device/month)
- Cloud + communications (e.g., SMS for SOS/location snapshot)
- Logistics (shipping, returns)
- Support + warranty replacements

We expect:

- low/near-zero device margin early
- subscription margin improves with scale and support automation

---

## Slide 12 — Go-to-market (Singapore)

We start DTC, then use school partnerships for distribution lift.

- **DTC**: parent purchase + simple onboarding
- **School partnerships**:
  - provide a “compliance verifier” flow
  - publish a one-page policy sheet
  - pilot with 1–2 schools

We position as:

- “school-compliant phone” (not “kids phone”)
- “reachable without the internet distraction surface”

---

## Slide 13 — Pilot plan

Phase A: Dogfood (2 weeks)

- 5–10 devices
- validate enrollment, policy enforcement, reset behavior, School Mode reliability

Phase B: Closed pilot (6–8 weeks)

- 30–100 families
- 1–2 partner schools

Success metrics:

- >95% devices remain compliant
- >98% school-days School Mode activates as expected
- support load <0.3 tickets/device/week by week 3

---

## Slide 14 — Competition

Alternatives today:

- mainstream smartphones + Screen Time / Family Link
  - often bypassable; high parent effort; not school-verifiable
- “healthy smartphone” products (US/UK)
  - limited availability in Singapore; not aligned to SG school policy wedge
- trackers / watches
  - don’t solve teen needs for a real phone (calls, logistics)

Differentiator:

- Singapore-first **school compliance + verification** + strong enforcement via Device Owner

---

## Slide 15 — Defensibility (moat)

Near-term moat:

- distribution wedge: school compliance + verifier + templates
- operational moat: provisioning + policy hardening + support playbooks
- data moat: anonymized compliance + exception patterns to improve School Mode design

Long-term moat:

- “graduated access” system across ages
- approved-app ecosystem governance and school templates

---

## Slide 16 — Risks and mitigations

- **Policy variability across schools**
  - mitigate with school templates + verifier
- **Bypass attempts** (VPN, hidden browsers, resets)
  - mitigate with Device Owner + allowlist + re-enrollment + hardening
- **Support load**
  - mitigate by limiting device models and keeping v1 app list minimal

---

## Slide 17 — Team

We are a Singapore-based team of software engineers.

- strong on secure systems, product engineering, and operational tooling
- leveraging proven enterprise device management primitives rather than building hardware/OS from scratch

---

## Slide 18 — The ask (pre-seed)

We are raising pre-seed to:

- build v1 launcher + parent portal + compliance verifier
- stand up MDM operations + zero-touch supply chain
- run a 30–100 family pilot with 1–2 schools

What we’ll validate:

- willingness to pay (hardware + subscription)
- school endorsement dynamics
- compliance + support economics

---

## Slide 19 — Appendix: key decision points

- MDM vendor selection (Intune vs Workspace ONE vs Knox Suite)
- Device model selection and reseller for zero-touch
- SMS policy in School Mode (calls-only vs restricted SMS)
- Location policy (SOS-only vs opt-in tracking)
- Educator override scope (token-only in v1)
