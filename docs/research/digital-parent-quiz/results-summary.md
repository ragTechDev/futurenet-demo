# Results summary

## Data window (earliest → latest submission)

This report summarizes results captured in `app/digital-parent-quiz/submissions.raw.jsonl`.

- **Earliest submission (UTC)**: `2025-12-31T13:41:53.453Z`
- **Latest submission (UTC)**: `2026-01-06T02:42:24.933Z`
- **Total submissions / respondents**: **31**

Notes:

- Each line represents one submission.
- Quiz answers are complete (12 questions) in the current dataset.
- Many demographic fields are intentionally sparse due to opt-in design.

## Participant composition

### Respondent type

- **parent**: 13 (41.9%)
- **considering**: 8 (25.8%)
- **na**: 10 (32.3%)

Interpretation:

- The dataset is not “parent-only”; it includes a substantial **non-parent / unspecified** segment (`na` + `considering` = 58.1%).
- This matters because “digital parenting” decisions may be driven by different constraints for each segment (e.g., lived experience vs. expectations vs. hypothetical attitudes).

### Research opt-in

- **opted_in**: 10 (32.3%)
- **not_opted_in**: 21 (67.7%)

Implication:

- Most respondents did **not** opt into research, which means demographic analyses (age, gender, kids ages) have limited power and may over-represent a specific “high-intent” subgroup.

### Persona distribution (top persona)

- **walkman**: 15 (48.4%)
- **bb-bold**: 11 (35.5%)
- **bb-curve**: 3 (9.7%)
- **razr**: 1 (3.2%)
- **palm-treo**: 1 (3.2%)

Interpretation:

- The distribution is concentrated in **walkman** and **bb-bold**.
- This could reflect:
  - actual population traits,
  - acquisition-channel bias,
  - or that some answer options are disproportionately attractive (see the per-question section).

### Demographics (limited by opt-in)

**Gender**:

- **unknown**: 22 (71.0%)
- **m**: 6 (19.4%)
- **w**: 3 (9.7%)

**Age (derived from `birth_year`, bucketed)**:

- **unknown**: 21 (67.7%)
- **25–34**: 6 (19.4%)
- **35–44**: 3 (9.7%)
- **18–24**: 1 (3.2%)

**Kids ages (parents only; present when provided)**:

- **0–2**: 3
- **3–5**: 3

Interpretation:

- Among parents who provided kids ages, the sample is currently concentrated in **early childhood (0–5)**.
- This will bias “control strategies” toward earlier-development contexts (first phone decisions, first rules, early YouTube exposure, etc.).

## Quiz-answer patterns (by respondent type)

Below is a full pass over **all 12 questions**, broken down by respondent type.

Legend:

- **parent** (n=13)
- **considering** (n=8)
- **na** (n=10)

### Q1 (Morning prep)

- **considering**: q1b 62.5%, q1a 37.5%
- **na**: q1b 80.0%, q1a 20.0%
- **parent**: q1a 53.8%, q1b 46.2%

Insight:

- Non-parents lean toward **communication readiness** (spare phone), while parents are closer to split and slightly lean toward **location certainty** (AirTag).
- Opportunity: understand what “safety” means by segment (communication vs location vs reassurance).

### Q2 (Commute pressure)

- **considering**: q2b 100.0%
- **na**: q2b 80.0%, q2a 20.0%
- **parent**: q2b 92.3%, q2a 7.7%

Insight:

- Very strong convergence on **not using the phone as the first calming tool**.
- Risk: potential social desirability; consider a follow-up that asks about last real incident.

### Q3 (School milestone)

- **considering**: split (q3a 50.0% / q3b 50.0%)
- **na**: q3a 70.0%, q3b 30.0%
- **parent**: q3a 61.5%, q3b 38.5%

Insight:

- Across the dataset, there is a moderate lean toward **device-free / attention-first schooling**.
- Opportunity: this can be a “values anchor” question to segment families by digital philosophy.

### Q4 (Phone policy)

- **considering**: q4b 62.5%, q4a 37.5%
- **na**: q4a 80.0%, q4b 20.0%
- **parent**: q4a 53.8%, q4b 46.2%

Insight:

- Parents are nearly split; `na` strongly prefers the **approved kid phone**.
- Opportunity: probe whether “smartphone + parental controls” is seen as *too complex*, *too porous*, or *too identity-laden*.

### Q5 (Parent group news)

- **considering**: q5b 100.0%
- **na**: q5b 70.0%, q5a 30.0%
- **parent**: q5b 76.9%, q5a 23.1%

Insight:

- Strong preference for **conversation-first**.
- Product direction: tools that help parents have “the talk” may be more acceptable than surveillance-first tooling.

### Q6 (Online safety conversations)

- **considering**: q6a 87.5%, q6b 12.5%
- **na**: q6a 90.0%, q6b 10.0%
- **parent**: q6a 76.9%, q6b 23.1%

Insight:

- Most respondents endorse “real talk” (q6a), but parents show the highest “not sure what to say” share.
- Opportunity: build supports for *parents who want to talk but feel underprepared* (scripts, FAQs, escalation paths).

### Q7 (Biggest concern)

- **considering**: q7b 75.0%, q7a 25.0%
- **na**: q7b 60.0%, q7a 40.0%
- **parent**: q7b 69.2%, q7a 30.8%

Insight:

- “Social + communication safety” (q7b) is the dominant concern across all segments.
- Research opportunity: translate this into concrete problem areas (group chats, conflict, scams, peer pressure) and define what “support” means.

### Q8 (Controls confidence)

- **considering**: q8a 100.0%
- **na**: q8b 60.0%, q8a 40.0%
- **parent**: q8a 61.5%, q8b 38.5%

Insight:

- “Considering” appears aspirational/confident; parents show meaningful uncertainty; `na` shows the highest uncertainty.
- Opportunity: treat “confidence” as a key segmentation axis for interventions.

### Q9 (YouTube ads)

- **considering**: split (q9a 50.0% / q9b 50.0%)
- **na**: q9b 60.0%, q9a 40.0%
- **parent**: q9b 84.6%, q9a 15.4%

Insight:

- Parents strongly prefer **routine/setup changes** over paying.
- Opportunity: emphasize non-paid mechanisms and coaching, not upsell-first solutions.

### Q10 (Friends’ game request)

- **considering**: q10a 100.0%
- **na**: split (q10a 50.0% / q10b 50.0%)
- **parent**: q10b 61.5%, q10a 38.5%

Insight:

- Parents lean toward “pause + belonging alternative”, while “considering” is uniformly permissive-with-structure.
- Opportunity: identify what constraints drive parents to pause (time, energy, uncertainty, trust, household conflict).

### Q11 (Last-minute meeting)

- **considering**: q11b 75.0%, q11a 25.0%
- **na**: q11b 60.0%, q11a 40.0%
- **parent**: q11b 61.5%, q11a 38.5%

Insight:

- Most respondents choose **bounded screen time** over cancelling work.
- Opportunity: solutions should assume real constraints (work, stress, limited bandwidth) and support “good enough” guardrails.

### Q12 (Your direction)

- **considering**: q12b 100.0%
- **na**: q12b 80.0%, q12a 20.0%
- **parent**: q12b 69.2%, q12a 30.8%

Insight:

- Strong overall preference for **autonomy with coaching**.
- Opportunity: define “coaching primitives” (agreements, check-ins, reflective prompts, repair scripts, gradual privilege unlocks).

## What this suggests about opportunities

### Opportunity 1: “Coaching-first” support is highly aligned with stated preferences

Multiple questions (Q5, Q6, Q12) point toward a desire for:

- calmer conversations,
- explanation and reasoning,
- iterative learning over one-off enforcement.

Practical research next step:

- Prototype and test **conversation scaffolds**: prompts, scripts, reflection check-ins, and parent-child agreement templates.

### Opportunity 2: Reduce reliance on paid interventions

Parents strongly prefer non-monetary interventions (Q9).

Practical research next step:

- Explore “default-safe” UX patterns and routine-based supports:
  - session boundaries,
  - device-free transitions,
  - friction for impulsive consumption,
  - co-watching nudges.

### Opportunity 3: Segment-specific messaging and product framing

The “considering” group shows repeated “ideal world” answers (Q8a 100%, Q10a 100%, Q12b 100%).

Practical research next step:

- Treat respondent types as distinct segments:
  - **parents**: grounded constraints, trade-offs, fatigue, time pressure
  - **considering**: values-driven intentions, expectations, identity
  - **na**: needs clarification; may hide a meaningful privacy/uncertainty segment

## Pain points / limitations for the research team

### Pain point 1: Opt-in rate limits demographic insight

- 67.7% did not opt in.
- This means any demographic correlations (age, gender, kids ages) are low-confidence.

Mitigation ideas:

- Reframe opt-in value proposition (e.g., “help shape safer defaults” / “we’ll share research back”).
- Consider a “light opt-in” tier (e.g., only age band + parent status) before the full set.

### Pain point 2: `respondent_type = na` is ambiguous

- `na` is 32.3% of the sample.
- It materially affects interpretation of results (and correlates with lower confidence on controls).

Mitigation ideas:

- Separate “prefer not to say” from “not applicable / other”.
- Add a short follow-up: “Which best describes you?” with clearer buckets.

### Pain point 3: Potential social desirability bias

Several questions produce extremely high agreement (e.g., Q2b and Q5b). That’s not necessarily bad, but it makes it harder to differentiate needs.

Mitigation ideas:

- Add scenario nuance: time pressure, repeated conflict history, child temperament, or parent workload.
- Add one “behavioral grounding” prompt: “What did you do last time?” vs “What should you do?”

## Recommendations for next research iteration

- **Increase opt-in conversion** with tighter value framing and a staged opt-in.
- **Disambiguate `na`** into meaningful categories.
- **Add 1–2 validation items** to detect aspirational vs behavioral answers.
- **Recruit more parents with older kids** to avoid early-childhood skew.
- Use the new analytics page (`/digital-parent-quiz/analytics`) to track how distributions shift as new submissions arrive.